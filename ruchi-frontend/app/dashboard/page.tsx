import Link from "next/link";
import { DashboardTopBar } from "@/components/layout/DashboardTopBar";
import { MatchCard } from "@/components/matching/MatchCard";
import { GroupCard } from "@/components/groups/GroupCard";
import { MOCK_MATCHES, MOCK_GROUPS } from "@/lib/mockData";

export default function DashboardHomePage() {
  const popularGroups = MOCK_GROUPS.slice(0, 3);

  return (
    <>
      <DashboardTopBar
        title="Good to see you"
        subtitle="Find people. Join communities. Be yourself."
      />
      <div className="p-8 space-y-10 max-w-5xl">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-ruchi-navy">People you might like</h2>
            <Link
              href="/dashboard/people"
              className="text-sm font-semibold text-ruchi-purple"
            >
              See all
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MOCK_MATCHES.map((match) => (
              <MatchCard key={match.user_id} match={match} />
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-ruchi-navy">Popular communities</h2>
            <Link
              href="/dashboard/communities"
              className="text-sm font-semibold text-ruchi-purple"
            >
              See all
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularGroups.map((group) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
