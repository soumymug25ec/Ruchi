import { getInitialsFromPseudonym, cn } from "@/lib/utils";

interface AvatarProps {
  pseudonym: string;
  size?: "sm" | "md" | "lg";
  online?: boolean;
}

export function Avatar({ pseudonym, size = "md", online }: AvatarProps) {
  const sizes: Record<string, string> = {
    sm: "w-8 h-8 text-xs",
    md: "w-11 h-11 text-sm",
    lg: "w-16 h-16 text-lg",
  };

  return (
    <div className="relative shrink-0">
      <div
        className={cn(
          "rounded-full bg-ruchi-purple-light text-ruchi-purple-dark flex items-center justify-center font-bold",
          sizes[size]
        )}
      >
        {getInitialsFromPseudonym(pseudonym)}
      </div>
      {online && (
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-ruchi-success border-2 border-white" />
      )}
    </div>
  );
}
