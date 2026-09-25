# Ruchi Frontend - Project Structure & Setup

## Project Architecture

```
ruchi-frontend/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Landing page
│   ├── auth/
│   │   ├── signin/page.tsx
│   │   ├── signup/page.tsx
│   │   ├── verify-email/page.tsx
│   │   └── institution-select/page.tsx
│   ├── onboarding/
│   │   ├── layout.tsx
│   │   ├── interest-selection/page.tsx
│   │   ├── questionnaire/page.tsx
│   │   └── complete/page.tsx
│   ├── dashboard/
│   │   ├── layout.tsx           # Main app layout with sidebar
│   │   ├── page.tsx             # Home/matches feed
│   │   ├── people/page.tsx      # Discover people
│   │   ├── communities/page.tsx # Groups
│   │   ├── messages/
│   │   │   ├── page.tsx         # Messages list
│   │   │   └── [userId]/page.tsx # Chat conversation
│   │   └── profile/page.tsx     # User profile
│
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── SignupForm.tsx
│   │   └── InstitutionSelector.tsx
│   ├── onboarding/
│   │   ├── InterestGrid.tsx
│   │   ├── Questionnaire.tsx
│   │   └── ProgressBar.tsx
│   ├── matching/
│   │   ├── MatchCard.tsx
│   │   ├── MatchesFeed.tsx
│   │   └── MatchDetails.tsx
│   ├── chat/
│   │   ├── ChatWindow.tsx
│   │   ├── MessageInput.tsx
│   │   ├── MessageBubble.tsx
│   │   ├── ConversationList.tsx
│   │   └── TypingIndicator.tsx
│   ├── groups/
│   │   ├── GroupCard.tsx
│   │   ├── GroupFeed.tsx
│   │   ├── GroupHeader.tsx
│   │   └── GroupMessage.tsx
│   ├── common/
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── Avatar.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── Toast.tsx
│   └── layout/
│       ├── AppContainer.tsx
│       └── MainLayout.tsx
│
├── lib/
│   ├── api.ts                   # API client (axios instance)
│   ├── socket.ts                # WebSocket setup
│   ├── store.ts                 # Zustand store
│   ├── types.ts                 # TypeScript interfaces
│   ├── utils.ts                 # Utility functions
│   └── constants.ts             # App constants
│
├── hooks/
│   ├── useAuth.ts
│   ├── useMatches.ts
│   ├── useChat.ts
│   ├── useGroups.ts
│   ├── useInterests.ts
│   └── useSocket.ts
│
├── styles/
│   ├── globals.css              # Tailwind + custom CSS
│   └── theme.ts                 # Design tokens
│
├── public/
│   ├── logo.svg                 # Ruchi logo
│   ├── icons/
│   ├── illustrations/
│   └── images/
│
├── .env.local                   # Frontend env vars
├── tailwind.config.ts           # Tailwind theme config
├── tsconfig.json
├── next.config.js
├── package.json
└── README.md
```

---

## Installation & Setup

### 1. Create Next.js Project
```bash
npx create-next-app@latest ruchi-frontend --typescript --tailwind --eslint
cd ruchi-frontend
```

### 2. Install Dependencies
```bash
npm install axios socket.io-client zustand react-hook-form zod @hookform/resolvers
npm install clsx tailwind-merge # For className utilities
npm install date-fns # For date formatting
npm install lucide-react # Icons library

# Optional: Shadcn/ui components
npm install --save-dev @radix-ui/react-dialog
npx shadcn-ui@latest add button
```

### 3. Configure Tailwind Theme
Edit `tailwind.config.ts`:
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ruchi: {
          navy: '#1A1F3A',
          purple: '#6B5FFF',
          'purple-light': '#E6E0FF',
          'purple-dark': '#5547D9',
          'bg-light': '#F5F3FF',
          'text-secondary': '#8B8B8B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
```

### 4. Create .env.local
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

---

## Key TypeScript Interfaces

```typescript
// lib/types.ts

export interface User {
  id: string;
  pseudonym: string;
  email_verified: boolean;
  institution_id: string;
  interests: UserInterest[];
  created_at: string;
}

export interface UserInterest {
  category_id: number;
  category_name: string;
  interest_score: number;
  responses: Record<string, string>;
  completed_at: string;
}

export interface Match {
  user_id: string;
  pseudonym: string;
  overall_match_score: number;
  shared_interests: Record<string, number>;
  num_shared_interests: number;
  already_messaged: boolean;
}

export interface DirectMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  message_type: 'text' | 'voice_note';
  content?: string;
  voice_note_url?: string;
  created_at: string;
  is_read: boolean;
}

