"use client";

import { useEffect, useState } from "react";
import type { Category } from "@/generated/prisma";
import type { PlantWithCategories } from "@/features/plants/types/plant";
import { ImageUpload } from "@/features/shared/components/ImageUpload";
import { CLOUDINARY } from "@/constants";
import { adminFetch } from "../hooks/useAdminData";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  plant: PlantWithCategories | null;
  categories: Category[];
  onSaved: () => void;
};

export function PlantForm({
  open,
  onOpenChange,
  plant,
  categories,
  onSaved,
}: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [inStock, setInStock] = useState(true);
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!open) return;
    if (plant) {
      setName(plant.name);
      setDescription(plant.description ?? "");
      setPrice(String(plant.price));
      setImageUrl(plant.imageUrl);
      setInStock(plant.inStock);
      const sel: Record<string, boolean> = {};
      plant.categories.forEach((c) => {
        sel[c.categoryId] = true;
      });
      setSelected(sel);
    } else {
      setName("");
      setDescription("");
      setPrice("");
      setImageUrl(null);
      setInStock(true);
      setSelected({});
    }
  }, [open, plant]);

  async function save() {
    const categoryIds = Object.entries(selected)
      .filter(([, v]) => v)
      .map(([k]) => k);
    if (!categoryIds.length) {
      toast.error("Select at least one category.");
      return;
    }
    const payload = {
      name: name.trim(),
      description: description.trim() || null,
      price: parseFloat(price),
      imageUrl: imageUrl || "",
      inStock,
      categoryIds,
    };
    try {
      if (plant) {
        const r = await adminFetch(`/api/plants/${plant.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        if (!r.ok) throw new Error();
      } else {
        const r = await adminFetch("/api/plants", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        if (!r.ok) throw new Error();
      }
      toast.success("Plant saved.");
      onSaved();
      onOpenChange(false);
    } catch {
      toast.error("Could not save plant.");
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="font-display">
            {plant ? "Edit plant" : "Add plant"}
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 rounded-lg"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 rounded-lg"
              rows={3}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Price (₹)</label>
            <Input
              type="number"
              min={0}
              step={1}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mt-1 rounded-lg"
            />
          </div>
          <div>
            <p className="text-sm font-medium">Image</p>
            <div className="mt-2">
              <ImageUpload
                folder={CLOUDINARY.folders.plants}
                currentUrl={imageUrl}
                onUpload={setImageUrl}
                onRemove={() => setImageUrl(null)}
              />
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">Categories</p>
            <div className="flex max-h-40 flex-col gap-2 overflow-y-auto rounded-lg border border-border p-3">
              {categories.map((c) => (
                <label key={c.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={!!selected[c.id]}
                    onChange={(e) =>
                      setSelected((s) => ({ ...s, [c.id]: e.target.checked }))
                    }
                  />
                  {c.name}
                </label>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">In stock</span>
            <Switch checked={inStock} onCheckedChange={setInStock} />
          </div>
          <Button type="button" className="w-full rounded-full" onClick={save}>
            Save
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
