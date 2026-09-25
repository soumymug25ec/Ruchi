import { QuestionnaireQuestion } from "./types";

// Placeholder questionnaire bank, organized by category id.
// Swap this out for `interestAPI.startProfiling` / `submitAnswer` once the
// backend questionnaire endpoints are live — the shape matches the API spec.
export const MOCK_QUESTIONS: Record<number, QuestionnaireQuestion[]> = {
  1: [
    {
      id: 101,
      question_text: "Which anime genre do you prefer?",
      question_type: "multiple_choice",
      options: [
        { value: "action", text: "Action" },
        { value: "romance", text: "Romance" },
        { value: "slice_of_life", text: "Slice of Life" },
        { value: "fantasy", text: "Fantasy" },
      ],
    },
    {
      id: 102,
      question_text: "One Piece or Attack on Titan?",
      question_type: "multiple_choice",
      options: [
        { value: "one_piece", text: "One Piece" },
        { value: "aot", text: "Attack on Titan" },
        { value: "both", text: "Both!" },
        { value: "neither", text: "Neither" },
      ],
    },
    {
      id: 103,
      question_text: "Dubbed or subbed?",
      question_type: "multiple_choice",
      options: [
        { value: "dubbed", text: "Dubbed" },
        { value: "subbed", text: "Subbed" },
        { value: "no_preference", text: "No preference" },
      ],
    },
  ],
  2: [
    {
      id: 201,
      question_text: "What do you mostly play?",
      question_type: "multiple_choice",
      options: [
        { value: "fps", text: "FPS / Shooters" },
        { value: "moba", text: "MOBA" },
        { value: "rpg", text: "RPG" },
        { value: "mobile", text: "Mobile games" },
      ],
    },
    {
      id: 202,
      question_text: "Console, PC, or mobile?",
      question_type: "multiple_choice",
      options: [
        { value: "console", text: "Console" },
        { value: "pc", text: "PC" },
        { value: "mobile", text: "Mobile" },
      ],
    },
  ],
  10: [
    {
      id: 1001,
      question_text: "What excites you more?",
      question_type: "multiple_choice",
      options: [
        { value: "building", text: "Building products" },
        { value: "research", text: "Research & papers" },
        { value: "business", text: "Business & fundraising" },
      ],
    },
    {
      id: 1002,
      question_text: "Are you currently working on a startup or side project?",
      question_type: "multiple_choice",
      options: [
        { value: "yes_active", text: "Yes, actively" },
        { value: "yes_idea", text: "Have an idea" },
        { value: "no", text: "Not yet" },
      ],
    },
  ],
};

const DEFAULT_QUESTIONS: QuestionnaireQuestion[] = [
  {
    id: 9001,
    question_text: "How would you describe your interest level?",
    question_type: "multiple_choice",
    options: [
      { value: "casual", text: "Casual" },
      { value: "moderate", text: "Moderately into it" },
      { value: "deep", text: "Deeply into it" },
    ],
  },
  {
    id: 9002,
    question_text: "Would you rather discuss this one-on-one or in a group?",
    question_type: "multiple_choice",
    options: [
      { value: "one_on_one", text: "One-on-one" },
      { value: "group", text: "In a group" },
      { value: "both", text: "Either works" },
    ],
  },
];

export function getQuestionsForCategory(
  categoryId: number
): QuestionnaireQuestion[] {
  return MOCK_QUESTIONS[categoryId] || DEFAULT_QUESTIONS;
}
