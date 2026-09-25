import { Match, Group, Conversation, DirectMessage, GroupMessage } from "./types";

// Placeholder data so the UI is demoable before the backend is wired up.
// Replace with matchAPI.getRecommendations() / chatAPI.* / groupAPI.* calls.

export const MOCK_MATCHES: Match[] = [
  {
    user_id: "u-736",
    pseudonym: "Zen#736",
    overall_match_score: 91,
    shared_interests: { "Anime & Manga": 95, Gaming: 88, "Tech & Entrepreneurship": 78 },
    num_shared_interests: 3,
    already_messaged: true,
    recent_activity: "15 mins ago",
  },
  {
    user_id: "u-102",
    pseudonym: "Pixel#102",
    overall_match_score: 84,
    shared_interests: { "Movies & Shows": 88, "Music & Pop Culture": 80, "Books & Reading": 65 },
    num_shared_interests: 3,
    already_messaged: false,
    recent_activity: "1 hour ago",
  },
  {
    user_id: "u-921",
    pseudonym: "Moon#921",
    overall_match_score: 78,
    shared_interests: { Gaming: 82, "Health & Fitness": 74, "Food & Travel": 70 },
    num_shared_interests: 3,
    already_messaged: false,
    recent_activity: "3 hours ago",
  },
  {
    user_id: "u-498",
    pseudonym: "Kairo#498",
    overall_match_score: 72,
    shared_interests: { "History & Society": 76, "Debate & Reading": 68 },
    num_shared_interests: 2,
    already_messaged: true,
    recent_activity: "Yesterday",
  },
];

export const MOCK_GROUPS: Group[] = [
  {
    id: "g-onepiece",
    name: "One Piece",
    category: "Anime & Manga",
    description: "Weekly chapter discussions and theories.",
    member_count: 1240,
    is_member: true,
  },
  {
    id: "g-gaming",
    name: "Gaming",
    category: "Gaming",
    description: "LFG, patch notes, and tournament watch parties.",
    member_count: 980,
    is_member: true,
  },
  {
    id: "g-movies",
    name: "Movies & Shows",
    category: "Movies & Shows",
    description: "New releases, hot takes, and recommendations.",
    member_count: 756,
    is_member: false,
  },
  {
    id: "g-naruto",
    name: "Naruto",
    category: "Anime & Manga",
    description: "Believe it.",
    member_count: 980,
    is_member: false,
  },
  {
    id: "g-aot",
    name: "Attack on Titan",
    category: "Anime & Manga",
    description: "For the ending discourse that never ends.",
    member_count: 860,
    is_member: false,
  },
  {
    id: "g-jjk",
    name: "Jujutsu Kaisen",
    category: "Anime & Manga",
    description: "Domain expansions and everything in between.",
    member_count: 742,
    is_member: false,
  },
];

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    conversation_id: "c-736",
    other_user_id: "u-736",
    other_user_pseudonym: "Zen#736",
    last_message: "Yeah I love the world build...",
    last_message_time: "10:34",
    unread_count: 1,
    match_score: 91,
  },
  {
    conversation_id: "c-102",
    other_user_id: "u-102",
    other_user_pseudonym: "Pixel#102",
    last_message: "Same here! Let's talk more...",
    last_message_time: "09:17",
    unread_count: 0,
    match_score: 84,
  },
  {
    conversation_id: "c-921",
    other_user_id: "u-921",
    other_user_pseudonym: "Moon#921",
    last_message: "Sent a voice note",
    last_message_time: "Yesterday",
    unread_count: 2,
    match_score: 78,
  },
  {
    conversation_id: "c-203",
    other_user_id: "u-203",
    other_user_pseudonym: "Luna#203",
    last_message: "Haha true!",
    last_message_time: "2 days ago",
    unread_count: 0,
    match_score: 69,
  },
];

export const MOCK_MESSAGES: Record<string, DirectMessage[]> = {
  "u-736": [
    {
      id: "m1",
      sender_id: "u-736",
      receiver_id: "me",
      message_type: "text",
      content: "Hey! I saw you're into One Piece too! Which arc is your favourite?",
      created_at: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
      is_read: true,
    },
    {
      id: "m2",
      sender_id: "me",
      receiver_id: "u-736",
      message_type: "text",
      content: "Wano, easily. The Onigashima raid was insane pacing.",
      created_at: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
      is_read: true,
    },
    {
      id: "m3",
      sender_id: "u-736",
      receiver_id: "me",
      message_type: "text",
      content: "Yeah, definitely Marineford too — the story and characters were just next level.",
      created_at: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      is_read: true,
    },
  ],
};

export const MOCK_GROUP_POSTS: Record<string, GroupMessage[]> = {
  "g-onepiece": [
    {
      id: "p1",
      group_id: "g-onepiece",
      sender_pseudonym: "LuffyFan#291",
      message_type: "text",
      content:
        "What do you think about the latest chapter? The new chapter was insane! The way Oda connects everything is just next level. What are your thoughts?",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
  ],
};

export const MOCK_RELATED_GROUPS: Record<string, Group[]> = {
  "g-onepiece": [
    {
      id: "g-naruto",
      name: "Naruto",
      category: "Anime & Manga",
      description: "",
      member_count: 980,
      is_member: false,
    },
    {
      id: "g-aot",
      name: "Attack on Titan",
      category: "Anime & Manga",
      description: "",
      member_count: 860,
      is_member: false,
    },
    {
      id: "g-jjk",
      name: "Jujutsu Kaisen",
      category: "Anime & Manga",
      description: "",
      member_count: 742,
      is_member: false,
    },
  ],
};
