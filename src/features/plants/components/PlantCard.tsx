"use client";

import Image from "next/image";
import type { PlantWithCategories } from "../types/plant";
import { useCart } from "../hooks/useCart";
import { cloudinaryBlurDataUrl } from "@/features/shared/lib/cloudinary";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Leaf, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function PlantCard({ plant }: { plant: PlantWithCategories }) {
  const add = useCart((s) => s.add);
  const setQty = useCart((s) => s.setQty);
  const line = useCart((s) => s.items.find((i) => i.plantId === plant.id));
  const blur = cloudinaryBlurDataUrl(plant.imageUrl ?? undefined);
  const disabled = !plant.inStock;

  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-md transition hover:-translate-y-0.5 hover:shadow-lg",
        disabled && "opacity-60",
      )}
    >
      <div className="relative aspect-[4/3] w-full bg-botanical-primary-light">
        {plant.imageUrl ? (
          <Image
            src={plant.imageUrl}
            alt={plant.name}
            fill
            className="object-cover"
            sizes="(max-width:768px) 100vw, 25vw"
            placeholder={blur ? "blur" : undefined}
            blurDataURL={blur}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-botanical-text-muted">
            <Leaf className="h-10 w-10 text-botanical-primary/50" />
            <span className="text-xs">No image uploaded</span>
          </div>
        )}
        {disabled && (
          <span className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white">
            Out of Stock
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-lg font-semibold text-botanical-text">
          {plant.name}
        </h3>
        <p className="mt-1 text-lg font-bold text-botanical-primary">
          ₹{plant.price.toFixed(0)}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {plant.categories.map((pc) => (
            <Badge
              key={pc.categoryId}
              variant="secondary"
              className="rounded-full bg-botanical-primary-light text-botanical-text"
            >
              {pc.category.name}
            </Badge>
          ))}
        </div>
        <div className="mt-auto pt-4">
          {!line ? (
            <Button
              className="w-full rounded-full shadow-none"
              disabled={disabled}
              onClick={() => {
                add({
                  plantId: plant.id,
                  name: plant.name,
                  price: plant.price,
                  quantity: 1,
                });
                toast.success("Plant added to cart!");
              }}
            >
              Add to Cart
            </Button>
          ) : (
            <div className="flex items-center justify-between gap-2 rounded-full border border-border bg-botanical-surface-2 px-2 py-1">
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="rounded-full"
                disabled={disabled}
                onClick={() => setQty(plant.id, line.quantity - 1)}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="min-w-[2ch] text-center text-sm font-semibold">
                {line.quantity}
              </span>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="rounded-full"
                disabled={disabled}
                onClick={() => setQty(plant.id, line.quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
