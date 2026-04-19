"use client";

import { useMemo, useState } from "react";
import { usePlantsData } from "../hooks/usePlants";
import { PlantGrid } from "./PlantGrid";
import { PlantSearch } from "./PlantSearch";
import { CategoryFilter } from "./CategoryFilter";
import { CartSidebar } from "./CartSidebar";
import { OrderModal } from "./OrderModal";
import type { PlantWithCategories } from "../types/plant";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

type SortKey = "default" | "price-asc" | "price-desc" | "name";

export function PlantsPageClient() {
  const { plantsQuery, categoriesQuery } = usePlantsData();
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>("default");
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const filtered = useMemo(() => {
    let list: PlantWithCategories[] = plantsQuery.data ?? [];
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description?.toLowerCase().includes(q) ?? false),
      );
    }
    if (categoryId) {
      list = list.filter((p) =>
        p.categories.some((c) => c.categoryId === categoryId),
      );
    }
    const sorted = [...list];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    if (sort === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));
    return sorted;
  }, [plantsQuery.data, search, categoryId, sort]);

  const loading = plantsQuery.isLoading || categoriesQuery.isLoading;
  const failed = plantsQuery.isError || categoriesQuery.isError;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 lg:py-14">
      <div className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-10">
        <div>
          <h1 className="font-display text-3xl font-bold text-botanical-text md:text-4xl">
            Shop plants
          </h1>
          <p className="mt-2 max-w-2xl text-botanical-text-muted">
            Search, filter, and add to your cart. We will confirm every order by phone — no online payment required.
          </p>

          <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <PlantSearch value={search} onChange={setSearch} />
            <div className="flex shrink-0 items-center gap-2">
              <span className="text-sm text-botanical-text-muted">Sort</span>
              <Select
                value={sort}
                onValueChange={(v) => setSort(v as SortKey)}
              >
                <SelectTrigger className="w-[200px] rounded-full border-border">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="name">Name A–Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6">
            <CategoryFilter
              categories={categoriesQuery.data ?? []}
              selectedId={categoryId}
              onSelect={setCategoryId}
            />
          </div>

          {failed ? (
            <div className="mt-10 rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center">
              <p className="text-botanical-text">
                Couldn&apos;t load plants. Please refresh.
              </p>
              <Button
                type="button"
                variant="outline"
                className="mt-4 rounded-full"
                onClick={() => {
                  plantsQuery.refetch();
                  categoriesQuery.refetch();
                }}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry
              </Button>
            </div>
          ) : (
            <div className="mt-10">
              <PlantGrid plants={filtered} loading={loading} />
            </div>
          )}
        </div>

        <div className="mt-10 lg:mt-0">
          <CartSidebar onCheckout={() => setCheckoutOpen(true)} />
        </div>
      </div>

      <OrderModal open={checkoutOpen} onOpenChange={setCheckoutOpen} />
    </div>
  );
}
