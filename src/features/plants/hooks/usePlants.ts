"use client";

import { useQuery } from "@tanstack/react-query";
import type { PlantWithCategories } from "../types/plant";
import type { Category } from "@/generated/prisma";

type CategoryRow = Category & { _count?: { plants: number } };

export function usePlantsData() {
  const plantsQuery = useQuery({
    queryKey: ["plants"],
    queryFn: async () => {
      const r = await fetch("/api/plants");
      if (!r.ok) throw new Error("Failed to load plants");
      return r.json() as Promise<PlantWithCategories[]>;
    },
  });
  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const r = await fetch("/api/categories");
      if (!r.ok) throw new Error("Failed to load categories");
      return r.json() as Promise<CategoryRow[]>;
    },
  });
  return { plantsQuery, categoriesQuery };
}
