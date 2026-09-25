"use client";

import { useRouter } from "next/navigation";
import { Logo } from "@/components/common/Logo";
import { Button } from "@/components/common/Button";
import { PartyPopper } from "lucide-react";

export default function OnboardingCompletePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-ruchi-bg-light to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="flex justify-center mb-6">
          <Logo size="lg" showWordmark={false} />
        </div>
        <div className="bg-white rounded-2xl p-10 shadow-[0_2px_24px_rgba(26,31,58,0.08)] border border-black/5">
          <div className="w-16 h-16 bg-ruchi-purple-light rounded-full flex items-center justify-center mx-auto mb-5">
            <PartyPopper className="text-ruchi-purple" size={28} />
          </div>
          <h1 className="text-2xl font-extrabold text-ruchi-navy mb-2">
            You&apos;re all set!
          </h1>
          <p className="text-ruchi-text-secondary mb-8">
            We&apos;ve built your interest profile. Time to find your people.
          </p>
          <Button className="w-full" onClick={() => router.push("/dashboard")}>
            See my matches
          </Button>
        </div>
      </div>
    </div>
  );
}