export interface Group {
  id: string;
  name: string;
  category: string;
  description: string;
  member_count: number;
  is_member: boolean;
  created_at: string;
}

export interface InterestCategory {
  id: number;
  name: string;
  emoji: string;
  description: string;
}

export interface QuestionnaireQuestion {
  id: number;
  question_text: string;
  question_type: 'multiple_choice' | 'text' | 'slider';
  options: { value: string; text: string }[];
  progress: string; // "1/5"
}
```

---

## Zustand Store Structure

```typescript
// lib/store.ts

import { create } from 'zustand'
import { User, Match, DirectMessage } from './types'

interface AuthStore {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (token: string, user: User) => void
  logout: () => void
}

interface ChatStore {
  conversations: Record<string, DirectMessage[]>
  currentConversation: string | null
  unreadCounts: Record<string, number>
  addMessage: (conversationId: string, message: DirectMessage) => void
  setCurrentConversation: (userId: string) => void
  markAsRead: (conversationId: string) => void
}

interface MatchStore {
  matches: Match[]
  currentMatch: Match | null
  isLoading: boolean
  setMatches: (matches: Match[]) => void
  setCurrentMatch: (match: Match) => void
}

export const useAuthStore = create<AuthStore>(...)
export const useChatStore = create<ChatStore>(...)
export const useMatchStore = create<MatchStore>(...)
```

---

## Component Examples

### AuthLayout (Reusable)
All auth pages share this layout with logo, background, etc.

### DashboardLayout
- Sidebar with navigation
- Main content area
- Consistent header

### MatchCard
Shows match with score, shared interests, and action buttons

### ChatWindow
- Message list
- Input area
- Typing indicators
- Real-time updates via Socket.io

### InterestGrid
Clickable interest category selector with icons/emojis

### Questionnaire
Step-by-step questions with progress bar

---

## API Client Setup

```typescript
// lib/api.ts

import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ruchi_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth and redirect to login
      localStorage.removeItem('ruchi_token')
      window.location.href = '/auth/signin'
    }
    return Promise.reject(error)
  }
)

export default api
```

---

## WebSocket Setup

```typescript
// lib/socket.ts

import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export function initSocket(token: string): Socket {
  socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
    auth: { token },
    reconnection: true,
  })

  socket.on('connect', () => console.log('Connected'))
  socket.on('disconnect', () => console.log('Disconnected'))

  return socket
}

export function getSocket(): Socket | null {
  return socket
}

export function emitMessage(
  receiver_id: string,
  content: string
): void {
  socket?.emit('message:send', { receiver_id, content })
}
```

---

## Key Hooks

### useAuth
- Get current user
- Login/logout logic
- Token management

### useMatches
- Fetch match recommendations
- Filter/sort matches
- Track viewed matches

### useChat
- Send messages
- Listen for incoming messages
- Mark conversations as read
- Typing indicators

### useSocket
- Connect/disconnect
- Listen to events
- Emit events

---

## Folder Structure Best Practices

1. **Feature-based**: Each feature (auth, matching, chat) has its own folder
2. **Reusable components**: `common/` folder for buttons, avatars, etc.
3. **Types centralized**: All interfaces in `lib/types.ts`
4. **Hooks pattern**: Extract complex logic into custom hooks
5. **Store organization**: One file for all Zustand stores

---

## Development Workflow

```bash
# Start development server
npm run dev

# Open http://localhost:3000

# Build for production
npm run build
npm run start

# Check types
npx tsc --noEmit
```

---

## Deployment

### Vercel (Recommended)
```bash
vercel
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## Next Steps

1. ✅ Set up Next.js project locally
2. ✅ Configure Tailwind with Ruchi colors
3. ✅ Build layout components (Navbar, Sidebar)
4. ✅ Create auth flows (signin/signup)
5. ✅ Build onboarding (interest selection + questionnaire)
6. ✅ Create matching feed
7. ✅ Build chat interface
8. ✅ Create groups/communities
9. ✅ Connect to backend APIs
10. ✅ Test real-time messaging with WebSocket

This structure is scalable and ready for Claude Code development!
