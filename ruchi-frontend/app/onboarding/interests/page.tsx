"use client";

import { useRouter } from "next/navigation";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { InterestGrid } from "@/components/onboarding/InterestGrid";
import { Button } from "@/components/common/Button";
import { INTEREST_CATEGORIES } from "@/lib/constants";
import { useOnboardingStore } from "@/lib/store";

export default function InterestSelectionPage() {
  const router = useRouter();
  const { selectedCategoryIds, toggleCategory } = useOnboardingStore();

  function handleNext() {
    router.push("/onboarding/questionnaire");
  }

  return (
    <OnboardingShell step={1} total={3} onBack={() => router.push("/dashboard")}>
      <h1 className="text-2xl font-extrabold text-ruchi-navy mb-1.5">
        What are you into?
      </h1>
      <p className="text-ruchi-text-secondary mb-6">
        Select the categories you&apos;re interested in. We&apos;ll ask a few
        follow-ups for each.
      </p>

      <InterestGrid
        categories={INTEREST_CATEGORIES}
        selectedIds={selectedCategoryIds}
        onToggle={toggleCategory}
      />

      <div className="flex items-center justify-between mt-8">
        <button
          onClick={handleNext}
          className="text-sm font-semibold text-ruchi-text-secondary hover:text-ruchi-navy"
        >
          Skip for now
        </button>
        <Button
          onClick={handleNext}
          disabled={selectedCategoryIds.length === 0}
        >
          Next
        </Button>
      </div>
    </OnboardingShell>
  );
}
