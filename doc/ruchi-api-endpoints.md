# Ruchi API Endpoints Specification

Base URL: `http://localhost:5000/api`

---

## 🔐 Authentication Endpoints (`/auth`)

### 1. **Signup (Email Verification)**
```
POST /auth/signup
Content-Type: application/json

Request Body:
{
  "email": "user@kiit.ac.in",
  "password": "secure_password",
  "institution_email_domain": "kiit.ac.in"
}

Response (201):
{
  "message": "Verification email sent",
  "user_id": "uuid",
  "email": "user@kiit.ac.in"
}
```

### 2. **Verify Email**
```
POST /auth/verify-email
Content-Type: application/json

Request Body:
{
  "email": "user@kiit.ac.in",
  "verification_code": "123456"
}

Response (200):
{
  "message": "Email verified successfully",
  "token": "jwt_token",
  "user": {
    "id": "uuid",
    "email": "user@kiit.ac.in",
    "pseudonym": "User_8374",
    "institution_id": "uuid"
  }
}
```

### 3. **Login**
```
POST /auth/login
Content-Type: application/json

Request Body:
{
  "email": "user@kiit.ac.in",
  "password": "secure_password"
}

Response (200):
{
  "token": "jwt_token",
  "user": {
    "id": "uuid",
    "pseudonym": "User_8374",
    "email_verified": true,
    "interests_completed": true
  }
}
```

### 4. **Logout**
```
POST /auth/logout
Headers: { Authorization: "Bearer jwt_token" }

Response (200):
{
  "message": "Logged out successfully"
}
```

---

## 👤 User Profile Endpoints (`/users`)

### 1. **Get Current User Profile**
```
GET /users/me
Headers: { Authorization: "Bearer jwt_token" }

Response (200):
{
  "id": "uuid",
  "pseudonym": "User_8374",
  "email_verified": true,
  "year_of_study": "2",
  "interests": [
    {
      "category_id": 1,
      "category_name": "Anime",
      "interest_score": 85,
      "responses": { "q1": "action", "q2": "anime" }
    }
  ],
  "institution": {
    "id": "uuid",
    "name": "KIIT Bhubaneswar"
  },
  "created_at": "2026-09-24T10:00:00Z"
}
```

### 2. **Update Profile**
```
PUT /users/me
Headers: { Authorization: "Bearer jwt_token" }
Content-Type: application/json

Request Body:
{
  "year_of_study": "2",
  "real_name": "Soumy" (optional, privacy-conscious)
}

Response (200):
{
  "message": "Profile updated",
  "user": { ...updated user data }
}
```

### 3. **Get User by Pseudonym** (For group/match viewing)
```
GET /users/:pseudonym
Headers: { Authorization: "Bearer jwt_token" }

Response (200):
{
  "pseudonym": "User_8374",
  "primary_interest": "Anime",
  "shared_interests_with_you": ["Anime", "Manga"],
  "match_score": 87
}
```

---

## 🎯 Interest Profiling Endpoints (`/interests`)

### 1. **Get Interest Categories**
```
GET /interests/categories
Headers: { Authorization: "Bearer jwt_token" }

Response (200):
{
  "categories": [
    {
      "id": 1,
      "name": "Anime",
      "emoji": "🎌",
      "description": "Anime series, manga, and Japanese animation"
    },
    ...
  ]
}
```

### 2. **Start Interest Profiling**
```
POST /interests/start-profiling
Headers: { Authorization: "Bearer jwt_token" }
Content-Type: application/json

Request Body:
{
  "category_id": 1 // User chooses "Anime"
}

Response (200):
{
  "category": "Anime",
  "current_question": {
    "id": 1,
    "question_text": "Which anime genre do you prefer?",
    "question_type": "multiple_choice",
    "options": [
      { "value": "action", "text": "Action" },
      { "value": "romance", "text": "Romance" },
      { "value": "slice_of_life", "text": "Slice of Life" }
    ]
  },
  "progress": "1/5"
}
```

### 3. **Submit Answer & Get Next Question**
```
POST /interests/submit-answer
Headers: { Authorization: "Bearer jwt_token" }
Content-Type: application/json

Request Body:
{
  "category_id": 1,
  "question_id": 1,
  "answer_value": "action"
}

Response (200):
{
  "next_question": {
    "id": 2,
    "question_text": "Do you prefer manga or anime?",
    "options": [...]
  },
  "progress": "2/5"
}
```

### 4. **Complete Interest Profiling**
```
POST /interests/complete
Headers: { Authorization: "Bearer jwt_token" }
Content-Type: application/json

Request Body:
{
  "category_id": 1,
  "final_answer": "subbed"
}

Response (200):
{
  "message": "Interest profiling complete",
  "interest": {
    "category": "Anime",
    "interest_score": 85,
    "responses": { "q1": "action", "q2": "anime", "q3": "subbed", ... }
  }
}
```

