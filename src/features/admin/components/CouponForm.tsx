"use client";

import { useState } from "react";
import { adminFetch } from "../hooks/useAdminData";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onSaved: () => void;
};

export function CouponForm({ open, onOpenChange, onSaved }: Props) {
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("10");
  const [maxUses, setMaxUses] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [active, setActive] = useState(true);

  async function save() {
    try {
      const r = await adminFetch("/api/coupons", {
        method: "POST",
        body: JSON.stringify({
          code: code.trim().toUpperCase(),
          discount: parseFloat(discount),
          maxUses: maxUses ? parseInt(maxUses, 10) : null,
          expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
          active,
        }),
      });
      if (!r.ok) throw new Error();
      toast.success("Coupon created.");
      onSaved();
      onOpenChange(false);
      setCode("");
      setDiscount("10");
      setMaxUses("");
      setExpiresAt("");
      setActive(true);
    } catch {
      toast.error("Could not create coupon.");
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-display">Add coupon</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium">Code</label>
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="mt-1 rounded-lg font-mono uppercase"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Discount %</label>
            <Input
              type="number"
              min={0}
              max={100}
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="mt-1 rounded-lg"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Max uses (optional)</label>
            <Input
              type="number"
              min={1}
              value={maxUses}
              onChange={(e) => setMaxUses(e.target.value)}
              className="mt-1 rounded-lg"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Expires (optional)</label>
            <Input
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="mt-1 rounded-lg"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Active</span>
            <Switch checked={active} onCheckedChange={setActive} />
          </div>
          <Button type="button" className="w-full rounded-full" onClick={save}>
            Save coupon
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
