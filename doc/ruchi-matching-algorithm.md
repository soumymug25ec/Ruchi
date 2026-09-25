# Ruchi Matching Algorithm

## Overview
The matching algorithm calculates compatibility between users based on their interest profiles. It uses a combination of:
1. **Category-level scoring** (Cosine similarity on interest vectors)
2. **Preference-level scoring** (Detailed response comparison)
3. **Weighted overall score** (Combination with importance weighting)

---

## 1. Interest Scoring System

### Per-Category Score Calculation

Each user gets a score (0-100) for each interest category based on their responses.

**Formula:**
```
category_score = (sum of weighted responses / max possible weight) * 100
```

**Example: Anime Category**
```
Question 1: "Favorite genre?" 
  - Action = 20 points
  - Romance = 15 points
  - Slice of Life = 10 points
  - User chose: Action = 20 points

Question 2: "Manga vs Anime?"
  - Manga only = 15 points
  - Anime only = 20 points
  - Both equally = 18 points
  - User chose: Both equally = 18 points

Question 3: "Dubbed or Subbed?"
  - Dubbed = 12 points
  - Subbed = 20 points
  - No preference = 15 points
  - User chose: Subbed = 20 points

Total Score = (20 + 18 + 20) / (20 + 20 + 20) * 100 = 58/60 * 100 = 96.67/100
```

### Response Vectors
Each user is represented as a vector in the interest space:

```
User_8374 = {
  "Anime": 96.67,
  "Gaming": 88.5,
  "Tech & Entrepreneurship": 92.1,
  "Food & Travel": 45.2,
  ...
}

User_5821 = {
  "Anime": 92.3,
  "Gaming": 85.0,
  "Tech & Entrepreneurship": 78.9,
  "Movies & Shows": 88.7,
  ...
}
```

---

## 2. Cosine Similarity (Category-Level Matching)

For each shared interest category, calculate cosine similarity:

**Formula:**
```
cosine_similarity(v1, v2) = (v1 · v2) / (||v1|| * ||v2||)
```

**Example: Anime Category**
```
User_8374 Anime score: 96.67
User_5821 Anime score: 92.3

Dot product: 96.67 * 92.3 = 8918.74
Magnitude User_8374: √(96.67²) = 96.67
Magnitude User_5821: √(92.3²) = 92.3

Cosine Similarity = 8918.74 / (96.67 * 92.3) = 8918.74 / 8918.74 = 1.0
(Perfect alignment in scores, though actual score difference matters)

// More realistic with preference differences:
If responses differ:
  Cosine Similarity = 0.95 (95% compatible)
```

**Per-Category Score:**
```
Anime match: cosine_similarity * 100 = 95 points
Gaming match: cosine_similarity * 100 = 88 points
Tech & Entrepreneurship match: cosine_similarity * 100 = 78 points
```

---

## 3. Overall Match Score Calculation

**Step 1: Identify Shared Categories**
```
User_8374 interests: [Anime, Gaming, Tech & Entrepreneurship, Food & Travel]
User_5821 interests: [Anime, Gaming, Tech & Entrepreneurship, Movies & Shows]

Shared: [Anime, Gaming, Tech & Entrepreneurship] (3 categories)
User_8374 unique: [Food & Travel]
User_5821 unique: [Movies & Shows]
```

**Step 2: Weight by Importance**
Shared interests are weighted by their importance (lower categories get less weight):

```
Anime (primary for User_8374): weight = 1.0
Gaming (primary for User_5821): weight = 1.0
Tech & Entrepreneurship (both interested): weight = 0.8
```

**Step 3: Calculate Weighted Average**
```
Overall Match Score = 
  (Anime_match * 1.0 + Gaming_match * 1.0 + Tech_match * 0.8) 
  / (1.0 + 1.0 + 0.8)

= (95 * 1.0 + 88 * 1.0 + 78 * 0.8) / 2.8
= (95 + 88 + 62.4) / 2.8
= 245.4 / 2.8
= 87.6 ≈ 88/100
```

**Step 4: Boost for Diversity**
If users share interests in different categories (not just overlapping):
```
Diversity bonus = +2 to +5 points

Final Score = 88 + 3 = 91/100
```

---

## 4. Preference-Level Matching

Beyond category matching, compare specific preference answers:

```
User_8374 Anime responses: {
  "genre": "action",
  "format": "anime",
  "lang": "subbed"
}

User_5821 Anime responses: {
  "genre": "action",
  "format": "both",
  "lang": "subbed"
}

Matching preferences: 3 out of 3 = 100%
(Both like action, both prefer subbed, slight difference in format)

Detailed match breakdown:
- Genre (action/action): 100% match ✓
- Format (anime/both): 90% match (User_5821 open to anime) 
- Language (subbed/subbed): 100% match ✓

Average: 96.7% match on detailed preferences
```

---

## 5. Recommendation Ranking

### Algorithm Flow:
```
1. For each other user in the institution:
   a. Calculate interest vectors
   b. Find shared categories
   c. Calculate cosine similarity per category
   d. Calculate weighted overall score
   e. Add diversity bonus if applicable
   f. Compare detailed preferences
   g. Apply final adjustment

2. Sort by overall match score (descending)

3. Apply ranking adjustments:
   - Already messaged users: slight boost (already established)
   - Recently active users: boost (likely to respond)
   - Inactive users (>30 days): small penalty

4. Return top 20 recommendations
```

