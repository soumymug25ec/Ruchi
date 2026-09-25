import { MessageCircle } from "lucide-react";

export default function MessagesIndexPage() {
  return (
    <div className="h-screen flex items-center justify-center text-center px-8">
      <div>
        <div className="w-14 h-14 rounded-full bg-ruchi-purple-light flex items-center justify-center mx-auto mb-4">
          <MessageCircle className="text-ruchi-purple" size={24} />
        </div>
        <p className="font-semibold text-ruchi-navy">Select a conversation</p>
        <p className="text-sm text-ruchi-text-secondary mt-1">
          Pick someone from the list to start chatting.
        </p>
      </div>
    </div>
  );
}
