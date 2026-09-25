import { ConversationListPane } from "@/components/chat/ConversationListPane";

export default function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <ConversationListPane />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
