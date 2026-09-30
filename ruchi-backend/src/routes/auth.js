const express = require("express");
const { signup, verifyEmail, login, logout } = require("../controllers/authController");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

router.post("/signup", signup);
router.post("/verify-email", verifyEmail);
router.post("/login", login);
router.post("/logout", verifyToken, logout);

module.exports = router;
