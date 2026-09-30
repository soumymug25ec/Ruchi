# Ruchi

Anonymous, interest-based friend finding for colleges, schools and hostels.

- `ruchi-backend/`  Express + PostgreSQL + Socket.io API
- `ruchi-frontend/` Next.js 16 + Tailwind v4 app

## Run it

```bash
# 1. Backend (needs PostgreSQL running locally)
cd ruchi-backend
npm install
cp .env.example .env        # set DB_PASSWORD to whatever you want
npm run db:setup            # creates DB + role, runs migrations and seeds
npm run dev                 # http://localhost:5000

# 2. Frontend (new terminal)
cd ruchi-frontend
npm install
cp .env.local.example .env.local
npm run dev                 # http://localhost:3000
```

Sign up with an address on an allowed domain (default: `@kiit.ac.in`,
`@bits-pilani.ac.in`, `@du.ac.in`, configurable in the backend `.env`).
Accounts are auto-verified in dev. Create a second account in another
browser profile to try matching and chat.

## Tests

`ruchi-backend/test-e2e.js` replays the frontend's API flow against a
running backend (`node test-e2e.js`). `test-flow.sh` and `test-flow-2.sh` are
older curl-based smoke tests.

## Known gaps

- Only Anime, Gaming and Tech have questionnaire questions seeded; other
  categories are skipped in onboarding until questions are added.
- No voice notes, no moderator UI, no email sending, no rate limiting.
- Not yet clicked through in a real browser; the API flow and every page
  response were tested, but visual/interaction testing is still to do.