### 5. **Get User's Interests**
```
GET /interests/user-interests
Headers: { Authorization: "Bearer jwt_token" }

Response (200):
{
  "interests": [
    {
      "category_id": 1,
      "category_name": "Anime",
      "interest_score": 85,
      "responses": { ... },
      "completed_at": "2026-09-24T10:00:00Z"
    },
    {
      "category_id": 6,
      "category_name": "Tech & Entrepreneurship",
      "interest_score": 92,
      ...
    }
  ]
}
```

---

## 🤝 Matching Endpoints (`/matches`)

### 1. **Get Match Recommendations**
```
GET /matches/recommendations?limit=20&offset=0
Headers: { Authorization: "Bearer jwt_token" }

Response (200):
{
  "recommendations": [
    {
      "user_id": "uuid",
      "pseudonym": "User_5821",
      "overall_match_score": 92,
      "shared_interests": {
        "Anime": 95,
        "Gaming": 88
      },
      "num_shared_interests": 2,
      "already_messaged": false
    },
    {
      "user_id": "uuid",
      "pseudonym": "User_3102",
      "overall_match_score": 78,
      "shared_interests": {
        "Anime": 78
      },
      "num_shared_interests": 1,
      "already_messaged": true
    }
  ],
  "total_matches": 156,
  "page": 1
}
```

### 2. **Get Detailed Match Info**
```
GET /matches/:user_id
Headers: { Authorization: "Bearer jwt_token" }

Response (200):
{
  "match": {
    "user_id": "uuid",
    "pseudonym": "User_5821",
    "overall_match_score": 92,
    "shared_interests": [
      {
        "category": "Anime",
        "your_score": 85,
        "their_score": 90,
        "combined_score": 95
      }
    ],
    "has_messaged": false
  }
}
```

### 3. **Trigger Match Recalculation** (After profile update)
```
POST /matches/recalculate
Headers: { Authorization: "Bearer jwt_token" }

Response (202):
{
  "message": "Match recalculation queued",
  "status": "processing"
}
```

---

## 💬 Direct Messages Endpoints (`/chat`)

### 1. **Get Conversations List**
```
GET /chat/conversations?limit=50
Headers: { Authorization: "Bearer jwt_token" }

Response (200):
{
  "conversations": [
    {
      "conversation_id": "uuid",
      "other_user_pseudonym": "User_5821",
      "last_message": "Yeah, Attack on Titan S4 was insane!",
      "last_message_time": "2026-09-24T15:30:00Z",
      "unread_count": 3,
      "match_score": 92
    }
  ]
}
```

### 2. **Get Conversation History**
```
GET /chat/messages/:user_id?limit=50&offset=0
Headers: { Authorization: "Bearer jwt_token" }

Response (200):
{
  "messages": [
    {
      "id": "uuid",
      "sender_pseudonym": "User_8374",
      "receiver_pseudonym": "User_5821",
      "message_type": "text",
      "content": "Have you watched Demon Slayer?",
      "created_at": "2026-09-24T10:00:00Z",
      "is_read": true
    },
    {
      "id": "uuid",
      "sender_pseudonym": "User_5821",
      "receiver_pseudonym": "User_8374",
      "message_type": "voice_note",
      "voice_note_url": "https://cdn.example.com/voice/...mp3",
      "duration_seconds": 45,
      "created_at": "2026-09-24T10:05:00Z",
      "is_read": true
    }
  ],
  "other_user_pseudonym": "User_5821",
  "other_user_match_score": 92
}
```

### 3. **Send Text Message**
```
POST /chat/messages
Headers: { Authorization: "Bearer jwt_token" }
Content-Type: application/json

Request Body:
{
  "receiver_id": "uuid",
  "message_type": "text",
  "content": "Have you watched Demon Slayer?"
}

Response (201):
{
  "message": {
    "id": "uuid",
    "sender_id": "uuid",
    "receiver_id": "uuid",
    "content": "Have you watched Demon Slayer?",
    "created_at": "2026-09-24T10:00:00Z"
  }
}
```

### 4. **Send Voice Note**
```
POST /chat/messages/voice
Headers: { Authorization: "Bearer jwt_token" }
Content-Type: multipart/form-data

Form Data:
- receiver_id: uuid
- audio_file: (binary file, max 10MB, max 5 min duration)

Response (201):
{
  "message": {
    "id": "uuid",
    "message_type": "voice_note",
    "voice_note_url": "https://cdn.example.com/voice/...mp3",
    "duration_seconds": 45,
    "created_at": "2026-09-24T10:00:00Z"
  }
}
```

### 5. **Mark Messages as Read**
```
POST /chat/mark-read
Headers: { Authorization: "Bearer jwt_token" }
Content-Type: application/json

Request Body:
{
  "other_user_id": "uuid"
}

Response (200):
{
  "message": "Messages marked as read"
}
```

---

## 👥 Groups Endpoints (`/groups`)

### 1. **Get All Groups (Institution)**
```
GET /groups?institution_id=uuid&limit=20
Headers: { Authorization: "Bearer jwt_token" }

Response (200):
{
  "groups": [
    {
      "id": "uuid",
      "name": "Anime Enthusiasts",
      "category": "Anime",
      "description": "Discuss anime, manga, and Japanese culture",
      "member_count": 245,
      "is_member": true,
      "members_you_know": 12
    }
  ]
}
```

