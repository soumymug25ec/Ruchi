-- Ruchi Platform - PostgreSQL Schema
-- Complete database structure for the platform

-- ============================================
-- 1. INSTITUTIONS
-- ============================================
CREATE TABLE institutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  email_domain VARCHAR(100) NOT NULL UNIQUE,
  city VARCHAR(100),
  country VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 2. USERS
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  password_hash VARCHAR(255) NOT NULL,
  pseudonym VARCHAR(50) NOT NULL UNIQUE,
  
  -- Profile info (optional)
  real_name VARCHAR(255),
  year_of_study VARCHAR(20),
  
  -- Account status
  is_active BOOLEAN DEFAULT TRUE,
  is_moderator BOOLEAN DEFAULT FALSE,
  last_login TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(institution_id, email)
);

CREATE INDEX idx_users_institution ON users(institution_id);
CREATE INDEX idx_users_pseudonym ON users(pseudonym);
CREATE INDEX idx_users_email ON users(email);

-- ============================================
-- 3. INTEREST CATEGORIES (Static)
-- ============================================
CREATE TABLE interest_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  emoji VARCHAR(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed data
INSERT INTO interest_categories (name, description, emoji) VALUES
  ('Anime', 'Anime series, manga, and Japanese animation', '🎌'),
  ('Gaming', 'Video games, esports, game development', '🎮'),
  ('Modeling & Fashion', 'Fashion trends, modeling, design', '👗'),
  ('Health & Fitness', 'Fitness routines, nutrition, wellness', '💪'),
  ('Food & Travel', 'Cooking, food cultures, travel experiences', '🌍'),
  ('History & Politics', 'Historical events, political discussions', '📚'),
  ('Debate & Reading', 'Debate competitions, literature, reading', '📖'),
  ('Music & Pop', 'Music genres, musicians, pop culture', '🎵'),
  ('Movies & Shows', 'Films, TV shows, entertainment', '🎬'),
  ('Tech & Entrepreneurship', 'Technology, startups, innovation', '💻'),
  ('Research & Psychology', 'Research, psychology, science', '🔬');

-- ============================================
-- 4. QUESTIONS FOR INTEREST PROFILING
-- ============================================
CREATE TABLE questionnaire_questions (
  id SERIAL PRIMARY KEY,
  category_id INTEGER NOT NULL REFERENCES interest_categories(id),
  question_text VARCHAR(500) NOT NULL,
  question_order INTEGER NOT NULL,
  parent_question_id INTEGER REFERENCES questionnaire_questions(id),
  parent_answer_value VARCHAR(100), -- If this question appears based on a previous answer
  question_type VARCHAR(20) DEFAULT 'multiple_choice', -- multiple_choice, text, slider
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_questions_category ON questionnaire_questions(category_id);

-- ============================================
-- 5. QUESTION OPTIONS
-- ============================================
CREATE TABLE question_options (
  id SERIAL PRIMARY KEY,
  question_id INTEGER NOT NULL REFERENCES questionnaire_questions(id) ON DELETE CASCADE,
  option_text VARCHAR(255) NOT NULL,
  option_value VARCHAR(100) NOT NULL,
  weight FLOAT DEFAULT 1.0, -- For scoring
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_options_question ON question_options(question_id);

-- ============================================
-- 6. USER INTERESTS (Stores profiling responses)
-- ============================================
CREATE TABLE user_interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id INTEGER NOT NULL REFERENCES interest_categories(id),
  
  -- Responses stored as JSONB for flexibility
  responses JSONB NOT NULL, -- {question_id: answer_value, ...}
  interest_score FLOAT DEFAULT 0, -- Calculated score for this interest
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(user_id, category_id)
);

CREATE INDEX idx_user_interests_user ON user_interests(user_id);
CREATE INDEX idx_user_interests_category ON user_interests(category_id);
CREATE INDEX idx_user_interests_score ON user_interests(interest_score DESC);

-- ============================================
-- 7. MATCHES (User-to-user compatibility)
-- ============================================
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id_1 UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_id_2 UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Overall match score (0-100)
  overall_match_score FLOAT NOT NULL,
  
  -- Breakdown by shared interests
  shared_interests JSONB, -- {category: score, ...}
  num_shared_interests INTEGER DEFAULT 0,
  
  -- Has user initiated chat?
  user_1_initiated BOOLEAN DEFAULT FALSE,
  user_2_initiated BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(user_id_1, user_id_2),
  CHECK (user_id_1 != user_id_2)
);

CREATE INDEX idx_matches_user1 ON matches(user_id_1);
CREATE INDEX idx_matches_user2 ON matches(user_id_2);
CREATE INDEX idx_matches_score ON matches(overall_match_score DESC);

-- ============================================
-- 8. DIRECT MESSAGES (1-on-1 Chat)
-- ============================================
CREATE TABLE direct_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES users(id),
  receiver_id UUID NOT NULL REFERENCES users(id),
  
  message_type VARCHAR(20) DEFAULT 'text', -- text, voice_note
  content TEXT, -- For text messages
  voice_note_url VARCHAR(500), -- For voice notes
  
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CHECK (sender_id != receiver_id)
);

