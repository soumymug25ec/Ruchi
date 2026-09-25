import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { ProgressBar } from "./ProgressBar";

export function OnboardingShell({
  step,
  total,
  onBack,
  children,
}: {
  step: number;
  total: number;
  onBack?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-ruchi-bg-light to-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="flex items-center gap-4 mb-6">
          {onBack && (
            <button
              onClick={onBack}
              aria-label="Go back"
              className="text-ruchi-navy hover:text-ruchi-purple transition-colors"
            >
              <ArrowLeft size={22} />
            </button>
          )}
          <Logo size="sm" />
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-[0_2px_24px_rgba(26,31,58,0.08)] border border-black/5">
          <ProgressBar step={step} total={total} />
          {children}
        </div>
      </div>
    </div>
  );
}
