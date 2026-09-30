-- Ruchi Platform - Seed Data (002)

INSERT INTO interest_categories (name, description, emoji) VALUES
  ('Anime & Manga', 'Anime series, manga, and Japanese animation', '🎌'),
  ('Gaming', 'Video games, esports, game development', '🎮'),
  ('Modeling & Fashion', 'Fashion trends, modeling, design', '👗'),
  ('Health & Fitness', 'Fitness routines, nutrition, wellness', '💪'),
  ('Food & Travel', 'Cooking, food cultures, travel experiences', '✈️'),
  ('History & Society', 'Historical events, political discussions', '📜'),
  ('Debate & Reading', 'Debate competitions, literature, reading', '📚'),
  ('Music & Pop Culture', 'Music genres, musicians, pop culture', '🎵'),
  ('Movies & Shows', 'Films, TV shows, entertainment', '🎬'),
  ('Tech & Entrepreneurship', 'Technology, startups, innovation', '💻'),
  ('Psychology & Research', 'Research, psychology, science', '🧠');

-- Questions for Anime & Manga (category_id 1)
INSERT INTO questionnaire_questions (category_id, question_text, question_order) VALUES
  (1, 'Which anime genre do you prefer?', 1),
  (1, 'One Piece or Attack on Titan?', 2),
  (1, 'Dubbed or subbed?', 3);

INSERT INTO question_options (question_id, option_text, option_value, weight)
SELECT id, 'Action', 'action', 1.0 FROM questionnaire_questions WHERE category_id = 1 AND question_order = 1
UNION ALL
SELECT id, 'Romance', 'romance', 1.0 FROM questionnaire_questions WHERE category_id = 1 AND question_order = 1
UNION ALL
SELECT id, 'Slice of Life', 'slice_of_life', 1.0 FROM questionnaire_questions WHERE category_id = 1 AND question_order = 1
UNION ALL
SELECT id, 'Fantasy', 'fantasy', 1.0 FROM questionnaire_questions WHERE category_id = 1 AND question_order = 1;

INSERT INTO question_options (question_id, option_text, option_value, weight)
SELECT id, 'One Piece', 'one_piece', 1.0 FROM questionnaire_questions WHERE category_id = 1 AND question_order = 2
UNION ALL
SELECT id, 'Attack on Titan', 'aot', 1.0 FROM questionnaire_questions WHERE category_id = 1 AND question_order = 2
UNION ALL
SELECT id, 'Both!', 'both', 1.0 FROM questionnaire_questions WHERE category_id = 1 AND question_order = 2;

INSERT INTO question_options (question_id, option_text, option_value, weight)
SELECT id, 'Dubbed', 'dubbed', 1.0 FROM questionnaire_questions WHERE category_id = 1 AND question_order = 3
UNION ALL
SELECT id, 'Subbed', 'subbed', 1.0 FROM questionnaire_questions WHERE category_id = 1 AND question_order = 3
UNION ALL
SELECT id, 'No preference', 'no_preference', 1.0 FROM questionnaire_questions WHERE category_id = 1 AND question_order = 3;

-- Questions for Gaming (category_id 2)
INSERT INTO questionnaire_questions (category_id, question_text, question_order) VALUES
  (2, 'What do you mostly play?', 1),
  (2, 'Console, PC, or mobile?', 2);

INSERT INTO question_options (question_id, option_text, option_value, weight)
SELECT id, 'FPS / Shooters', 'fps', 1.0 FROM questionnaire_questions WHERE category_id = 2 AND question_order = 1
UNION ALL
SELECT id, 'MOBA', 'moba', 1.0 FROM questionnaire_questions WHERE category_id = 2 AND question_order = 1
UNION ALL
SELECT id, 'RPG', 'rpg', 1.0 FROM questionnaire_questions WHERE category_id = 2 AND question_order = 1
UNION ALL
SELECT id, 'Mobile games', 'mobile_games', 1.0 FROM questionnaire_questions WHERE category_id = 2 AND question_order = 1;

INSERT INTO question_options (question_id, option_text, option_value, weight)
SELECT id, 'Console', 'console', 1.0 FROM questionnaire_questions WHERE category_id = 2 AND question_order = 2
UNION ALL
SELECT id, 'PC', 'pc', 1.0 FROM questionnaire_questions WHERE category_id = 2 AND question_order = 2
UNION ALL
SELECT id, 'Mobile', 'mobile', 1.0 FROM questionnaire_questions WHERE category_id = 2 AND question_order = 2;

-- Questions for Tech & Entrepreneurship (category_id 10)
INSERT INTO questionnaire_questions (category_id, question_text, question_order) VALUES
  (10, 'What excites you more?', 1),
  (10, 'Are you working on a startup or side project?', 2);

INSERT INTO question_options (question_id, option_text, option_value, weight)
SELECT id, 'Building products', 'building', 1.0 FROM questionnaire_questions WHERE category_id = 10 AND question_order = 1
UNION ALL
SELECT id, 'Research & papers', 'research', 1.0 FROM questionnaire_questions WHERE category_id = 10 AND question_order = 1
UNION ALL
SELECT id, 'Business & fundraising', 'business', 1.0 FROM questionnaire_questions WHERE category_id = 10 AND question_order = 1;

INSERT INTO question_options (question_id, option_text, option_value, weight)
SELECT id, 'Yes, actively', 'yes_active', 1.0 FROM questionnaire_questions WHERE category_id = 10 AND question_order = 2
UNION ALL
SELECT id, 'Have an idea', 'yes_idea', 1.0 FROM questionnaire_questions WHERE category_id = 10 AND question_order = 2
UNION ALL
SELECT id, 'Not yet', 'no', 1.0 FROM questionnaire_questions WHERE category_id = 10 AND question_order = 2;

-- Test institution for local development
INSERT INTO institutions (name, email_domain, city, country) VALUES
  ('KIIT Bhubaneswar', 'kiit.ac.in', 'Bhubaneswar', 'India'),
  ('BITS Pilani', 'bits-pilani.ac.in', 'Pilani', 'India'),
  ('Delhi University', 'du.ac.in', 'Delhi', 'India');
