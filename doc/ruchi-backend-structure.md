# Ruchi Backend - Project Structure

```
ruchi-backend/
├── src/
│   ├── config/
│   │   ├── database.js          # PostgreSQL connection
│   │   ├── env.js               # Environment variables
│   │   └── constants.js         # App constants (interest categories, etc)
│   │
│   ├── middleware/
│   │   ├── auth.js              # JWT verification, institution check
│   │   ├── validation.js        # Input validation
│   │   └── errorHandler.js      # Global error handling
│   │
│   ├── controllers/
│   │   ├── authController.js    # Login, signup, verification
│   │   ├── userController.js    # Profile, preferences
│   │   ├── interestController.js # Interest profiling, questionnaire
│   │   ├── matchController.js   # Matching algorithm
│   │   ├── chatController.js    # 1-on-1 messages
│   │   ├── groupController.js   # Group management
│   │   └── moderatorController.js # Moderation tools
│   │
│   ├── services/
│   │   ├── authService.js       # Auth logic, email verification
│   │   ├── interestService.js   # Interest scoring, questionnaire flow
│   │   ├── matchingService.js   # Matching algorithm (cosine similarity)
│   │   ├── chatService.js       # Message storage, real-time logic
│   │   └── moderationService.js # Content moderation
│   │
│   ├── models/
│   │   ├── User.js              # User model + queries
│   │   ├── Interest.js          # Interest model
│   │   ├── Message.js           # Message model
│   │   ├── Group.js             # Group model
│   │   └── Institution.js       # Institution model
│   │
│   ├── routes/
│   │   ├── auth.js              # /api/auth/*
│   │   ├── users.js             # /api/users/*
│   │   ├── interests.js         # /api/interests/*
│   │   ├── matches.js           # /api/matches/*
│   │   ├── chat.js              # /api/chat/*
│   │   ├── groups.js            # /api/groups/*
│   │   └── moderator.js         # /api/moderator/*
│   │
│   ├── utils/
│   │   ├── generatePseudonym.js # Generate random pseudonym
│   │   ├── emailValidator.js    # College email validation
│   │   ├── tokenGenerator.js    # JWT token creation
│   │   └── logger.js            # Logging utility
│   │
│   ├── migrations/
│   │   ├── 001_create_tables.sql
│   │   ├── 002_add_indexes.sql
│   │   └── 003_seed_data.sql
│   │
│   └── app.js                   # Express app setup
│
├── .env.example
├── .gitignore
├── package.json
├── server.js                    # Entry point
├── docker-compose.yml           # Local PostgreSQL setup
└── README.md
```

## Key Environment Variables (.env)
```
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ruchi_db
DB_USER=ruchi_user
DB_PASSWORD=secure_password
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
ALLOWED_INSTITUTIONS=kiit.ac.in,bits-pilani.ac.in,du.ac.in
```

## Dependencies
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.10.0",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "joi": "^17.11.0",
    "socket.io": "^4.7.2",
    "uuid": "^9.0.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "jest": "^29.7.0"
  }
}
```
