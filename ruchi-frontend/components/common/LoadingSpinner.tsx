import { cn } from "@/lib/utils";

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "w-8 h-8 border-4 border-ruchi-purple-light border-t-ruchi-purple rounded-full animate-spin",
        className
      )}
      role="status"
      aria-label="Loading"
    />
  );
}
