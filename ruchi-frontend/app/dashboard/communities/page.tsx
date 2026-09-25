import { DashboardTopBar } from "@/components/layout/DashboardTopBar";
import { GroupCard } from "@/components/groups/GroupCard";
import { MOCK_GROUPS } from "@/lib/mockData";

export default function CommunitiesPage() {
  return (
    <>
      <DashboardTopBar
        title="Communities"
        subtitle="Interest-based groups at your institution."
      />
      <div className="p-8 max-w-5xl">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_GROUPS.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      </div>
    </>
  );
}
