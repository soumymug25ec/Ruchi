import Link from "next/link";
import { Avatar } from "@/components/common/Avatar";
import { Conversation } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ConversationListItem({
  conversation,
  isActive,
}: {
  conversation: Conversation;
  isActive?: boolean;
}) {
  return (
    <Link
      href={`/dashboard/messages/${conversation.other_user_id}`}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
        isActive ? "bg-ruchi-purple-light" : "hover:bg-ruchi-bg-light"
      )}
    >
      <Avatar pseudonym={conversation.other_user_pseudonym} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="font-semibold text-ruchi-navy text-sm truncate">
            {conversation.other_user_pseudonym}
          </p>
          <span className="text-xs text-ruchi-text-secondary shrink-0">
            {conversation.last_message_time}
          </span>
        </div>
        <p className="text-xs text-ruchi-text-secondary truncate">
          {conversation.last_message}
        </p>
      </div>
      {conversation.unread_count > 0 && (
        <span className="w-2 h-2 rounded-full bg-ruchi-purple shrink-0" />
      )}
    </Link>
  );
}
