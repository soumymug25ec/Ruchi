const express = require("express");
const { getRecommendations } = require("../controllers/matchController");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

router.get("/recommendations", verifyToken, getRecommendations);

module.exports = router;
