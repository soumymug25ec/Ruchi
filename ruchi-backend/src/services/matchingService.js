const pool = require("../config/database");

/**
 * Similarity between two interest scores on the same category, scaled 0-100.
 * Uses relative closeness rather than raw cosine (single-dimension cosine
 * of two positive scalars always collapses to 1, so it isn't useful alone —
 * this measures how close the two scores are instead).
 */
function categorySimilarity(scoreA, scoreB) {
  const maxScore = Math.max(scoreA, scoreB, 1);
  const diff = Math.abs(scoreA - scoreB);
  return Math.max(0, 100 - (diff / maxScore) * 100);
}

async function getRecommendationsForUser(userId, institutionId, limit, offset) {
  // Pull the requesting user's interest vector.
  const myInterests = await pool.query(
    `SELECT category_id, interest_score FROM user_interests WHERE user_id = $1`,
    [userId]
  );
  const myMap = new Map(myInterests.rows.map((r) => [r.category_id, r.interest_score]));

  if (myMap.size === 0) {
    return { recommendations: [], total_matches: 0 };
  }

  // Candidate users: same institution, active, not self, with at least one interest row.
  const candidates = await pool.query(
    `SELECT DISTINCT u.id, u.pseudonym, u.last_login
     FROM users u
     JOIN user_interests ui ON ui.user_id = u.id
     WHERE u.institution_id = $1 AND u.id != $2 AND u.is_active = true`,
    [institutionId, userId]
  );

  const results = [];

  for (const candidate of candidates.rows) {
    const theirInterests = await pool.query(
      `SELECT ic.name AS category_name, ui.category_id, ui.interest_score
       FROM user_interests ui
       JOIN interest_categories ic ON ic.id = ui.category_id
       WHERE ui.user_id = $1`,
      [candidate.id]
    );

    const sharedInterests = {};
    let weightedSum = 0;
    let weightTotal = 0;

    for (const row of theirInterests.rows) {
      if (myMap.has(row.category_id)) {
        const mine = myMap.get(row.category_id);
        const similarity = categorySimilarity(mine, row.interest_score);
        sharedInterests[row.category_name] = Math.round(similarity);
        weightedSum += similarity;
        weightTotal += 1;
      }
    }

    if (weightTotal === 0) continue; // no shared categories

    let overallScore = weightedSum / weightTotal;

    // Small diversity bonus if they also have interests outside the shared set.
    const uniqueToThem = theirInterests.rows.length - weightTotal;
    if (uniqueToThem > 0) {
      overallScore = Math.min(100, overallScore + Math.min(5, uniqueToThem));
    }

    // Check if a conversation already exists between these two users.
    const messaged = await pool.query(
      `SELECT 1 FROM direct_messages
       WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1)
       LIMIT 1`,
      [userId, candidate.id]
    );

    results.push({
      user_id: candidate.id,
      pseudonym: candidate.pseudonym,
      overall_match_score: Math.round(overallScore),
      shared_interests: sharedInterests,
      num_shared_interests: weightTotal,
      already_messaged: messaged.rows.length > 0,
    });
  }

  results.sort((a, b) => b.overall_match_score - a.overall_match_score);

  return {
    recommendations: results.slice(offset, offset + limit),
    total_matches: results.length,
  };
}

module.exports = { getRecommendationsForUser, categorySimilarity };