CREATE INDEX idx_messages_sender ON direct_messages(sender_id);
CREATE INDEX idx_messages_receiver ON direct_messages(receiver_id);
CREATE INDEX idx_messages_conversation ON direct_messages(sender_id, receiver_id);
CREATE INDEX idx_messages_created ON direct_messages(created_at DESC);

-- ============================================
-- 9. GROUPS (Interest-based communities)
-- ============================================
CREATE TABLE groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  category_id INTEGER NOT NULL REFERENCES interest_categories(id),
  
  name VARCHAR(255) NOT NULL,
  description TEXT,
  member_count INTEGER DEFAULT 0,
  
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(institution_id, category_id)
);

CREATE INDEX idx_groups_institution ON groups(institution_id);
CREATE INDEX idx_groups_category ON groups(category_id);

-- ============================================
-- 10. GROUP MEMBERS
-- ============================================
CREATE TABLE group_members (
  id SERIAL PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  role VARCHAR(20) DEFAULT 'member', -- member, moderator
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(group_id, user_id)
);

CREATE INDEX idx_group_members_group ON group_members(group_id);
CREATE INDEX idx_group_members_user ON group_members(user_id);

-- ============================================
-- 11. GROUP MESSAGES
-- ============================================
CREATE TABLE group_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id),
  
  message_type VARCHAR(20) DEFAULT 'text', -- text, voice_note
  content TEXT,
  voice_note_url VARCHAR(500),
  
  is_pinned BOOLEAN DEFAULT FALSE,
  is_deleted BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_group_messages_group ON group_messages(group_id);
CREATE INDEX idx_group_messages_sender ON group_messages(sender_id);
CREATE INDEX idx_group_messages_created ON group_messages(created_at DESC);

-- ============================================
-- 12. REPORTED CONTENT (Moderation)
-- ============================================
CREATE TABLE content_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reported_by UUID NOT NULL REFERENCES users(id),
  
  content_type VARCHAR(50), -- direct_message, group_message
  content_id UUID NOT NULL,
  
  reason VARCHAR(255) NOT NULL,
  description TEXT,
  
  status VARCHAR(20) DEFAULT 'pending', -- pending, reviewed, dismissed, action_taken
  moderator_notes TEXT,
  reviewed_by UUID REFERENCES users(id),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TIMESTAMP
);

CREATE INDEX idx_reports_status ON content_reports(status);
CREATE INDEX idx_reports_created ON content_reports(created_at DESC);

-- ============================================
-- 13. MODERATORS (POC per institution)
-- ============================================
CREATE TABLE moderators (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  
  role VARCHAR(50), -- POC, moderator
  responsibilities TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(institution_id, user_id)
);

CREATE INDEX idx_moderators_institution ON moderators(institution_id);

-- ============================================
-- 14. ACTIVITY LOG (For analytics)
-- ============================================
CREATE TABLE activity_logs (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  institution_id UUID NOT NULL REFERENCES institutions(id),
  
  action VARCHAR(100), -- login, profile_update, message_sent, group_joined
  metadata JSONB, -- Additional info about the action
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_activity_user ON activity_logs(user_id);
CREATE INDEX idx_activity_institution ON activity_logs(institution_id);
CREATE INDEX idx_activity_action ON activity_logs(action);

-- ============================================
-- UTILITY FUNCTIONS
-- ============================================

-- Function to update modified timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_users_timestamp BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_user_interests_timestamp BEFORE UPDATE ON user_interests
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_matches_timestamp BEFORE UPDATE ON matches
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_groups_timestamp BEFORE UPDATE ON groups
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_group_messages_timestamp BEFORE UPDATE ON group_messages
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();
