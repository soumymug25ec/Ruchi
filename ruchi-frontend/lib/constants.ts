import { InterestCategory } from "./types";

export const INTEREST_CATEGORIES: InterestCategory[] = [
  { id: 1, name: "Anime & Manga", emoji: "🎌" },
  { id: 2, name: "Gaming", emoji: "🎮" },
  { id: 3, name: "Modeling & Fashion", emoji: "👗" },
  { id: 4, name: "Health & Fitness", emoji: "💪" },
  { id: 5, name: "Food & Travel", emoji: "✈️" },
  { id: 6, name: "History & Society", emoji: "📜" },
  { id: 7, name: "Debate & Reading", emoji: "📚" },
  { id: 8, name: "Music & Pop Culture", emoji: "🎵" },
  { id: 9, name: "Movies & Shows", emoji: "🎬" },
  { id: 10, name: "Tech & Entrepreneurship", emoji: "💻" },
  { id: 11, name: "Psychology & Research", emoji: "🧠" },
];

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";
