"use client";

import { useCallback, useEffect, useState } from "react";
import type { Category } from "@/generated/prisma";
import { CategoryForm } from "@/features/admin/components/CategoryForm";
import { adminFetch } from "@/features/admin/hooks/useAdminData";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

type Row = Category & { _count?: { plants: number } };

export default function AdminCategoriesPage() {
  const [rows, setRows] = useState<Row[]>([]);

  const load = useCallback(async () => {
    const r = await adminFetch("/api/categories");
    setRows(await r.json());
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Categories</h1>
        <p className="text-muted-foreground">
          Categories with plant counts. Deleting is blocked when plants are assigned.
        </p>
      </div>
      <CategoryForm onCreated={load} />
      <div className="overflow-x-auto rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Plants</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell>{c._count?.plants ?? 0}</TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive"
                    onClick={async () => {
                      const r = await adminFetch(`/api/categories/${c.id}`, {
                        method: "DELETE",
                      });
                      if (!r.ok) {
                        const d = await r.json().catch(() => ({}));
                        toast.error(d.error ?? "Cannot delete category");
                      } else {
                        toast.success("Category removed.");
                        load();
                      }
                    }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
