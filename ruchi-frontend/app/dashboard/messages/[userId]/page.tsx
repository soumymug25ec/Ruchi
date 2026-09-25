"use client";

import { use, useState } from "react";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { MessageInput } from "@/components/chat/MessageInput";
import { Avatar } from "@/components/common/Avatar";
import { MOCK_CONVERSATIONS, MOCK_MESSAGES } from "@/lib/mockData";
import { DirectMessage } from "@/lib/types";

export default function ConversationPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = use(params);
  const conversation = MOCK_CONVERSATIONS.find(
    (c) => c.other_user_id === userId
  );
  const [messages, setMessages] = useState<DirectMessage[]>(
    MOCK_MESSAGES[userId] || []
  );

  function handleSend(content: string) {
    setMessages((prev) => [
      ...prev,
      {
        id: `local-${Date.now()}`,
        sender_id: "me",
        receiver_id: userId,
        message_type: "text",
        content,
        created_at: new Date().toISOString(),
        is_read: true,
      },
    ]);
    // TODO: chatAPI.sendMessage(userId, content) + emit via socket
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="border-b border-black/5 bg-white px-6 py-4 flex items-center gap-3">
        <Avatar pseudonym={conversation?.other_user_pseudonym || "User"} />
        <div>
          <p className="font-bold text-ruchi-navy">
            {conversation?.other_user_pseudonym || "User"}
          </p>
          {conversation && (
            <p className="text-xs text-ruchi-text-secondary">
              {conversation.match_score}% match
            </p>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-ruchi-bg-light/40">
        {messages.length === 0 && (
          <p className="text-center text-sm text-ruchi-text-secondary mt-10">
            Say hi — you both matched on shared interests.
          </p>
        )}
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            content={msg.content || ""}
            isSent={msg.sender_id === "me"}
            timestamp={new Date(msg.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          />
        ))}
      </div>

      <MessageInput onSend={handleSend} />
    </div>
  );
}
