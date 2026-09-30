const pool = require("../config/database");

async function getMe(req, res) {
  try {
    const userResult = await pool.query(
      `SELECT u.id, u.pseudonym, u.email_verified, u.institution_id, u.year_of_study, u.created_at,
              i.name AS institution_name
       FROM users u
       JOIN institutions i ON i.id = u.institution_id
       WHERE u.id = $1`,
      [req.user.userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const interestsResult = await pool.query(
      `SELECT ui.category_id, ic.name AS category_name, ui.interest_score, ui.responses, ui.updated_at AS completed_at
       FROM user_interests ui
       JOIN interest_categories ic ON ic.id = ui.category_id
       WHERE ui.user_id = $1
       ORDER BY ui.interest_score DESC`,
      [req.user.userId]
    );

    res.json({ ...userResult.rows[0], interests: interestsResult.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to load profile" });
  }
}

async function updateMe(req, res) {
  try {
    const { year_of_study, real_name } = req.body;

    const result = await pool.query(
      `UPDATE users
       SET year_of_study = COALESCE($1, year_of_study),
           real_name = COALESCE($2, real_name)
       WHERE id = $3
       RETURNING id, pseudonym, year_of_study`,
      [year_of_study ?? null, real_name ?? null, req.user.userId]
    );

    res.json({ message: "Profile updated", user: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update profile" });
  }
}

module.exports = { getMe, updateMe };
