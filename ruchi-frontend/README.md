# Ruchi — Frontend

A working Next.js 16 + TypeScript + Tailwind v4 frontend for Ruchi, built to
match the uploaded product designs.

## Setup

```bash
npm install
cp .env.local.example .env.local   # point at your backend once it's running
npm run dev
```

Visit `http://localhost:3000`.

## What's real vs. mocked

**Wired to the API client already** (see `lib/api.ts`, matches the endpoint
spec from Phase A):
- Sign up, sign in, email verification (`components/auth/*`)

**Using local mock data for now** (see `lib/mockData.ts`,
`lib/mockQuestionnaire.ts`) — swap these for real API calls once the backend
endpoints are live, the shapes already match:
- Match feed / People page (`matchAPI.getRecommendations`)
- Messages & conversations (`chatAPI.*`)
- Communities / groups (`groupAPI.*`)
- Interest questionnaire (`interestAPI.startProfiling` / `submitAnswer`)

Every mock file has a comment marking where to swap in the real call.

## Structure

```
app/                  Next.js App Router pages
  (auth)/              signin, signup, verify-email
  onboarding/           interests -> questionnaire -> complete
  dashboard/             home, people, messages, communities, profile
components/
  auth/ onboarding/ matching/ chat/ groups/ marketing/ layout/ common/
lib/
  api.ts               Axios client, all backend endpoints
  socket.ts            Socket.io client for real-time chat
  store.ts             Zustand stores (auth, chat, matches, onboarding)
  types.ts             Shared TypeScript interfaces
  mockData.ts          Placeholder data for demoable UI pre-backend
```

## Design tokens

Brand colors live as CSS custom properties in `app/globals.css` under
`@theme inline`, so they're available as Tailwind utilities:
`bg-ruchi-purple`, `text-ruchi-navy`, `bg-ruchi-bg-light`, etc.

```
navy            #1A1F3A
purple          #6B5FFF
purple-dark     #5547D9
purple-light    #E6E0FF
bg-light        #F5F3FF
text-secondary  #8B8B8B
```

## Notes

- Uses the system font stack rather than a Google Fonts import (no external
  font CDN dependency). To switch to Inter, add it via `next/font/local`
  with a self-hosted woff2, or re-add `next/font/google` if your deploy
  environment can reach Google's font CDN.
- Real-time chat (Socket.io) is scaffolded in `lib/socket.ts` but not yet
  wired into the conversation page -- that's the next piece once the backend
  WebSocket server exists.
- Voice notes: UI button exists in `MessageInput`, recording/upload logic
  not yet implemented.

## Next steps

1. Stand up the backend (see Phase A docs) and set `NEXT_PUBLIC_API_URL`
2. Swap `mockData.ts` calls for the real `matchAPI` / `chatAPI` / `groupAPI`
3. Wire `lib/socket.ts` into the conversation page for live messages
4. Add voice note recording (MediaRecorder API) + upload
5. Build out moderator dashboard views
