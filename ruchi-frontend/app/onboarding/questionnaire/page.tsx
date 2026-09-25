"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { Questionnaire } from "@/components/onboarding/Questionnaire";
import { Button } from "@/components/common/Button";
import { INTEREST_CATEGORIES } from "@/lib/constants";
import { getQuestionsForCategory } from "@/lib/mockQuestionnaire";
import { useOnboardingStore } from "@/lib/store";

export default function QuestionnairePage() {
  const router = useRouter();
  const { selectedCategoryIds } = useOnboardingStore();

  const categories = useMemo(
    () =>
      INTEREST_CATEGORIES.filter((c) => selectedCategoryIds.includes(c.id)),
    [selectedCategoryIds]
  );

  const [categoryIndex, setCategoryIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    if (categories.length === 0) {
      router.push("/onboarding/interests");
    }
  }, [categories.length, router]);

  if (categories.length === 0) {
    return null;
  }

  const currentCategory = categories[categoryIndex];
  const questions = getQuestionsForCategory(currentCategory.id);
  const currentQuestion = questions[questionIndex];
  const answerKey = `${currentCategory.id}-${currentQuestion.id}`;

  const totalSteps = categories.length * 3; // rough progress estimate
  const stepsDone = categoryIndex * 3 + questionIndex;

  function handleSelect(value: string) {
    setAnswers((prev) => ({ ...prev, [answerKey]: value }));
  }

  function handleBack() {
    if (questionIndex > 0) {
      setQuestionIndex((i) => i - 1);
    } else if (categoryIndex > 0) {
      setCategoryIndex((i) => i - 1);
      setQuestionIndex(getQuestionsForCategory(categories[categoryIndex - 1].id).length - 1);
    } else {
      router.push("/onboarding/interests");
    }
  }

  function handleNext() {
    if (questionIndex < questions.length - 1) {
      setQuestionIndex((i) => i + 1);
    } else if (categoryIndex < categories.length - 1) {
      setCategoryIndex((i) => i + 1);
      setQuestionIndex(0);
    } else {
      // TODO: POST `answers` via interestAPI.complete() per category
      router.push("/onboarding/complete");
    }
  }

  const isLastQuestion =
    categoryIndex === categories.length - 1 &&
    questionIndex === questions.length - 1;

  return (
    <OnboardingShell step={2} total={3} onBack={handleBack}>
      <p className="text-sm font-semibold text-ruchi-purple mb-2">
        {currentCategory.emoji} {currentCategory.name}
      </p>
      <Questionnaire
        question={currentQuestion}
        selectedValue={answers[answerKey] || null}
        onSelect={handleSelect}
      />

      <div className="flex items-center justify-between mt-8">
        <button
          onClick={handleNext}
          className="text-sm font-semibold text-ruchi-text-secondary hover:text-ruchi-navy"
        >
          Skip for now
        </button>
        <Button onClick={handleNext} disabled={!answers[answerKey]}>
          {isLastQuestion ? "Finish" : "Next"}
        </Button>
      </div>

      <p className="text-xs text-ruchi-text-secondary text-center mt-6">
        Question {stepsDone + 1} of ~{totalSteps}
      </p>
    </OnboardingShell>
  );
}
