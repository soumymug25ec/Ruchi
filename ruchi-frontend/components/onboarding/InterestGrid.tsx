"use client";

import { cn } from "@/lib/utils";
import { InterestCategory } from "@/lib/types";

export function InterestGrid({
  categories,
  selectedIds,
  onToggle,
}: {
  categories: InterestCategory[];
  selectedIds: number[];
  onToggle: (id: number) => void;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {categories.map((category) => {
        const isSelected = selectedIds.includes(category.id);
        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onToggle(category.id)}
            aria-pressed={isSelected}
            className={cn(
              "p-4 rounded-xl flex flex-col items-center gap-2 text-center transition-colors border-2",
              isSelected
                ? "bg-ruchi-purple border-ruchi-purple text-white"
                : "bg-ruchi-bg-light border-transparent text-ruchi-navy hover:border-ruchi-purple-light"
            )}
          >
            <span className="text-2xl leading-none">{category.emoji}</span>
            <span className="font-semibold text-sm leading-tight">
              {category.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
