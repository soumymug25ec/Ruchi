# Ruchi Backend - Quick Start Guide

## Phase 1: Setup (30 mins)

### 1. Initialize Project
```bash
mkdir ruchi-backend
cd ruchi-backend
npm init -y
```

### 2. Install Dependencies
```bash
npm install express pg jsonwebtoken bcryptjs dotenv cors helmet joi socket.io uuid
npm install --save-dev nodemon jest
```

### 3. Create Directory Structure
```bash
mkdir src
mkdir src/{config,middleware,controllers,services,models,routes,utils,migrations}
touch .env .gitignore server.js
```

### 4. Setup .env File
```env
NODE_ENV=development
PORT=5000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ruchi_db
DB_USER=ruchi_user
DB_PASSWORD=ruchi_secure_password

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Email (for verification)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Institutions (comma-separated email domains)
ALLOWED_INSTITUTIONS=kiit.ac.in,bits-pilani.ac.in,du.ac.in,iitk.ac.in

# File Storage
STORAGE_TYPE=local # or aws_s3
LOCAL_STORAGE_PATH=./uploads/voice_notes
```

### 5. Setup PostgreSQL (Using Docker)

**Option A: Docker Compose**
```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: ruchi_db
      POSTGRES_USER: ruchi_user
      POSTGRES_PASSWORD: ruchi_secure_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

```bash
docker-compose up -d
```

**Option B: Local PostgreSQL**
```bash
# On macOS
brew install postgresql
brew services start postgresql

# Create database
psql -U postgres
CREATE DATABASE ruchi_db;
CREATE USER ruchi_user WITH PASSWORD 'ruchi_secure_password';
GRANT ALL PRIVILEGES ON DATABASE ruchi_db TO ruchi_user;
```

### 6. Create Database Schema
```bash
psql -U ruchi_user -d ruchi_db -f src/migrations/001_create_tables.sql
```

Copy the entire SQL schema from `ruchi-database-schema.sql` into:
```
src/migrations/001_create_tables.sql
```

---

## Phase 2: Core Backend Setup (1-2 hours)

### 1. **src/config/database.js** - Database Connection
```javascript
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

module.exports = pool;
```

### 2. **src/config/constants.js** - App Constants
```javascript
const INTEREST_CATEGORIES = [
  { id: 1, name: 'Anime', emoji: '🎌' },
  { id: 2, name: 'Gaming', emoji: '🎮' },
  { id: 3, name: 'Modeling & Fashion', emoji: '👗' },
  // ... rest of categories
];

const ALLOWED_INSTITUTIONS = (
  process.env.ALLOWED_INSTITUTIONS || ''
).split(',').map(d => d.trim());

module.exports = {
  INTEREST_CATEGORIES,
  ALLOWED_INSTITUTIONS,
};
```

### 3. **src/utils/emailValidator.js** - Email Verification
```javascript
const { ALLOWED_INSTITUTIONS } = require('../config/constants');

function validateInstitutionEmail(email) {
  const domain = email.split('@')[1];
  return ALLOWED_INSTITUTIONS.includes(domain);
}

module.exports = { validateInstitutionEmail };
```

### 4. **src/utils/generatePseudonym.js** - Pseudonym Generator
```javascript
function generatePseudonym() {
  const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `User_${randomNum}`;
}

module.exports = { generatePseudonym };
```

### 5. **src/middleware/auth.js** - JWT Verification
```javascript
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = { verifyToken };
```

### 6. **src/app.js** - Express Setup
```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes (we'll add these soon)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/interests', require('./routes/interests'));
app.use('/api/matches', require('./routes/matches'));

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
```

### 7. **server.js** - Entry Point
```javascript
const app = require('./src/app');
const { Server } = require('socket.io');
const http = require('http');

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Setup WebSocket for real-time chat
const io = new Server(server, {
  cors: { origin: '*' }
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Ruchi server running on port ${PORT}`);
});
```

### 8. **package.json** - Update scripts
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest"
  }
}
```

---

## Phase 3: Auth Endpoints (1 hour)

### **src/controllers/authController.js**
```javascript
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const { generatePseudonym } = require('../utils/generatePseudonym');
const { validateInstitutionEmail } = require('../utils/emailValidator');

