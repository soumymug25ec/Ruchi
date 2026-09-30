const pool = require("../config/database");

async function reportContent(req, res) {
  try {
    const { content_type, content_id, reason, description } = req.body;

    if (!content_type || !content_id || !reason) {
      return res.status(400).json({ error: "content_type, content_id, and reason are required" });
    }

    const result = await pool.query(
      `INSERT INTO content_reports (reported_by, content_type, content_id, reason, description)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, status`,
      [req.user.userId, content_type, content_id, reason, description || null]
    );

    res.status(201).json({ report_id: result.rows[0].id, status: result.rows[0].status });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to submit report" });
  }
}

async function getReports(req, res) {
  try {
    if (!req.user.isModerator) {
      return res.status(403).json({ error: "Moderator access required" });
    }

    const status = req.query.status || "pending";
    const result = await pool.query(
      `SELECT cr.id, u.pseudonym AS reported_by_pseudonym, cr.content_type, cr.content_id,
              cr.reason, cr.description, cr.created_at
       FROM content_reports cr
       JOIN users u ON u.id = cr.reported_by
       WHERE cr.status = $1
       ORDER BY cr.created_at DESC`,
      [status]
    );

    res.json({ reports: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to load reports" });
  }
}

async function reviewReport(req, res) {
  try {
    if (!req.user.isModerator) {
      return res.status(403).json({ error: "Moderator access required" });
    }

    const { reportId } = req.params;
    const { decision, moderator_notes } = req.body;
    const status = decision === "action_taken" ? "action_taken" : "dismissed";

    await pool.query(
      `UPDATE content_reports
       SET status = $1, moderator_notes = $2, reviewed_by = $3, reviewed_at = CURRENT_TIMESTAMP
       WHERE id = $4`,
      [status, moderator_notes || null, req.user.userId, reportId]
    );

    res.json({ message: "Report reviewed", status });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to review report" });
  }
}

module.exports = { reportContent, getReports, reviewReport };
