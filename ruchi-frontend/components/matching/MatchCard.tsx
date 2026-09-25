import Link from "next/link";
import { Avatar } from "@/components/common/Avatar";
import { Button } from "@/components/common/Button";
import { Match } from "@/lib/types";
import { matchScoreColor } from "@/lib/utils";

export function MatchCard({ match }: { match: Match }) {
  const sharedInterestNames = Object.keys(match.shared_interests);

  return (
    <div className="bg-white rounded-2xl p-5 border border-black/5 shadow-[0_1px_12px_rgba(26,31,58,0.05)] flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar pseudonym={match.pseudonym} />
          <div>
            <p className="font-bold text-ruchi-navy">{match.pseudonym}</p>
            <p className="text-xs text-ruchi-text-secondary">
              {sharedInterestNames.slice(0, 2).join(" · ")}
            </p>
          </div>
        </div>
        <span
          className={`text-sm font-extrabold ${matchScoreColor(
            match.overall_match_score
          )}`}
        >
          {match.overall_match_score}%
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {sharedInterestNames.slice(0, 3).map((name) => (
          <span
            key={name}
            className="px-2.5 py-1 bg-ruchi-bg-light text-ruchi-navy text-xs font-semibold rounded-full"
          >
            {name}
          </span>
        ))}
        {sharedInterestNames.length > 3 && (
          <span className="px-2.5 py-1 bg-ruchi-bg-light text-ruchi-navy text-xs font-semibold rounded-full">
            +{sharedInterestNames.length - 3}
          </span>
        )}
      </div>

      <Link href={`/dashboard/messages/${match.user_id}`}>
        <Button size="sm" variant="secondary" className="w-full">
          {match.already_messaged ? "Continue chat" : "Chat"}
        </Button>
      </Link>
    </div>
  );
}
