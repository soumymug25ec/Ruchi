const express = require("express");
const { reportContent, getReports, reviewReport } = require("../controllers/moderatorController");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

router.post("/report", verifyToken, reportContent);
router.get("/reports", verifyToken, getReports);
router.post("/reports/:reportId/review", verifyToken, reviewReport);

module.exports = router;
