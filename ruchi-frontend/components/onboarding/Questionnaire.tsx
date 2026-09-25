"use client";

import { cn } from "@/lib/utils";
import { QuestionnaireQuestion } from "@/lib/types";

export function Questionnaire({
  question,
  selectedValue,
  onSelect,
}: {
  question: QuestionnaireQuestion;
  selectedValue: string | null;
  onSelect: (value: string) => void;
}) {
  return (
    <div>
      <h2 className="text-xl font-extrabold text-ruchi-navy mb-6">
        {question.question_text}
      </h2>
      <div className="space-y-3">
        {question.options.map((option) => {
          const isSelected = selectedValue === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onSelect(option.value)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 text-left transition-colors",
                isSelected
                  ? "border-ruchi-purple bg-ruchi-purple-light"
                  : "border-black/10 hover:border-ruchi-purple-light"
              )}
            >
              <span
                className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                  isSelected ? "border-ruchi-purple" : "border-black/20"
                )}
              >
                {isSelected && (
                  <span className="w-2.5 h-2.5 rounded-full bg-ruchi-purple" />
                )}
              </span>
              <span className="font-medium text-ruchi-navy">
                {option.text}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
