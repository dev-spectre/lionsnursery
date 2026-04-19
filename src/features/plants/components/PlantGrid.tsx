"use client";

import type { PlantWithCategories } from "../types/plant";
import { PlantCard } from "./PlantCard";
import { Skeleton } from "@/components/ui/skeleton";

export function PlantGrid({
  plants,
  loading,
}: {
  plants: PlantWithCategories[];
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-xl border border-border bg-card shadow-md">
            <Skeleton className="aspect-[4/3] w-full rounded-none" />
            <div className="space-y-3 p-4">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-9 w-full rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!plants.length) {
    return (
      <p className="rounded-xl border border-dashed border-border bg-card p-10 text-center text-botanical-text-muted">
        No plants match your filters. Try clearing search or picking another category.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {plants.map((p) => (
        <PlantCard key={p.id} plant={p} />
      ))}
    </div>
  );
}
