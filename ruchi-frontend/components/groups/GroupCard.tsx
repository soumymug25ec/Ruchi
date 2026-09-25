import Link from "next/link";
import { Button } from "@/components/common/Button";
import { Group } from "@/lib/types";

export function GroupCard({ group }: { group: Group }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-black/5 shadow-[0_1px_12px_rgba(26,31,58,0.05)] flex items-center justify-between gap-4">
      <Link href={`/dashboard/communities/${group.id}`} className="min-w-0 flex-1">
        <p className="font-bold text-ruchi-navy truncate">{group.name}</p>
        <p className="text-xs text-ruchi-text-secondary">
          {group.member_count.toLocaleString()} members
        </p>
      </Link>
      <Button size="sm" variant={group.is_member ? "secondary" : "primary"}>
        {group.is_member ? "Open" : "Join"}
      </Button>
    </div>
  );
}
