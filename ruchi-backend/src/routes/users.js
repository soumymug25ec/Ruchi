const express = require("express");
const { getMe, updateMe } = require("../controllers/userController");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

router.get("/me", verifyToken, getMe);
router.put("/me", verifyToken, updateMe);

module.exports = router;
