import { cn } from "@/lib/utils";

export function Logo({
  size = "md",
  showWordmark = true,
  className,
}: {
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
  className?: string;
}) {
  const ringSizes: Record<string, string> = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };
  const textSizes: Record<string, string> = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
  };

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className={cn(
          ringSizes[size],
          "rounded-full border-2 border-ruchi-navy flex items-center justify-center relative"
        )}
      >
        <span
          className={cn(
            "font-extrabold text-ruchi-navy",
            size === "lg" ? "text-2xl" : "text-base"
          )}
        >
          R
        </span>
      </div>
      {showWordmark && (
        <span className={cn("font-extrabold tracking-tight text-ruchi-navy", textSizes[size])}>
          RUCHI
        </span>
      )}
    </div>
  );
}
