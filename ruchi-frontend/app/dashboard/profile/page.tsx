import Link from "next/link";
import { DashboardTopBar } from "@/components/layout/DashboardTopBar";
import { Button } from "@/components/common/Button";
import { INTEREST_CATEGORIES } from "@/lib/constants";

export default function ProfilePage() {
  // Placeholder selection until wired to interestAPI.getUserInterests()
  const myInterests = INTEREST_CATEGORIES.slice(0, 4);

  return (
    <>
      <DashboardTopBar title="Your profile" subtitle="Only you can see this page as your real identity." />
      <div className="p-8 max-w-2xl space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-black/5">
          <h2 className="font-bold text-ruchi-navy mb-1">Your interests</h2>
          <p className="text-sm text-ruchi-text-secondary mb-4">
            These power your matches and recommendations.
          </p>
          <div className="flex flex-wrap gap-2">
            {myInterests.map((c) => (
              <span
                key={c.id}
                className="px-3 py-1.5 bg-ruchi-bg-light text-ruchi-navy text-sm font-semibold rounded-full"
              >
                {c.emoji} {c.name}
              </span>
            ))}
          </div>
          <Link href="/onboarding/interests" className="inline-block mt-4">
            <Button size="sm" variant="outline">
              Edit interests
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-black/5">
          <h2 className="font-bold text-ruchi-navy mb-1">Privacy</h2>
          <p className="text-sm text-ruchi-text-secondary">
            Your real identity is never shown to other users — only your
            pseudonym and shared interests.
          </p>
        </div>
      </div>
    </>
  );
}
