import React from "react";
import { cn } from "@/lib/utils";

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
}

export function TextField({
  label,
  hint,
  error,
  className,
  id,
  ...props
}: TextFieldProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div>
      <label
        htmlFor={inputId}
        className="block text-sm font-semibold text-ruchi-navy mb-1.5"
      >
        {label}
      </label>
      <input
        id={inputId}
        className={cn(
          "w-full px-4 py-3 border-2 rounded-lg transition-colors focus:outline-none",
          error
            ? "border-ruchi-error"
            : "border-black/10 focus:border-ruchi-purple",
          className
        )}
        {...props}
      />
      {hint && !error && (
        <p className="text-xs text-ruchi-text-secondary mt-1.5">{hint}</p>
      )}
      {error && <p className="text-xs text-ruchi-error mt-1.5">{error}</p>}
    </div>
  );
}
