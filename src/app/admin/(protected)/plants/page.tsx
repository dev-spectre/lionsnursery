"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Category } from "@/generated/prisma";
import type { PlantWithCategories } from "@/features/plants/types/plant";
import { PlantForm } from "@/features/admin/components/PlantForm";
import { ConfirmDialog } from "@/features/shared/components/ConfirmDialog";
import { adminFetch } from "@/features/admin/hooks/useAdminData";
import { cloudinaryDeliveryUrl } from "@/features/shared/lib/cloudinary";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import Image from "next/image";

type StockFilter = "all" | "in" | "out";

export default function AdminPlantsPage() {
  const [plants, setPlants] = useState<PlantWithCategories[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [archived, setArchived] = useState(false);
  const [stockFilter, setStockFilter] = useState<StockFilter>("all");
  const [summaryPlants, setSummaryPlants] = useState<PlantWithCategories[]>(
    [],
  );
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<PlantWithCategories | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const baseParams = new URLSearchParams();
    if (archived) baseParams.set("includeDeleted", "true");
    const baseQs = baseParams.toString();
    const urlAll = `/api/plants${baseQs ? `?${baseQs}` : ""}`;

    const filteredParams = new URLSearchParams(baseParams);
    if (stockFilter !== "all") filteredParams.set("stock", stockFilter);
    const filteredQs = filteredParams.toString();
    const urlFiltered = `/api/plants${filteredQs ? `?${filteredQs}` : ""}`;

    if (stockFilter === "all") {
      const [pr, cr] = await Promise.all([
        adminFetch(urlAll),
        adminFetch("/api/categories"),
      ]);
      const list = (await pr.json()) as PlantWithCategories[];
      setPlants(list);
      setSummaryPlants(list);
      setCategories(await cr.json());
      return;
    }

    const [prFiltered, prAll, cr] = await Promise.all([
      adminFetch(urlFiltered),
      adminFetch(urlAll),
      adminFetch("/api/categories"),
    ]);
    const list = (await prFiltered.json()) as PlantWithCategories[];
    const fullForSummary = (await prAll.json()) as PlantWithCategories[];
    setPlants(list);
    setSummaryPlants(fullForSummary);
    setCategories(await cr.json());
  }, [archived, stockFilter]);

  const stockSummary = useMemo(() => {
    const active = summaryPlants.filter((p) => !p.deletedAt);
    const inStock = active.filter((p) => p.inStock).length;
    const outOfStock = active.length - inStock;
    const archivedCount = summaryPlants.filter((p) => p.deletedAt).length;
    return {
      active: active.length,
      inStock,
      outOfStock,
      archivedCount,
    };
  }, [summaryPlants]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Plants</h1>
          <p className="text-muted-foreground">Manage catalogue and stock.</p>
          <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-botanical-text">
            <span>
              <strong>{stockSummary.inStock}</strong> in stock
            </span>
            <span>
              <strong>{stockSummary.outOfStock}</strong> out of stock
            </span>
            <span className="text-muted-foreground">
              <strong>{stockSummary.active}</strong> active in catalogue
            </span>
            {stockSummary.archivedCount > 0 ? (
              <span className="text-muted-foreground">
                <strong>{stockSummary.archivedCount}</strong> archived (visible when toggled)
              </span>
            ) : null}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="text-xs text-muted-foreground">Stock filter</label>
            <Select
              value={stockFilter}
              onValueChange={(v: string | null) =>
                setStockFilter((v as StockFilter) ?? "all")
              }
            >
              <SelectTrigger className="mt-1 w-[160px] rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="in">In stock</SelectItem>
                <SelectItem value="out">Out of stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <Switch checked={archived} onCheckedChange={setArchived} />
            Show archived
          </label>
          <Button
            className="rounded-full"
            onClick={() => {
              setEditing(null);
              setSheetOpen(true);
            }}
          >
            Add plant
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20"> </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Categories</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {plants.map((p) => {
              const thumb = cloudinaryDeliveryUrl(p.imageUrl ?? undefined);
              return (
                <TableRow key={p.id} className={p.deletedAt ? "opacity-60" : ""}>
                  <TableCell>
                    <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-muted">
                      {thumb ? (
                        <Image
                          src={thumb}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>₹{p.price.toFixed(0)}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {p.categories.map((c) => (
                        <Badge key={c.categoryId} variant="secondary">
                          {c.category.name}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    {p.inStock ? (
                      <Badge>In stock</Badge>
                    ) : (
                      <Badge variant="destructive">Out</Badge>
                    )}
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full"
                      onClick={() => {
                        setEditing(p);
                        setSheetOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    {p.deletedAt ? (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="rounded-full"
                        onClick={async () => {
                          const r = await adminFetch(`/api/plants/${p.id}`, {
                            method: "PATCH",
                            body: JSON.stringify({ restore: true }),
                          });
                          if (!r.ok) toast.error("Restore failed");
                          else {
                            toast.success("Plant restored.");
                            load();
                          }
                        }}
                      >
                        Restore
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="rounded-full text-destructive"
                        onClick={() => setConfirmId(p.id)}
                      >
                        Archive
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <PlantForm
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        plant={editing}
        categories={categories}
        onSaved={load}
      />

      <ConfirmDialog
        open={!!confirmId}
        onOpenChange={() => setConfirmId(null)}
        title="Archive plant?"
        description="The plant will be hidden from the shop but past orders stay intact."
        confirmLabel="Archive"
        variant="destructive"
        onConfirm={async () => {
          if (!confirmId) return;
          const r = await adminFetch(`/api/plants/${confirmId}`, {
            method: "DELETE",
          });
          if (!r.ok) toast.error("Archive failed");
          else {
            toast.success("Plant archived.");
            load();
          }
        }}
      />
    </div>
  );
}
