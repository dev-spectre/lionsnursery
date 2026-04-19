"use client";

import type { Category } from "@/generated/prisma";
import { cn } from "@/lib/utils";

type Props = {
  categories: Category[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
};

export function CategoryFilter({ categories, selectedId, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={cn(
          "rounded-full border px-4 py-1.5 text-sm font-medium transition hover:-translate-y-0.5",
          selectedId === null
            ? "border-botanical-primary bg-botanical-primary text-white shadow-md"
            : "border-border bg-card text-botanical-text hover:shadow-sm",
        )}
      >
        All
      </button>
      {categories.map((c) => (
        <button
          key={c.id}
          type="button"
          onClick={() => onSelect(c.id)}
          className={cn(
            "rounded-full border px-4 py-1.5 text-sm font-medium transition hover:-translate-y-0.5",
            selectedId === c.id
              ? "border-botanical-primary bg-botanical-primary text-white shadow-md"
              : "border-border bg-card text-botanical-text hover:shadow-sm",
          )}
        >
          {c.name}
        </button>
      ))}
    </div>
  );
}
