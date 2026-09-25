"use client";

import { useState } from "react";
import { Mic, Send } from "lucide-react";

export function MessageInput({
  onSend,
}: {
  onSend: (content: string) => void;
}) {
  const [value, setValue] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setValue("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-black/5 bg-white p-4 flex items-center gap-3"
    >
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 px-4 py-2.5 rounded-full bg-ruchi-bg-light text-sm focus:outline-none focus:ring-2 focus:ring-ruchi-purple-light"
      />
      <button
        type="button"
        aria-label="Record voice note"
        className="w-10 h-10 rounded-full flex items-center justify-center text-ruchi-navy hover:bg-ruchi-bg-light transition-colors shrink-0"
      >
        <Mic size={19} />
      </button>
      <button
        type="submit"
        aria-label="Send message"
        disabled={!value.trim()}
        className="w-10 h-10 rounded-full bg-ruchi-purple text-white flex items-center justify-center hover:bg-ruchi-purple-dark transition-colors disabled:opacity-50 shrink-0"
      >
        <Send size={17} />
      </button>
    </form>
  );
}
