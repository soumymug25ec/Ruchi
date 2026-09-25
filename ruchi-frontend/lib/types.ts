export interface Institution {
  id: string;
  name: string;
  email_domain: string;
  city?: string;
}

export interface User {
  id: string;
  pseudonym: string;
  email_verified: boolean;
  institution_id: string;
  institution_name?: string;
  interests: UserInterest[];
  created_at: string;
}

export interface InterestCategory {
  id: number;
  name: string;
  emoji: string;
  description?: string;
}

export interface UserInterest {
  category_id: number;
  category_name: string;
  interest_score: number;
  responses: Record<string, string>;
  completed_at?: string;
}

export interface QuestionOption {
  value: string;
  text: string;
}

export interface QuestionnaireQuestion {
  id: number;
  question_text: string;
  question_type: "multiple_choice" | "text" | "slider";
  options: QuestionOption[];
}

export interface Match {
  user_id: string;
  pseudonym: string;
  overall_match_score: number;
  shared_interests: Record<string, number>;
  num_shared_interests: number;
  already_messaged: boolean;
  recent_activity?: string;
}

export interface DirectMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  message_type: "text" | "voice_note";
  content?: string;
  voice_note_url?: string;
  duration_seconds?: number;
  created_at: string;
  is_read: boolean;
}

export interface Conversation {
  conversation_id: string;
  other_user_id: string;
  other_user_pseudonym: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
  match_score: number;
}

export interface Group {
  id: string;
  name: string;
  category: string;
  description: string;
  member_count: number;
  is_member: boolean;
  created_at?: string;
}

export interface GroupMessage {
  id: string;
  group_id: string;
  sender_pseudonym: string;
  message_type: "text" | "voice_note";
  content?: string;
  voice_note_url?: string;
  is_pinned?: boolean;
  created_at: string;
}
