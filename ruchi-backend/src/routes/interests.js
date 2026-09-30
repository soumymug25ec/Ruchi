const express = require("express");
const {
  getCategories,
  startProfiling,
  submitAnswer,
  complete,
  getUserInterests,
} = require("../controllers/interestController");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

router.get("/categories", verifyToken, getCategories);
router.post("/start-profiling", verifyToken, startProfiling);
router.post("/submit-answer", verifyToken, submitAnswer);
router.post("/complete", verifyToken, complete);
router.get("/user-interests", verifyToken, getUserInterests);

module.exports = router;
