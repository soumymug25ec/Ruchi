const express = require("express");
const {
  getConversations,
  getMessages,
  sendMessage,
  markAsRead,
} = require("../controllers/chatController");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

router.get("/conversations", verifyToken, getConversations);
router.get("/messages/:userId", verifyToken, getMessages);
router.post("/messages", verifyToken, sendMessage);
router.post("/mark-read", verifyToken, markAsRead);

module.exports = router;
