const pool = require("../config/database");

async function getConversations(req, res) {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 100);

    const result = await pool.query(
      `SELECT
         other.id AS other_user_id,
         other.pseudonym AS other_user_pseudonym,
         last_msg.content AS last_message,
         last_msg.created_at AS last_message_time,
         COUNT(*) FILTER (WHERE dm.receiver_id = $1 AND dm.is_read = false) AS unread_count
       FROM direct_messages dm
       JOIN users other ON other.id = CASE WHEN dm.sender_id = $1 THEN dm.receiver_id ELSE dm.sender_id END
       JOIN LATERAL (
         SELECT content, created_at FROM direct_messages dm2
         WHERE (dm2.sender_id = $1 AND dm2.receiver_id = other.id)
            OR (dm2.sender_id = other.id AND dm2.receiver_id = $1)
         ORDER BY dm2.created_at DESC LIMIT 1
       ) last_msg ON true
       WHERE dm.sender_id = $1 OR dm.receiver_id = $1
       GROUP BY other.id, other.pseudonym, last_msg.content, last_msg.created_at
       ORDER BY last_msg.created_at DESC
       LIMIT $2`,
      [req.user.userId, limit]
    );

    res.json({ conversations: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to load conversations" });
  }
}

async function getMessages(req, res) {
  try {
    const otherUserId = req.params.userId;
    const limit = Math.min(parseInt(req.query.limit) || 50, 100);
    const offset = parseInt(req.query.offset) || 0;

    const result = await pool.query(
      `SELECT id, sender_id, receiver_id, message_type, content, voice_note_url, created_at, is_read
       FROM direct_messages
       WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1)
       ORDER BY created_at DESC
       LIMIT $3 OFFSET $4`,
      [req.user.userId, otherUserId, limit, offset]
    );

    const other = await pool.query("SELECT pseudonym FROM users WHERE id = $1", [otherUserId]);

    res.json({
      messages: result.rows.reverse(),
      other_user_pseudonym: other.rows[0]?.pseudonym || null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to load messages" });
  }
}

async function sendMessage(req, res) {
  try {
    const { receiver_id, content, message_type } = req.body;

    if (!receiver_id || !content) {
      return res.status(400).json({ error: "receiver_id and content are required" });
    }
    if (receiver_id === req.user.userId) {
      return res.status(400).json({ error: "Cannot message yourself" });
    }

    const receiverCheck = await pool.query(
      "SELECT institution_id FROM users WHERE id = $1",
      [receiver_id]
    );
    if (receiverCheck.rows.length === 0) {
      return res.status(404).json({ error: "Recipient not found" });
    }
    if (receiverCheck.rows[0].institution_id !== req.user.institutionId) {
      return res.status(403).json({ error: "Can only message users at your institution" });
    }

    const result = await pool.query(
      `INSERT INTO direct_messages (sender_id, receiver_id, message_type, content)
       VALUES ($1, $2, $3, $4)
       RETURNING id, sender_id, receiver_id, content, created_at`,
      [req.user.userId, receiver_id, message_type || "text", content]
    );

    const message = result.rows[0];

    // Emit over the shared socket.io instance if one is attached to the app.
    const io = req.app.get("io");
    if (io) {
      io.to(`user:${receiver_id}`).emit("message:received", message);
    }

    res.status(201).json({ message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send message" });
  }
}

async function markAsRead(req, res) {
  try {
    const { other_user_id } = req.body;
    await pool.query(
      `UPDATE direct_messages SET is_read = true, read_at = CURRENT_TIMESTAMP
       WHERE sender_id = $1 AND receiver_id = $2 AND is_read = false`,
      [other_user_id, req.user.userId]
    );
    res.json({ message: "Messages marked as read" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to mark messages as read" });
  }
}

module.exports = { getConversations, getMessages, sendMessage, markAsRead };
