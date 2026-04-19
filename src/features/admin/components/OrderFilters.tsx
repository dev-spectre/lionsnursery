"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { adminFetch } from "@/features/admin/hooks/useAdminData";
import { orderStatuses } from "@/lib/validations";
import type { Coupon } from "@/generated/prisma";

export type OrderFilterState = {
  from: string;
  to: string;
  status: string;
  search: string;
  /** ALL = no filter, NONE = orders without a coupon, else coupon code */
  coupon: string;
};

export function OrderFilters({
  value,
  onChange,
  onExport,
}: {
  value: OrderFilterState;
  onChange: (v: OrderFilterState) => void;
  onExport: () => void;
}) {
  const [couponCodes, setCouponCodes] = useState<string[]>([]);

  useEffect(() => {
    let cancel = false;
    (async () => {
      const r = await adminFetch("/api/coupons");
      if (!r.ok || cancel) return;
      const list = (await r.json()) as Coupon[];
      setCouponCodes(list.map((c) => c.code));
    })();
    return () => {
      cancel = true;
    };
  }, []);

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-end">
      <div>
        <label className="text-xs text-muted-foreground">From</label>
        <Input
          type="date"
          value={value.from}
          onChange={(e) => onChange({ ...value, from: e.target.value })}
          className="mt-1 rounded-lg"
        />
      </div>
      <div>
        <label className="text-xs text-muted-foreground">To</label>
        <Input
          type="date"
          value={value.to}
          onChange={(e) => onChange({ ...value, to: e.target.value })}
          className="mt-1 rounded-lg"
        />
      </div>
      <div>
        <label className="text-xs text-muted-foreground">Status</label>
        <Select
          value={value.status}
          onValueChange={(status: string | null) => onChange({ ...value, status: status ?? "ALL" })}
        >
          <SelectTrigger className="mt-1 w-[180px] rounded-lg">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All</SelectItem>
            {orderStatuses.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="text-xs text-muted-foreground">Coupon</label>
        <Select
          value={value.coupon}
          onValueChange={(coupon: string | null) =>
            onChange({ ...value, coupon: coupon ?? "ALL" })
          }
        >
          <SelectTrigger className="mt-1 w-[200px] rounded-lg">
            <SelectValue placeholder="Coupon" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All orders</SelectItem>
            <SelectItem value="NONE">No coupon</SelectItem>
            {couponCodes.map((code) => (
              <SelectItem key={code} value={code}>
                {code}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="min-w-[200px] flex-1">
        <label className="text-xs text-muted-foreground">Search</label>
        <Input
          placeholder="Name or phone"
          value={value.search}
          onChange={(e) => onChange({ ...value, search: e.target.value })}
          className="mt-1 rounded-lg"
        />
      </div>
      <Button type="button" variant="outline" className="rounded-full" onClick={onExport}>
        Export Excel
      </Button>
    </div>
  );
}
