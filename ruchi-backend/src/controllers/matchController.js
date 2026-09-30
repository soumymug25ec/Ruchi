const { getRecommendationsForUser } = require("../services/matchingService");

async function getRecommendations(req, res) {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 20, 50);
    const offset = parseInt(req.query.offset) || 0;

    const { recommendations, total_matches } = await getRecommendationsForUser(
      req.user.userId,
      req.user.institutionId,
      limit,
      offset
    );

    res.json({ recommendations, total_matches, page: Math.floor(offset / limit) + 1 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to load recommendations" });
  }
}

module.exports = { getRecommendations };