async function signup(req, res) {
  try {
    const { email, password } = req.body;

    // Validate institution
    if (!validateInstitutionEmail(email)) {
      return res.status(400).json({ 
        error: 'Email must be from an approved institution' 
      });
    }

    // Check if user exists
    const existing = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const pseudonym = generatePseudonym();

    // Get institution
    const domain = email.split('@')[1];
    const inst = await pool.query(
      'SELECT id FROM institutions WHERE email_domain = $1',
      [domain]
    );

    if (inst.rows.length === 0) {
      return res.status(400).json({ error: 'Institution not found' });
    }

    // Create user
    const result = await pool.query(
      `INSERT INTO users (institution_id, email, password_hash, pseudonym, email_verified)
       VALUES ($1, $2, $3, $4, false)
       RETURNING id, email, pseudonym`,
      [inst.rows[0].id, email, hashedPassword, pseudonym]
    );

    // TODO: Send verification email

    res.status(201).json({
      message: 'Signup successful. Check your email for verification.',
      user_id: result.rows[0].id,
      pseudonym: result.rows[0].pseudonym
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Signup failed' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      'SELECT id, password_hash, pseudonym, email_verified FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!user.email_verified) {
      return res.status(403).json({ 
        error: 'Please verify your email first' 
      });
    }

    const token = jwt.sign(
      { userId: user.id, email, pseudonym: user.pseudonym },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.json({ token, user: { id: user.id, pseudonym: user.pseudonym } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
}

module.exports = { signup, login };
```

### **src/routes/auth.js**
```javascript
const express = require('express');
const { signup, login } = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

module.exports = router;
```

---

## Phase 4: Interest Profiling (2-3 hours)

This is the core differentiator! You'll need:

1. **Questionnaire data** (in DB):
   - For each category: 5-8 questions
   - Each question: multiple choice options with weights

2. **Controller functions**:
   - `GET /interests/categories` - List all categories
   - `POST /interests/start-profiling` - Start for a category
   - `POST /interests/submit-answer` - Next question
   - `POST /interests/complete` - Finish profiling

3. **Service functions**:
   - Calculate interest scores based on responses
   - Store responses as JSONB

---

## Phase 5: Matching Algorithm (2 hours)

Build **src/services/matchingService.js** with:
- Cosine similarity calculation
- Category-level matching
- Overall score computation
- Ranking and sorting

Then create matching endpoints to return recommendations.

---

## Build Order Priority

**Week 1:**
1. ✅ Database setup + schema
2. ✅ Auth (signup/login)
3. ✅ User profile endpoints
4. ⏳ Interest profiling (start simple with 2-3 questions per category)

**Week 2:**
5. ⏳ Matching algorithm
6. ⏳ Match recommendations endpoint
7. ⏳ 1-on-1 chat (basic text messages)

**Week 3:**
8. ⏳ Groups (create, join, leave)
9. ⏳ Group messages
10. ⏳ Moderation (report, review)

**Week 4:**
11. ⏳ WebSocket real-time chat
12. ⏳ Voice note upload/playback
13. ⏳ Testing + deployment prep

---

## Testing Locally

### 1. Start your server
```bash
npm run dev
```

### 2. Test signup
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@kiit.ac.in",
    "password": "test123"
  }'
```

### 3. Test login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@kiit.ac.in",
    "password": "test123"
  }'
```

### 4. Test protected route
```bash
curl http://localhost:5000/api/users/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Next: Move to Claude Code

Once you've got this structure working locally, I can create a **Claude Code project** where we:
- Build controllers + services together
- Test each endpoint
- Implement the matching algorithm
- Add WebSocket support

Sound good? Ready to move to Claude Code or need help with any of these files first?
