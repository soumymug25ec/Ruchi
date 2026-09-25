import { create } from "zustand";
import { User, Match, DirectMessage } from "./types";

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  login: (token, user) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("ruchi_token", token);
    }
    set({ token, user, isAuthenticated: true });
  },
  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("ruchi_token");
    }
    set({ token: null, user: null, isAuthenticated: false });
  },
  setUser: (user) => set({ user }),
  hydrate: () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("ruchi_token");
      if (token) set({ token, isAuthenticated: true });
    }
  },
}));

interface ChatStore {
  conversations: Record<string, DirectMessage[]>;
  currentConversation: string | null;
  typingUsers: Set<string>;
  addMessage: (conversationId: string, message: DirectMessage) => void;
  setMessages: (conversationId: string, messages: DirectMessage[]) => void;
  setCurrentConversation: (userId: string | null) => void;
  setTyping: (userId: string, isTyping: boolean) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  conversations: {},
  currentConversation: null,
  typingUsers: new Set(),
  addMessage: (conversationId, message) =>
    set((state) => ({
      conversations: {
        ...state.conversations,
        [conversationId]: [...(state.conversations[conversationId] || []), message],
      },
    })),
  setMessages: (conversationId, messages) =>
    set((state) => ({
      conversations: { ...state.conversations, [conversationId]: messages },
    })),
  setCurrentConversation: (userId) => set({ currentConversation: userId }),
  setTyping: (userId, isTyping) =>
    set((state) => {
      const next = new Set(state.typingUsers);
      if (isTyping) {
        next.add(userId);
      } else {
        next.delete(userId);
      }
      return { typingUsers: next };
    }),
}));

interface MatchStore {
  matches: Match[];
  isLoading: boolean;
  setMatches: (matches: Match[]) => void;
  setLoading: (loading: boolean) => void;
}

export const useMatchStore = create<MatchStore>((set) => ({
  matches: [],
  isLoading: false,
  setMatches: (matches) => set({ matches }),
  setLoading: (isLoading) => set({ isLoading }),
}));

interface OnboardingStore {
  selectedCategoryIds: number[];
  toggleCategory: (id: number) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  selectedCategoryIds: [],
  toggleCategory: (id) =>
    set((state) => ({
      selectedCategoryIds: state.selectedCategoryIds.includes(id)
        ? state.selectedCategoryIds.filter((c) => c !== id)
        : [...state.selectedCategoryIds, id],
    })),
  reset: () => set({ selectedCategoryIds: [] }),
}));
