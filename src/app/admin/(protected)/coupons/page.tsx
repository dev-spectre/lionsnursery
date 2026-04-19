"use client";

import { useCallback, useEffect, useState } from "react";
import type { Coupon } from "@/generated/prisma";
import { CouponForm } from "@/features/admin/components/CouponForm";
import { adminFetch } from "@/features/admin/hooks/useAdminData";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

export default function AdminCouponsPage() {
  const [rows, setRows] = useState<Coupon[]>([]);
  const [open, setOpen] = useState(false);

  const load = useCallback(async () => {
    const r = await adminFetch("/api/coupons");
    setRows(await r.json());
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Coupons</h1>
          <p className="text-muted-foreground">Discount codes for checkout.</p>
        </div>
        <Button className="rounded-full" onClick={() => setOpen(true)}>
          Add coupon
        </Button>
      </div>
      <div className="overflow-x-auto rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Discount %</TableHead>
              <TableHead>Max uses</TableHead>
              <TableHead>Used</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead>Active</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-mono font-medium">{c.code}</TableCell>
                <TableCell>{c.discount}</TableCell>
                <TableCell>{c.maxUses ?? "∞"}</TableCell>
                <TableCell>{c.usedCount}</TableCell>
                <TableCell>
                  {c.expiresAt
                    ? new Date(c.expiresAt).toLocaleDateString("en-IN")
                    : "—"}
                </TableCell>
                <TableCell>
                  <Switch
                    checked={c.active}
                    onCheckedChange={async (active) => {
                      const r = await adminFetch(`/api/coupons/${c.id}`, {
                        method: "PATCH",
                        body: JSON.stringify({ active }),
                      });
                      if (!r.ok) toast.error("Update failed");
                      else load();
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive"
                    onClick={async () => {
                      const r = await adminFetch(`/api/coupons/${c.id}`, {
                        method: "DELETE",
                      });
                      if (!r.ok) toast.error("Delete failed");
                      else {
                        toast.success("Coupon deleted.");
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
      <CouponForm open={open} onOpenChange={setOpen} onSaved={load} />
    </div>
  );
}
