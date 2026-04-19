import type { Category, Plant, PlantCategory } from "@/generated/prisma";

export type PlantWithCategories = Plant & {
  categories: (PlantCategory & { category: Category })[];
};
