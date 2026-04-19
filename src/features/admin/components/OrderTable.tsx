"use client";

import { useState } from "react";
import type { Order, OrderItem } from "@/generated/prisma";
import { adminFetch } from "../hooks/useAdminData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { orderStatuses } from "@/lib/validations";
import { toast } from "sonner";

export type OrderRow = Order & { items: OrderItem[] };

export function OrderTable({ orders, onRefresh }: { orders: OrderRow[]; onRefresh: () => void }) {
  const [detail, setDetail] = useState<OrderRow | null>(null);

  async function updateStatus(id: string, status: string) {
    toast.loading("Updating…", { id: `st-${id}` });
    const r = await adminFetch(`/api/orders/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    if (!r.ok) {
      toast.error("Could not update status", { id: `st-${id}` });
      onRefresh();
      return;
    }
    toast.success("Status updated", { id: `st-${id}` });
    onRefresh();
  }

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Coupon</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((o) => (
              <TableRow key={o.id}>
                <TableCell className="whitespace-nowrap text-sm">
                  {new Date(o.createdAt).toLocaleDateString("en-IN")}
                </TableCell>
                <TableCell>{o.customerName}</TableCell>
                <TableCell>{o.phone}</TableCell>
                <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
                  {o.items.map((i) => `${i.plantName} ×${i.quantity}`).join(", ")}
                </TableCell>
                <TableCell>{o.couponCode ?? "—"}</TableCell>
                <TableCell>₹{o.total.toFixed(0)}</TableCell>
                <TableCell>
                  <Select
                    value={o.status}
                    onValueChange={(status: string | null) => status && updateStatus(o.id, status)}
                  >
                    <SelectTrigger className="h-8 w-[140px] rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {orderStatuses.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    onClick={() => setDetail(o)}
                  >
                    Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!detail} onOpenChange={() => setDetail(null)}>
        <DialogContent className="max-w-lg rounded-xl">
          <DialogHeader>
            <DialogTitle className="font-display">Order details</DialogTitle>
          </DialogHeader>
          {detail && (
            <div className="space-y-3 text-sm">
              <p>
                <strong>{detail.customerName}</strong> · {detail.phone}
              </p>
              {detail.address && <p>{detail.address}</p>}
              {detail.message && (
                <p className="text-muted-foreground">{detail.message}</p>
              )}
              <ul className="list-disc pl-5">
                {detail.items.map((i) => (
                  <li key={i.id}>
                    {i.plantName} — ₹{i.price} × {i.quantity}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
