# Ruchi — Backend

A working Express + PostgreSQL + Socket.io API for Ruchi, implementing auth,
interest profiling, matching, chat, groups, and moderation.

Every endpoint below has been tested end-to-end with real curl requests
against a real database — this isn't a stub.

## Setup

### 1. Install PostgreSQL (if you don't have it)

```bash
# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib
sudo service postgresql start

# macOS
brew install postgresql@16
brew services start postgresql@16
```

### 2. Install dependencies and configure environment

```bash
npm install
cp .env.example .env
# edit .env if you want different DB credentials
```

### 3. Create the database and run migrations

```bash
npm run db:setup
```

This creates the `ruchi_db` database, the `ruchi_user` role, and runs all
three migrations (schema, interest categories + questionnaire seed data,
and one starter group per category per institution).

### 4. Run the server

```bash
npm run dev      # with auto-reload (nodemon)
# or
npm start
```

Server runs at `http://localhost:5000`. Check `GET /health` to confirm it's up.

## What's implemented and tested

| Area | Endpoints | Status |
|---|---|---|
| Auth | signup, login, verify-email, logout | ✅ tested |
| Users | get/update profile | ✅ tested |
| Interests | categories, questionnaire flow, scoring | ✅ tested |
| Matching | recommendations (real similarity scoring) | ✅ tested |
| Chat | conversations, messages, send, mark-read | ✅ tested |
| Groups | list, join/leave, post, get messages | ✅ tested |
| Moderation | report, list reports, review | ✅ tested |
| Real-time | Socket.io live message delivery | ✅ tested (two-client test) |

See `test-flow.sh` and `test-flow-2.sh` for the actual smoke tests — run
them yourself with `bash test-flow.sh` (server + Postgres must not already
be running on the same ports; the scripts start their own server instance).

## Notable implementation decisions

- **Email verification is auto-approved in dev** (`REQUIRE_EMAIL_VERIFICATION=false`
  in `.env`). No SMTP is configured, so verification codes are logged to the
  console instead of emailed. Flip this to `true` and wire up an email
  provider (e.g. SES, Postmark) in `authController.js` before going to
  production.
- **Pseudonyms** are generated as `Adjective#123` (e.g. `Onyx#343`) — see
  `src/utils/generatePseudonym.js`.
- **Matching algorithm** (`src/services/matchingService.js`) computes, for
  each shared interest category, a closeness score between the two users'
  category scores, averages across shared categories, and adds a small
  bonus for having additional non-overlapping interests. This is simpler
  than the originally-drafted cosine-similarity approach (true cosine
  similarity on a single positive scalar per category always evaluates to
  1, so it isn't meaningful alone) — this version actually differentiates
  users with different response patterns.
- **Groups are pre-seeded**, one per interest category per institution
  (33 total across the 3 seeded institutions), rather than user-created.
- **Moderator access** is gated by an `is_moderator` flag on the `users`
  row, included in the JWT at login. No user is a moderator by default —
  set it manually for testing: `UPDATE users SET is_moderator = true WHERE
  email = '...';`

## Structure

```
src/
  config/         database.js, constants.js
  controllers/    auth, user, interest, match, chat, group, moderator
  middleware/     auth (JWT), errorHandler
  routes/         one file per resource, mounted in app.js
  services/       matchingService.js
  utils/          generatePseudonym, emailValidator
  realtime/       socket.js — Socket.io auth + event handlers
  migrations/     001 schema, 002 seed data, 003 seed groups
server.js         entrypoint — HTTP + Socket.io
app.js            (in src/) Express app, route mounting
```

## Known gaps / next steps

- Voice note upload isn't implemented (endpoint documented in the original
  API spec but not built — needs file storage, e.g. S3 or local disk).
- No refresh tokens — JWTs are long-lived (7 days) and there's no rotation
  or revocation list.
- No rate limiting on auth endpoints.
- No automated test suite (Jest is installed as a dependency but no tests
  written yet) — `test-flow.sh` / `test-flow-2.sh` are manual smoke tests.
- Matching only runs on-demand (no caching or background recomputation job).
- CORS is wide open (`origin: "*"`) — tighten this before deploying.

## Connecting the frontend

Point the frontend's `.env.local` at this server:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

The frontend's `lib/mockData.ts` and `lib/mockQuestionnaire.ts` currently
stand in for the real API — swap those calls for the `matchAPI` / `chatAPI`
/ `groupAPI` / `interestAPI` functions in `lib/api.ts`, which already match
this backend's request/response shapes.
