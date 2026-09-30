const jwt = require("jsonwebtoken");
const pool = require("../config/database");

function attachSocket(io) {
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("No token provided"));
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const { userId } = socket.user;
    socket.join(`user:${userId}`);
    console.log(`Socket connected: ${socket.user.pseudonym} (${socket.id})`);

    socket.on("message:send", async ({ receiver_id, content }) => {
      if (!receiver_id || !content) return;
      try {
        const result = await pool.query(
          `INSERT INTO direct_messages (sender_id, receiver_id, message_type, content)
           VALUES ($1, $2, 'text', $3)
           RETURNING id, sender_id, receiver_id, content, created_at`,
          [userId, receiver_id, content]
        );
        const message = result.rows[0];
        io.to(`user:${receiver_id}`).emit("message:received", message);
        socket.emit("message:sent_ack", message);
      } catch (err) {
        console.error("socket message:send error", err);
      }
    });

    socket.on("typing:start", ({ receiver_id }) => {
      io.to(`user:${receiver_id}`).emit("typing:indicator", {
        user_id: userId,
        is_typing: true,
      });
    });

    socket.on("typing:stop", ({ receiver_id }) => {
      io.to(`user:${receiver_id}`).emit("typing:indicator", {
        user_id: userId,
        is_typing: false,
      });
    });

    socket.on("group:join", ({ group_id }) => {
      socket.join(`group:${group_id}`);
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.user.pseudonym}`);
    });
  });
}

module.exports = { attachSocket };
