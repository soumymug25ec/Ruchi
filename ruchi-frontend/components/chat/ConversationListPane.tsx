"use client";

import { usePathname } from "next/navigation";
import { ConversationListItem } from "./ConversationListItem";
import { MOCK_CONVERSATIONS } from "@/lib/mockData";

export function ConversationListPane() {
  const pathname = usePathname();

  return (
    <div className="w-80 shrink-0 border-r border-black/5 bg-white h-screen overflow-y-auto">
      <div className="px-5 py-5 border-b border-black/5">
        <h1 className="font-extrabold text-ruchi-navy text-lg">Messages</h1>
      </div>
      <div className="p-2 space-y-1">
        {MOCK_CONVERSATIONS.map((conversation) => (
          <ConversationListItem
            key={conversation.conversation_id}
            conversation={conversation}
            isActive={pathname === `/dashboard/messages/${conversation.other_user_id}`}
          />
        ))}
      </div>
    </div>
  );
}
