const pool = require("../config/database");

async function getCategories(req, res) {
  try {
    const result = await pool.query(
      "SELECT id, name, emoji, description FROM interest_categories ORDER BY id"
    );
    res.json({ categories: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to load categories" });
  }
}

async function getQuestionWithOptions(categoryId, order) {
  const qResult = await pool.query(
    `SELECT id, question_text, question_type
     FROM questionnaire_questions
     WHERE category_id = $1 AND question_order = $2`,
    [categoryId, order]
  );
  if (qResult.rows.length === 0) return null;

  const question = qResult.rows[0];
  const optionsResult = await pool.query(
    "SELECT option_value AS value, option_text AS text FROM question_options WHERE question_id = $1",
    [question.id]
  );
  return { ...question, options: optionsResult.rows };
}

async function countQuestionsForCategory(categoryId) {
  const result = await pool.query(
    "SELECT COUNT(*)::int AS count FROM questionnaire_questions WHERE category_id = $1",
    [categoryId]
  );
  return result.rows[0].count;
}

async function startProfiling(req, res) {
  try {
    const { category_id } = req.body;
    if (!category_id) {
      return res.status(400).json({ error: "category_id is required" });
    }

    const total = await countQuestionsForCategory(category_id);
    if (total === 0) {
      return res.status(404).json({ error: "No questions configured for this category yet" });
    }

    const question = await getQuestionWithOptions(category_id, 1);

    // Ensure a user_interests row exists so submit-answer can upsert into it.
    await pool.query(
      `INSERT INTO user_interests (user_id, category_id, responses)
       VALUES ($1, $2, '{}'::jsonb)
       ON CONFLICT (user_id, category_id) DO NOTHING`,
      [req.user.userId, category_id]
    );

    res.json({ current_question: question, progress: `1/${total}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to start profiling" });
  }
}

async function submitAnswer(req, res) {
  try {
    const { category_id, question_id, answer_value } = req.body;
    if (!category_id || !question_id || !answer_value) {
      return res.status(400).json({ error: "category_id, question_id, and answer_value are required" });
    }

    const qResult = await pool.query(
      "SELECT question_order FROM questionnaire_questions WHERE id = $1 AND category_id = $2",
      [question_id, category_id]
    );
    if (qResult.rows.length === 0) {
      return res.status(404).json({ error: "Question not found" });
    }
    const currentOrder = qResult.rows[0].question_order;

    await pool.query(
      `INSERT INTO user_interests (user_id, category_id, responses)
       VALUES ($1, $2, jsonb_build_object($3::text, $4::text))
       ON CONFLICT (user_id, category_id)
       DO UPDATE SET responses = user_interests.responses || jsonb_build_object($3::text, $4::text),
                     updated_at = CURRENT_TIMESTAMP`,
      [req.user.userId, category_id, String(question_id), answer_value]
    );

    const total = await countQuestionsForCategory(category_id);
    const nextOrder = currentOrder + 1;

    if (nextOrder > total) {
      return res.json({ next_question: null, progress: `${total}/${total}`, ready_to_complete: true });
    }

    const nextQuestion = await getQuestionWithOptions(category_id, nextOrder);
    res.json({ next_question: nextQuestion, progress: `${nextOrder}/${total}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to submit answer" });
  }
}

async function complete(req, res) {
  try {
    const { category_id } = req.body;
    if (!category_id) {
      return res.status(400).json({ error: "category_id is required" });
    }

    const row = await pool.query(
      "SELECT responses FROM user_interests WHERE user_id = $1 AND category_id = $2",
      [req.user.userId, category_id]
    );
    if (row.rows.length === 0) {
      return res.status(404).json({ error: "No responses found for this category" });
    }

    const responses = row.rows[0].responses || {};
    const questionIds = Object.keys(responses);

    let totalWeight = 0;
    let maxPossible = 0;

    for (const qId of questionIds) {
      const answerValue = responses[qId];
      const optResult = await pool.query(
        "SELECT weight FROM question_options WHERE question_id = $1 AND option_value = $2",
        [qId, answerValue]
      );
      const weight = optResult.rows[0]?.weight ?? 1.0;
      totalWeight += weight;

      const maxResult = await pool.query(
        "SELECT MAX(weight) AS max_weight FROM question_options WHERE question_id = $1",
        [qId]
      );
      maxPossible += maxResult.rows[0]?.max_weight ?? 1.0;
    }

    const interestScore = maxPossible > 0 ? Math.round((totalWeight / maxPossible) * 100) : 0;

    await pool.query(
      "UPDATE user_interests SET interest_score = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 AND category_id = $3",
      [interestScore, req.user.userId, category_id]
    );

    const categoryResult = await pool.query(
      "SELECT name FROM interest_categories WHERE id = $1",
      [category_id]
    );

    res.json({
      message: "Interest profiling complete",
      interest: {
        category: categoryResult.rows[0]?.name,
        interest_score: interestScore,
        responses,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to complete profiling" });
  }
}

async function getUserInterests(req, res) {
  try {
    const result = await pool.query(
      `SELECT ui.category_id, ic.name AS category_name, ic.emoji, ui.interest_score, ui.responses, ui.updated_at AS completed_at
       FROM user_interests ui
       JOIN interest_categories ic ON ic.id = ui.category_id
       WHERE ui.user_id = $1
       ORDER BY ui.interest_score DESC`,
      [req.user.userId]
    );
    res.json({ interests: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to load interests" });
  }
}

module.exports = { getCategories, startProfiling, submitAnswer, complete, getUserInterests };
