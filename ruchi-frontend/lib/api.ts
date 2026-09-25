import axios from "axios";
import { API_URL } from "./constants";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("ruchi_token") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      typeof window !== "undefined" &&
      error.response?.status === 401
    ) {
      localStorage.removeItem("ruchi_token");
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  signup: (email: string, password: string) =>
    api.post("/auth/signup", { email, password }),
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),
  verifyEmail: (email: string, verification_code: string) =>
    api.post("/auth/verify-email", { email, verification_code }),
  logout: () => api.post("/auth/logout"),
};

export const userAPI = {
  getProfile: () => api.get("/users/me"),
  updateProfile: (data: Record<string, unknown>) => api.put("/users/me", data),
};

export const interestAPI = {
  getCategories: () => api.get("/interests/categories"),
  startProfiling: (categoryId: number) =>
    api.post("/interests/start-profiling", { category_id: categoryId }),
  submitAnswer: (categoryId: number, questionId: number, answerValue: string) =>
    api.post("/interests/submit-answer", {
      category_id: categoryId,
      question_id: questionId,
      answer_value: answerValue,
    }),
  complete: (categoryId: number, finalAnswer: string) =>
    api.post("/interests/complete", {
      category_id: categoryId,
      final_answer: finalAnswer,
    }),
  getUserInterests: () => api.get("/interests/user-interests"),
};

export const matchAPI = {
  getRecommendations: (limit = 20, offset = 0) =>
    api.get(`/matches/recommendations?limit=${limit}&offset=${offset}`),
  getMatchDetails: (userId: string) => api.get(`/matches/${userId}`),
  recalculate: () => api.post("/matches/recalculate"),
};

export const chatAPI = {
  getConversations: (limit = 50) =>
    api.get(`/chat/conversations?limit=${limit}`),
  getMessages: (userId: string, limit = 50, offset = 0) =>
    api.get(`/chat/messages/${userId}?limit=${limit}&offset=${offset}`),
  sendMessage: (receiverId: string, content: string) =>
    api.post("/chat/messages", {
      receiver_id: receiverId,
      message_type: "text",
      content,
    }),
  markAsRead: (otherUserId: string) =>
    api.post("/chat/mark-read", { other_user_id: otherUserId }),
};

export const groupAPI = {
  getAllGroups: (institutionId: string, limit = 20) =>
    api.get(`/groups?institution_id=${institutionId}&limit=${limit}`),
  getGroupDetails: (groupId: string) => api.get(`/groups/${groupId}`),
  joinGroup: (groupId: string) => api.post(`/groups/${groupId}/join`),
  leaveGroup: (groupId: string) => api.post(`/groups/${groupId}/leave`),
  getMessages: (groupId: string, limit = 50, offset = 0) =>
    api.get(`/groups/${groupId}/messages?limit=${limit}&offset=${offset}`),
  sendMessage: (groupId: string, content: string) =>
    api.post(`/groups/${groupId}/messages`, {
      message_type: "text",
      content,
    }),
};

export default api;
