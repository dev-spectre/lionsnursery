"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function PlantSearch({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative flex-1 min-w-[200px]">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-botanical-text-muted" />
      <Input
        placeholder="Search plants…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-full border-border pl-10"
      />
    </div>
  );
}
