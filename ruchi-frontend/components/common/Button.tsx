import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  const variants: Record<string, string> = {
    primary: "bg-ruchi-purple text-white hover:bg-ruchi-purple-dark",
    secondary: "bg-ruchi-bg-light text-ruchi-navy hover:bg-ruchi-purple-light",
    outline:
      "border-2 border-ruchi-navy text-ruchi-navy hover:bg-ruchi-navy hover:text-white",
    ghost: "text-ruchi-navy hover:bg-ruchi-bg-light",
  };

  const sizes: Record<string, string> = {
    sm: "px-4 py-2 text-sm rounded-lg",
    md: "px-6 py-2.5 text-base rounded-full",
    lg: "px-8 py-3.5 text-base rounded-full",
  };

  return (
    <button
      className={cn(
        "font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
