import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/common/Button";
import { GroupPost } from "@/components/groups/GroupPost";
import { MOCK_GROUPS, MOCK_GROUP_POSTS, MOCK_RELATED_GROUPS } from "@/lib/mockData";

export default async function GroupDetailPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = await params;
  const group = MOCK_GROUPS.find((g) => g.id === groupId);

  if (!group) notFound();

  const posts = MOCK_GROUP_POSTS[groupId] || [];
  const related = MOCK_RELATED_GROUPS[groupId] || [];

  return (
    <div className="flex h-screen">
      <div className="flex-1 overflow-y-auto">
        <div className="border-b border-black/5 bg-white px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-ruchi-navy">
              {group.name}
            </h1>
            <p className="text-sm text-ruchi-text-secondary">
              {group.member_count.toLocaleString()} members
            </p>
          </div>
          <Button variant={group.is_member ? "secondary" : "primary"}>
            {group.is_member ? "Joined" : "Join"}
          </Button>
        </div>

        <div className="p-8 max-w-2xl space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-black/5">
            <input
              type="text"
              placeholder="Share your thoughts..."
              className="w-full px-4 py-2.5 rounded-full bg-ruchi-bg-light text-sm focus:outline-none focus:ring-2 focus:ring-ruchi-purple-light"
            />
          </div>

          {posts.map((post) => (
            <GroupPost key={post.id} post={post} />
          ))}
        </div>
      </div>

      {related.length > 0 && (
        <aside className="w-72 shrink-0 border-l border-black/5 bg-white p-6 hidden lg:block">
          <h2 className="font-bold text-ruchi-navy text-sm mb-4">
            Related communities
          </h2>
          <div className="space-y-3">
            {related.map((g) => (
              <Link
                key={g.id}
                href={`/dashboard/communities/${g.id}`}
                className="flex items-center justify-between group"
              >
                <div>
                  <p className="text-sm font-semibold text-ruchi-navy group-hover:text-ruchi-purple">
                    {g.name}
                  </p>
                  <p className="text-xs text-ruchi-text-secondary">
                    {g.member_count.toLocaleString()} members
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </aside>
      )}
    </div>
  );
}
