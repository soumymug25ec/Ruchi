const pool = require("../config/database");

async function getAllGroups(req, res) {
  try {
    const institutionId = req.user.institutionId;
    const limit = Math.min(parseInt(req.query.limit) || 20, 50);

    const result = await pool.query(
      `SELECT g.id, g.name, g.description, g.member_count, ic.name AS category,
              EXISTS(SELECT 1 FROM group_members gm WHERE gm.group_id = g.id AND gm.user_id = $2) AS is_member
       FROM groups g
       JOIN interest_categories ic ON ic.id = g.category_id
       WHERE g.institution_id = $1
       ORDER BY g.member_count DESC
       LIMIT $3`,
      [institutionId, req.user.userId, limit]
    );

    res.json({ groups: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to load groups" });
  }
}

async function getGroupDetails(req, res) {
  try {
    const { groupId } = req.params;

    const result = await pool.query(
      `SELECT g.id, g.name, g.description, g.member_count, g.created_at, ic.name AS category,
              EXISTS(SELECT 1 FROM group_members gm WHERE gm.group_id = g.id AND gm.user_id = $2) AS is_member
       FROM groups g
       JOIN interest_categories ic ON ic.id = g.category_id
       WHERE g.id = $1`,
      [groupId, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Group not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to load group" });
  }
}

async function joinGroup(req, res) {
  try {
    const { groupId } = req.params;

    await pool.query(
      `INSERT INTO group_members (group_id, user_id) VALUES ($1, $2)
       ON CONFLICT (group_id, user_id) DO NOTHING`,
      [groupId, req.user.userId]
    );
    await pool.query(
      `UPDATE groups SET member_count = (SELECT COUNT(*) FROM group_members WHERE group_id = $1) WHERE id = $1`,
      [groupId]
    );

    res.json({ message: "Joined group successfully", group_id: groupId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to join group" });
  }
}

async function leaveGroup(req, res) {
  try {
    const { groupId } = req.params;

    await pool.query("DELETE FROM group_members WHERE group_id = $1 AND user_id = $2", [
      groupId,
      req.user.userId,
    ]);
    await pool.query(
      `UPDATE groups SET member_count = (SELECT COUNT(*) FROM group_members WHERE group_id = $1) WHERE id = $1`,
      [groupId]
    );

    res.json({ message: "Left group successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to leave group" });
  }
}

async function getGroupMessages(req, res) {
  try {
    const { groupId } = req.params;
    const limit = Math.min(parseInt(req.query.limit) || 50, 100);
    const offset = parseInt(req.query.offset) || 0;

    const result = await pool.query(
      `SELECT gm.id, u.pseudonym AS sender_pseudonym, gm.message_type, gm.content, gm.voice_note_url,
              gm.is_pinned, gm.created_at
       FROM group_messages gm
       JOIN users u ON u.id = gm.sender_id
       WHERE gm.group_id = $1 AND gm.is_deleted = false
       ORDER BY gm.created_at DESC
       LIMIT $2 OFFSET $3`,
      [groupId, limit, offset]
    );

    const group = await pool.query("SELECT name FROM groups WHERE id = $1", [groupId]);

    res.json({ messages: result.rows.reverse(), group_name: group.rows[0]?.name || null });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to load group messages" });
  }
}

async function sendGroupMessage(req, res) {
  try {
    const { groupId } = req.params;
    const { content, message_type } = req.body;

    if (!content) {
      return res.status(400).json({ error: "content is required" });
    }

    const membership = await pool.query(
      "SELECT 1 FROM group_members WHERE group_id = $1 AND user_id = $2",
      [groupId, req.user.userId]
    );
    if (membership.rows.length === 0) {
      return res.status(403).json({ error: "Join the group before posting" });
    }

    const result = await pool.query(
      `INSERT INTO group_messages (group_id, sender_id, message_type, content)
       VALUES ($1, $2, $3, $4)
       RETURNING id, content, created_at`,
      [groupId, req.user.userId, message_type || "text", content]
    );

    const io = req.app.get("io");
    if (io) {
      io.to(`group:${groupId}`).emit("group_message:received", {
        ...result.rows[0],
        sender_pseudonym: req.user.pseudonym,
      });
    }

    res.status(201).json({
      message: { ...result.rows[0], sender_pseudonym: req.user.pseudonym },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send message" });
  }
}

module.exports = {
  getAllGroups,
  getGroupDetails,
  joinGroup,
  leaveGroup,
  getGroupMessages,
  sendGroupMessage,
};
