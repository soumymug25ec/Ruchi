import { DashboardTopBar } from "@/components/layout/DashboardTopBar";
import { MatchCard } from "@/components/matching/MatchCard";
import { MOCK_MATCHES } from "@/lib/mockData";

export default function PeoplePage() {
  return (
    <>
      <DashboardTopBar
        title="People"
        subtitle="Ranked by how closely your interests match."
      />
      <div className="p-8 max-w-5xl">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_MATCHES.map((match) => (
            <MatchCard key={match.user_id} match={match} />
          ))}
        </div>
      </div>
    </>
  );
}
