import { Avatar } from "@/components/common/Avatar";
import { MessageCircle, Heart } from "lucide-react";
import { GroupMessage } from "@/lib/types";

export function GroupPost({ post }: { post: GroupMessage }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-black/5">
      <div className="flex items-center gap-3 mb-3">
        <Avatar pseudonym={post.sender_pseudonym} size="sm" />
        <div>
          <p className="font-semibold text-ruchi-navy text-sm">
            {post.sender_pseudonym}
          </p>
          <p className="text-xs text-ruchi-text-secondary">
            {new Date(post.created_at).toLocaleDateString(undefined, {
              hour: "numeric",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
      <p className="text-sm text-ruchi-navy leading-relaxed mb-3">
        {post.content}
      </p>
      <div className="flex items-center gap-5 text-ruchi-text-secondary">
        <button className="flex items-center gap-1.5 text-xs font-medium hover:text-ruchi-purple transition-colors">
          <Heart size={15} /> 49
        </button>
        <button className="flex items-center gap-1.5 text-xs font-medium hover:text-ruchi-purple transition-colors">
          <MessageCircle size={15} /> 12
        </button>
      </div>
    </div>
  );
}
