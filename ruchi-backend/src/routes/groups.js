const express = require("express");
const {
  getAllGroups,
  getGroupDetails,
  joinGroup,
  leaveGroup,
  getGroupMessages,
  sendGroupMessage,
} = require("../controllers/groupController");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

router.get("/", verifyToken, getAllGroups);
router.get("/:groupId", verifyToken, getGroupDetails);
router.post("/:groupId/join", verifyToken, joinGroup);
router.post("/:groupId/leave", verifyToken, leaveGroup);
router.get("/:groupId/messages", verifyToken, getGroupMessages);
router.post("/:groupId/messages", verifyToken, sendGroupMessage);

module.exports = router;