### 2. **Get Group Details**
```
GET /groups/:group_id
Headers: { Authorization: "Bearer jwt_token" }

Response (200):
{
  "id": "uuid",
  "name": "Anime Enthusiasts",
  "category": "Anime",
  "description": "...",
  "member_count": 245,
  "is_member": true,
  "role": "member",
  "created_at": "2026-01-01T00:00:00Z",
  "members_preview": [
    { "pseudonym": "User_1234", "joined_at": "..." }
  ]
}
```

### 3. **Join Group**
```
POST /groups/:group_id/join
Headers: { Authorization: "Bearer jwt_token" }

Response (200):
{
  "message": "Joined group successfully",
  "group_id": "uuid"
}
```

### 4. **Leave Group**
```
POST /groups/:group_id/leave
Headers: { Authorization: "Bearer jwt_token" }

Response (200):
{
  "message": "Left group successfully"
}
```

---

## 💬 Group Messages Endpoints (`/groups/:group_id/messages`)

### 1. **Get Group Messages**
```
GET /groups/:group_id/messages?limit=50&offset=0
Headers: { Authorization: "Bearer jwt_token" }

Response (200):
{
  "messages": [
    {
      "id": "uuid",
      "sender_pseudonym": "User_5821",
      "message_type": "text",
      "content": "Just finished Attack on Titan!",
      "created_at": "2026-09-24T10:00:00Z",
      "is_pinned": false
    }
  ],
  "group_name": "Anime Enthusiasts"
}
```

### 2. **Send Group Message**
```
POST /groups/:group_id/messages
Headers: { Authorization: "Bearer jwt_token" }
Content-Type: application/json

Request Body:
{
  "message_type": "text",
  "content": "Just finished Attack on Titan!"
}

Response (201):
{
  "message": {
    "id": "uuid",
    "sender_pseudonym": "User_8374",
    "content": "Just finished Attack on Titan!",
    "created_at": "2026-09-24T10:00:00Z"
  }
}
```

### 3. **Pin Message** (Moderator only)
```
POST /groups/:group_id/messages/:message_id/pin
Headers: { Authorization: "Bearer jwt_token" }

Response (200):
{
  "message": "Message pinned"
}
```

---

## 🛡️ Moderation Endpoints (`/moderator`)

### 1. **Report Content**
```
POST /moderator/report
Headers: { Authorization: "Bearer jwt_token" }
Content-Type: application/json

Request Body:
{
  "content_type": "group_message",
  "content_id": "uuid",
  "reason": "hate_speech",
  "description": "User made derogatory comments"
}

Response (201):
{
  "report_id": "uuid",
  "status": "pending"
}
```

### 2. **Get Pending Reports** (Moderator)
```
GET /moderator/reports?status=pending
Headers: { Authorization: "Bearer jwt_token" }

Response (200):
{
  "reports": [
    {
      "id": "uuid",
      "reported_by_pseudonym": "User_1234",
      "content_type": "group_message",
      "content_id": "uuid",
      "reason": "hate_speech",
      "description": "...",
      "created_at": "2026-09-24T10:00:00Z"
    }
  ]
}
```

### 3. **Review Report** (Moderator)
```
POST /moderator/reports/:report_id/review
Headers: { Authorization: "Bearer jwt_token" }
Content-Type: application/json

Request Body:
{
  "decision": "dismiss", // or "action_taken"
  "moderator_notes": "Reviewed. No violation found."
}

Response (200):
{
  "message": "Report reviewed",
  "status": "dismissed"
}
```

---

## 📊 Analytics Endpoints (Optional)

### 1. **Get User Analytics**
```
GET /analytics/user
Headers: { Authorization: "Bearer jwt_token" }

Response (200):
{
  "matches_made": 45,
  "conversations_started": 12,
  "groups_joined": 5,
  "messages_sent": 234,
  "last_7_days_activity": [...]
}
```

### 2. **Get Institution Analytics** (Admin/POC)
```
GET /analytics/institution/:institution_id
Headers: { Authorization: "Bearer jwt_token" }

Response (200):
{
  "total_users": 1250,
  "active_users_7d": 450,
  "total_matches": 5230,
  "total_messages": 15000,
  "most_popular_interests": ["Anime", "Gaming", "Tech & Entrepreneurship"]
}
```

---

## Error Response Format

All errors follow this format:

```json
{
  "error": "Invalid email",
  "status_code": 400,
  "message": "The email provided is not from an approved institution"
}
```

---

## WebSocket Events (Real-time chat)

```javascript
// Connect
socket.emit('connect', { token: 'jwt_token' })

// Message events
socket.emit('message:send', { receiver_id: 'uuid', content: '...' })
socket.on('message:received', (message) => { ... })
socket.on('message:read', (message_id) => { ... })

// Typing indicator
socket.emit('typing:start', { receiver_id: 'uuid' })
socket.emit('typing:stop', { receiver_id: 'uuid' })
socket.on('typing:indicator', (data) => { ... })
```
