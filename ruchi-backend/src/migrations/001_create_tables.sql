-- Ruchi Platform - PostgreSQL Schema (001)

CREATE EXTENSION IF NOT EXISTS pgcrypto;

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
  verification_code VARCHAR(10),
  password_hash VARCHAR(255) NOT NULL,
  pseudonym VARCHAR(50) NOT NULL UNIQUE,

  real_name VARCHAR(255),
  year_of_study VARCHAR(20),

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

-- ============================================
-- 4. QUESTIONS FOR INTEREST PROFILING
-- ============================================
CREATE TABLE questionnaire_questions (
  id SERIAL PRIMARY KEY,
  category_id INTEGER NOT NULL REFERENCES interest_categories(id),
  question_text VARCHAR(500) NOT NULL,
  question_order INTEGER NOT NULL,
  question_type VARCHAR(20) DEFAULT 'multiple_choice',
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
  weight FLOAT DEFAULT 1.0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_options_question ON question_options(question_id);

-- ============================================
-- 6. USER INTERESTS
-- ============================================
CREATE TABLE user_interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id INTEGER NOT NULL REFERENCES interest_categories(id),

  responses JSONB NOT NULL DEFAULT '{}'::jsonb,
  interest_score FLOAT DEFAULT 0,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(user_id, category_id)
);

CREATE INDEX idx_user_interests_user ON user_interests(user_id);
CREATE INDEX idx_user_interests_category ON user_interests(category_id);
CREATE INDEX idx_user_interests_score ON user_interests(interest_score DESC);

-- ============================================
-- 7. DIRECT MESSAGES
-- ============================================
CREATE TABLE direct_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES users(id),
  receiver_id UUID NOT NULL REFERENCES users(id),

  message_type VARCHAR(20) DEFAULT 'text',
  content TEXT,
  voice_note_url VARCHAR(500),

  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CHECK (sender_id != receiver_id)
);

CREATE INDEX idx_messages_sender ON direct_messages(sender_id);
CREATE INDEX idx_messages_receiver ON direct_messages(receiver_id);
CREATE INDEX idx_messages_created ON direct_messages(created_at DESC);

-- ============================================
-- 8. GROUPS
-- ============================================
CREATE TABLE groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  category_id INTEGER NOT NULL REFERENCES interest_categories(id),

  name VARCHAR(255) NOT NULL,
  description TEXT,
  member_count INTEGER DEFAULT 0,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(institution_id, category_id)
);

CREATE INDEX idx_groups_institution ON groups(institution_id);

-- ============================================
-- 9. GROUP MEMBERS
-- ============================================
CREATE TABLE group_members (
  id SERIAL PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  role VARCHAR(20) DEFAULT 'member',
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(group_id, user_id)
);

CREATE INDEX idx_group_members_group ON group_members(group_id);
CREATE INDEX idx_group_members_user ON group_members(user_id);

-- ============================================
-- 10. GROUP MESSAGES
-- ============================================
CREATE TABLE group_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id),

  message_type VARCHAR(20) DEFAULT 'text',
  content TEXT,
  voice_note_url VARCHAR(500),

  is_pinned BOOLEAN DEFAULT FALSE,
  is_deleted BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_group_messages_group ON group_messages(group_id);
CREATE INDEX idx_group_messages_created ON group_messages(created_at DESC);

-- ============================================
-- 11. CONTENT REPORTS (Moderation)
-- ============================================
CREATE TABLE content_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reported_by UUID NOT NULL REFERENCES users(id),

  content_type VARCHAR(50),
  content_id UUID NOT NULL,

  reason VARCHAR(255) NOT NULL,
  description TEXT,

  status VARCHAR(20) DEFAULT 'pending',
  moderator_notes TEXT,
  reviewed_by UUID REFERENCES users(id),

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TIMESTAMP
);

CREATE INDEX idx_reports_status ON content_reports(status);
