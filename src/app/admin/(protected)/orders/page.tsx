"use client";

import { useCallback, useEffect, useState } from "react";
import { OrderFilters, type OrderFilterState } from "@/features/admin/components/OrderFilters";
import { OrderTable, type OrderRow } from "@/features/admin/components/OrderTable";
import { adminFetch } from "@/features/admin/hooks/useAdminData";
import { toast } from "sonner";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<OrderFilterState>({
    from: "",
    to: "",
    status: "ALL",
    search: "",
    coupon: "ALL",
  });

  const load = useCallback(async () => {
    const params = new URLSearchParams();
    if (filters.from) params.set("from", filters.from);
    if (filters.to) params.set("to", filters.to);
    if (filters.status) params.set("status", filters.status);
    if (filters.search.trim()) params.set("search", filters.search.trim());
    if (filters.coupon && filters.coupon !== "ALL") {
      params.set("coupon", filters.coupon);
    }
    const r = await adminFetch(`/api/orders?${params.toString()}`);
    if (!r.ok) {
      toast.error("Could not load orders.");
      return;
    }
    const data = (await r.json()) as { orders: OrderRow[]; total: number };
    setOrders(data.orders);
    setTotal(data.total);
  }, [filters]);

  useEffect(() => {
    load();
  }, [load]);

  function exportXlsx() {
    const params = new URLSearchParams();
    if (filters.from) params.set("from", filters.from);
    if (filters.to) params.set("to", filters.to);
    if (filters.status) params.set("status", filters.status);
    if (filters.search.trim()) params.set("search", filters.search.trim());
    if (filters.coupon && filters.coupon !== "ALL") {
      params.set("coupon", filters.coupon);
    }
    window.open(`/api/orders/export?${params.toString()}`, "_blank");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground">
          Filter, update status, and export to Excel.
        </p>
        <p className="mt-2 text-sm text-botanical-text">
          <strong>{total}</strong> order{total === 1 ? "" : "s"} match these filters.
          {total > 500 ? (
            <span className="text-muted-foreground">
              {" "}
              Showing the first 500 in the table.
            </span>
          ) : null}
        </p>
      </div>
      <OrderFilters value={filters} onChange={setFilters} onExport={exportXlsx} />
      <OrderTable orders={orders} onRefresh={load} />
    </div>
  );
}