### Example Result:
```json
{
  "recommendations": [
    {
      "user_id": "uuid-1",
      "pseudonym": "User_5821",
      "overall_match_score": 91,
      "breakdown": {
        "shared_interests": {
          "Anime": 95,
          "Gaming": 88,
          "Tech & Entrepreneurship": 78
        },
        "num_shared": 3,
        "diversity_bonus": 3
      },
      "recent_activity": "15 mins ago",
      "already_messaged": false
    },
    {
      "user_id": "uuid-2",
      "pseudonym": "User_3102",
      "overall_match_score": 78,
      "breakdown": {
        "shared_interests": {
          "Anime": 92,
          "Movies & Shows": 65
        },
        "num_shared": 2,
        "diversity_bonus": 0
      },
      "recent_activity": "3 days ago",
      "already_messaged": true
    }
  ]
}
```

---

## 6. Cold Start Problem (New Users)

For users with incomplete interest profiles:

**Scenario:** User only completed 2 out of 11 interest categories

```
Solution:
1. Show matches based on available interests only
2. Mark as "Based on limited profile"
3. Boost recommendations if they complete more interests
4. Use institution-wide popular categories as fallback

Example:
"You've completed Anime & Gaming. 
Based on what's popular in your college, 
you might also enjoy Tech & Entrepreneurship."
```

---

## 7. Re-matching Trigger

Recalculate matches when:
- User completes a new interest profile
- User updates responses to an existing interest
- New user joins the institution
- User hasn't seen matches in >7 days (re-sort by recent activity)

---

## 8. Performance Optimization

### Indexing Strategy:
```sql
-- Speed up match queries
CREATE INDEX idx_user_interests_score ON user_interests(interest_score DESC);
CREATE INDEX idx_user_interests_category ON user_interests(category_id);
CREATE INDEX idx_matches_score ON matches(overall_match_score DESC);
```

### Caching:
- Cache user interest vectors (invalidate on profile update)
- Cache matches for each user (expires every 24 hours)
- Pre-compute matches for new user during signup completion

### Batch Processing:
```
For large institutions (1000+ users):
- Run match recalculation as async job
- Prioritize active users
- Cache top 100 matches per user
```

---

## 9. Privacy Considerations

The matching algorithm:
- ❌ Does NOT show exact response details to other users
- ✅ Only shows category scores and overall match percentage
- ✅ Never reveals if users viewed each other
- ✅ Pseudonym-only (no identity exposure)

---

## 10. Example: Complete Matching Walkthrough

**User A (Soumy - User_8374):**
```
Anime: 96.67 (loves action anime, subbed)
Gaming: 88.5 (FPS games, online)
Tech & Entrepreneurship: 92.1 (interested in startups)
Food & Travel: 45.2 (casual interest)
```

**User B (User_5821):**
```
Anime: 92.3 (action anime, both dubbed/subbed)
Gaming: 85.0 (FPS games, single-player)
Tech & Entrepreneurship: 78.9 (learning web dev)
Movies & Shows: 88.7 (cinephile)
```

**Matching Calculation:**
```
Shared categories: [Anime, Gaming, Tech & Entrepreneurship]

Cosine Similarity:
- Anime: 95 (high compatibility in preferences)
- Gaming: 88 (good match, slight difference in playstyle)
- Tech & Entrepreneurship: 78 (both interested but different depths)

Weights:
- Anime (both primary): 1.0
- Gaming (both primary): 1.0
- Tech (both secondary): 0.8

Weighted Score:
= (95*1.0 + 88*1.0 + 78*0.8) / 2.8
= 245.4 / 2.8
= 87.6

Diversity Bonus: +3 (different: Food & Travel vs Movies & Shows)

Final Match Score: 91/100 ✓
```

---

## 11. SQL for Match Calculation (Pseudo-code)

```sql
-- Calculate match between two users
SELECT 
  u1.id as user_1_id,
  u2.id as user_2_id,
  
  -- Shared interests
  COUNT(DISTINCT ui1.category_id) as shared_count,
  
  -- Overall score calculation (simplified)
  ROUND(
    AVG(
      (ABS(ui1.interest_score - ui2.interest_score) 
       / GREATEST(ui1.interest_score, ui2.interest_score)) * 100
    )
  ) as overall_match_score
  
FROM users u1
CROSS JOIN users u2
LEFT JOIN user_interests ui1 ON u1.id = ui1.user_id
LEFT JOIN user_interests ui2 ON u2.id = ui2.user_id 
  AND ui1.category_id = ui2.category_id

WHERE u1.institution_id = u2.institution_id
  AND u1.id < u2.id
  AND u1.is_active = true
  AND u2.is_active = true

GROUP BY u1.id, u2.id
ORDER BY overall_match_score DESC;
```

---

## Next Steps

Once you build this logic:
1. Create **MatchingService.js** with these algorithms
2. Add **cron job** for daily re-matching
3. Build **recommendation API** to return sorted matches
4. Create **match detail endpoints** for frontend
