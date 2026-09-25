# Ruchi Frontend - Complete Setup Guide

## 🚀 Quick Start (5 minutes)

### 1. Create Next.js Project
```bash
npx create-next-app@latest ruchi-frontend \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --no-src-dir \
  --import-alias '@/*'

cd ruchi-frontend
```

### 2. Install Additional Dependencies
```bash
npm install \
  axios \
  socket.io-client \
  zustand \
  react-hook-form \
  zod \
  @hookform/resolvers \
  lucide-react \
  clsx \
  tailwind-merge \
  date-fns
```

### 3. Create .env.local
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

### 4. Update tailwind.config.ts
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
          'purple-dark': '#5547D9',
          'primary-light': '#E6E0FF',
          'bg-light': '#F5F3FF',
          'text-secondary': '#8B8B8B',
        },
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

### 5. Update globals.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom colors */
:root {
  --color-navy: #1A1F3A;
  --color-purple: #6B5FFF;
  --color-purple-dark: #5547D9;
  --color-primary-light: #E6E0FF;
  --color-bg-light: #F5F3FF;
  --color-text-secondary: #8B8B8B;
}

/* Smooth transitions */
* {
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}

/* Remove default scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #6B5FFF;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #5547D9;
}
```

### 6. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` 🎉

---

## 📁 Create Folder Structure

```bash
# Create directories
mkdir -p app/auth app/onboarding app/dashboard/messages
mkdir -p components/{auth,onboarding,matching,chat,groups,common,layout}
mkdir -p lib hooks styles public/{icons,illustrations}

# Create files
touch lib/{api.ts,socket.ts,store.ts,types.ts,utils.ts,constants.ts}
touch hooks/{useAuth.ts,useMatches.ts,useChat.ts,useGroups.ts,useInterests.ts,useSocket.ts}
```

---

## 📋 Core Files to Create

### 1. lib/types.ts - TypeScript Interfaces

```typescript
// User & Auth
export interface User {
  id: string
  pseudonym: string
  email_verified: boolean
  institution_id: string
  interests: UserInterest[]
  created_at: string
}

export interface UserInterest {
  category_id: number
  category_name: string
  interest_score: number
  responses: Record<string, string>
  completed_at: string
}

// Matching
export interface Match {
  user_id: string
  pseudonym: string
  overall_match_score: number
  shared_interests: Record<string, number>
  num_shared_interests: number
  already_messaged: boolean
}

// Messages
export interface DirectMessage {
  id: string
  sender_id: string
  receiver_id: string
  message_type: 'text' | 'voice_note'
  content?: string
  voice_note_url?: string
  created_at: string
  is_read: boolean
}

// Groups
export interface Group {
  id: string
  name: string
  category: string
  description: string
  member_count: number
  is_member: boolean
  created_at: string
}

export interface InterestCategory {
  id: number
  name: string
  emoji: string
  description: string
}

export interface QuestionnaireQuestion {
  id: number
  question_text: string
  question_type: 'multiple_choice' | 'text' | 'slider'
  options: { value: string; text: string }[]
  progress: string
}
```

### 2. lib/api.ts - API Client

```typescript
import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Intercept requests to add auth token
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' 
    ? localStorage.getItem('ruchi_token') 
    : null
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  
  return config
})

// Intercept responses for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('ruchi_token')
        window.location.href = '/auth/signin'
      }
    }
    return Promise.reject(error)
  }
)

// Auth endpoints
export const authAPI = {
  signup: (email: string, password: string) =>
    api.post('/auth/signup', { email, password }),
  
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  logout: () => api.post('/auth/logout'),
}

// User endpoints
export const userAPI = {
  getProfile: () => api.get('/users/me'),
  updateProfile: (data: any) => api.put('/users/me', data),
}

// Interest endpoints
export const interestAPI = {
  getCategories: () => api.get('/interests/categories'),
  startProfiling: (categoryId: number) =>
    api.post('/interests/start-profiling', { category_id: categoryId }),
  submitAnswer: (categoryId: number, questionId: number, answerValue: string) =>
    api.post('/interests/submit-answer', {
      category_id: categoryId,
      question_id: questionId,
      answer_value: answerValue,
    }),
  completeProfiling: (categoryId: number, finalAnswer: string) =>
    api.post('/interests/complete', {
      category_id: categoryId,
      final_answer: finalAnswer,
    }),
  getUserInterests: () => api.get('/interests/user-interests'),
}

// Matching endpoints
export const matchAPI = {
  getRecommendations: (limit = 20, offset = 0) =>
    api.get(`/matches/recommendations?limit=${limit}&offset=${offset}`),
  getMatchDetails: (userId: string) => api.get(`/matches/${userId}`),
  recalculateMatches: () => api.post('/matches/recalculate'),
}

// Chat endpoints
export const chatAPI = {
  getConversations: (limit = 50) =>
    api.get(`/chat/conversations?limit=${limit}`),
  getMessages: (userId: string, limit = 50, offset = 0) =>
    api.get(`/chat/messages/${userId}?limit=${limit}&offset=${offset}`),
  sendMessage: (receiverId: string, content: string) =>
    api.post('/chat/messages', {
      receiver_id: receiverId,
      message_type: 'text',
      content,
    }),
  sendVoiceNote: (receiverId: string, audioFile: File) => {
    const formData = new FormData()
    formData.append('receiver_id', receiverId)
    formData.append('audio_file', audioFile)
    return api.post('/chat/messages/voice', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  markAsRead: (userId: string) =>
    api.post('/chat/mark-read', { other_user_id: userId }),
}

// Group endpoints
export const groupAPI = {
  getAllGroups: (institutionId: string, limit = 20) =>
    api.get(`/groups?institution_id=${institutionId}&limit=${limit}`),
  getGroupDetails: (groupId: string) => api.get(`/groups/${groupId}`),
  joinGroup: (groupId: string) => api.post(`/groups/${groupId}/join`),
  leaveGroup: (groupId: string) => api.post(`/groups/${groupId}/leave`),
  getGroupMessages: (groupId: string, limit = 50, offset = 0) =>
    api.get(`/groups/${groupId}/messages?limit=${limit}&offset=${offset}`),
  sendGroupMessage: (groupId: string, content: string) =>
    api.post(`/groups/${groupId}/messages`, {
      message_type: 'text',
      content,
    }),
}

export default api
```

### 3. lib/socket.ts - WebSocket Setup

```typescript
import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export function initSocket(token: string): Socket {
  socket = io(process.env.NEXT_PUBLIC_SOCKET_URL as string, {
    auth: { token },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  })

  socket.on('connect', () => {
    console.log('✅ Socket connected:', socket?.id)
  })

  socket.on('disconnect', () => {
    console.log('❌ Socket disconnected')
  })

  socket.on('error', (error) => {
    console.error('Socket error:', error)
  })

  return socket
}

export function getSocket(): Socket | null {
  return socket
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export function emitMessage(receiverId: string, content: string): void {
  socket?.emit('message:send', { receiver_id: receiverId, content })
}

export function onMessageReceived(
  callback: (message: any) => void
): void {
  socket?.on('message:received', callback)
}

export function onTypingIndicator(
  callback: (data: any) => void
): void {
  socket?.on('typing:indicator', callback)
}

export function emitTyping(receiverId: string, isTyping: boolean): void {
  if (isTyping) {
    socket?.emit('typing:start', { receiver_id: receiverId })
  } else {
    socket?.emit('typing:stop', { receiver_id: receiverId })
  }
}
```

### 4. lib/store.ts - Zustand State Management

```typescript
import { create } from 'zustand'
import { User, Match, DirectMessage } from './types'

// Auth Store
interface AuthStore {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (token: string, user: User) => void
  logout: () => void
  setUser: (user: User) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,
  login: (token, user) => {
    localStorage.setItem('ruchi_token', token)
    set({ token, user, isAuthenticated: true })
  },
  logout: () => {
    localStorage.removeItem('ruchi_token')
    set({ token: null, user: null, isAuthenticated: false })
  },
  setUser: (user) => set({ user }),
}))

// Chat Store
interface ChatStore {
  conversations: Record<string, DirectMessage[]>
  currentConversation: string | null
  unreadCounts: Record<string, number>
  typingUsers: Set<string>
  addMessage: (conversationId: string, message: DirectMessage) => void
  setCurrentConversation: (userId: string | null) => void
  markAsRead: (conversationId: string) => void
  setTyping: (userId: string, isTyping: boolean) => void
}

export const useChatStore = create<ChatStore>((set) => ({
  conversations: {},
  currentConversation: null,
  unreadCounts: {},
  typingUsers: new Set(),
  addMessage: (conversationId, message) =>
    set((state) => ({
      conversations: {
        ...state.conversations,
        [conversationId]: [
          ...(state.conversations[conversationId] || []),
          message,
        ],
      },
    })),
  setCurrentConversation: (userId) => set({ currentConversation: userId }),
  markAsRead: (conversationId) =>
    set((state) => ({
      unreadCounts: { ...state.unreadCounts, [conversationId]: 0 },
    })),
  setTyping: (userId, isTyping) =>
    set((state) => {
      const newTyping = new Set(state.typingUsers)
      if (isTyping) {
        newTyping.add(userId)
      } else {
        newTyping.delete(userId)
      }
      return { typingUsers: newTyping }
    }),
}))

// Match Store
interface MatchStore {
  matches: Match[]
  currentMatch: Match | null
  isLoading: boolean
  setMatches: (matches: Match[]) => void
  setCurrentMatch: (match: Match | null) => void
  setLoading: (loading: boolean) => void
}

export const useMatchStore = create<MatchStore>((set) => ({
  matches: [],
  currentMatch: null,
  isLoading: false,
  setMatches: (matches) => set({ matches }),
  setCurrentMatch: (currentMatch) => set({ currentMatch }),
  setLoading: (isLoading) => set({ isLoading }),
}))
```

---

## 🎨 Tailwind Color Utilities

Add these to your Tailwind config for quick color access:

```typescript
// In tailwind.config.ts theme.extend.colors
ruchi: {
  navy: '#1A1F3A',          // Text, dark UI
  purple: '#6B5FFF',        // Primary action
  'purple-dark': '#5547D9', // Hover states
  'primary-light': '#E6E0FF', // Light backgrounds
  'bg-light': '#F5F3FF',    // Page backgrounds
  'text-secondary': '#8B8B8B', // Secondary text
}
```

Usage in JSX:
```jsx
<div className="bg-ruchi-bgLight text-ruchi-navy">...</div>
<button className="bg-ruchi-purple hover:bg-ruchi-purple-dark text-white">...</button>
```

---

## 📦 Component Organization

**Base Components** (reusable everywhere):
- Button
- Avatar
- Badge
- LoadingSpinner
- Input
- Card

**Feature Components** (feature-specific):
- InterestGrid
- MatchCard
- MessageBubble
- GroupCard
- etc.

**Page Components** (full pages):
- LandingPage
- SignInPage
- DashboardPage
- ChatPage
- etc.

---

## 🔧 Development Checklist

- [ ] Setup Next.js with TypeScript + Tailwind
- [ ] Configure theme colors
- [ ] Create lib files (api, socket, store, types)
- [ ] Create custom hooks
- [ ] Build layout components
- [ ] Build auth pages
- [ ] Build onboarding flow
- [ ] Build matching feed
- [ ] Build chat interface
- [ ] Build groups page
- [ ] Connect to backend APIs
- [ ] Add real-time messaging
- [ ] Add error handling + toast notifications
- [ ] Mobile responsiveness
- [ ] Performance optimization
- [ ] Testing

---

## 🚀 Deployment

### Vercel (Easiest)
```bash
npm i -g vercel
vercel
```

### Docker
Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build & run:
```bash
docker build -t ruchi-frontend .
docker run -p 3000:3000 ruchi-frontend
```

---

## 📚 Next Steps

1. ✅ Setup Next.js project locally
2. ✅ Create lib files and hooks
3. ✅ Build layout components
4. ✅ Implement auth flow
5. ✅ Build interest profiling UI
6. ✅ Create matching feed
7. ✅ Build chat interface
8. ✅ Add real-time messaging
9. ✅ Deploy to Vercel/AWS

**You're ready to start building! 🎉**

Questions? Check the docs or jump into Claude Code for deeper implementation.
