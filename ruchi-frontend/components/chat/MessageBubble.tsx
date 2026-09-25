import { cn } from "@/lib/utils";

export function MessageBubble({
  content,
  isSent,
  timestamp,
}: {
  content: string;
  isSent: boolean;
  timestamp: string;
}) {
  return (
    <div className={cn("flex", isSent ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-xs sm:max-w-sm rounded-2xl px-4 py-2.5",
          isSent
            ? "bg-ruchi-purple text-white rounded-br-md"
            : "bg-ruchi-bg-light text-ruchi-navy rounded-bl-md"
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
        <p
          className={cn(
            "text-[10px] mt-1",
            isSent ? "text-white/60" : "text-ruchi-text-secondary"
          )}
        >
          {timestamp}
        </p>
      </div>
    </div>
  );
}
