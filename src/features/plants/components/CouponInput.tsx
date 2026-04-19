"use client";

import { useState } from "react";
import { useCart } from "../hooks/useCart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function CouponInput() {
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(
    null,
  );
  const setCoupon = useCart((s) => s.setCoupon);
  const applied = useCart((s) => s.couponCode);

  async function apply() {
    const c = code.trim().toUpperCase();
    if (!c) return;
    setMsg(null);
    toast.loading("Validating coupon…", { id: "coupon" });
    try {
      const r = await fetch(`/api/coupons?code=${encodeURIComponent(c)}`);
      const data = await r.json().catch(() => ({}));
      if (!r.ok || !data.valid) {
        setCoupon(null, null);
        setMsg({ type: "err", text: "Coupon is expired or invalid." });
        toast.error("Coupon is expired or invalid.", { id: "coupon" });
        return;
      }
      setCoupon(data.code, data.discount);
      setMsg({
        type: "ok",
        text: `${data.code} applied — ${data.discount}% off!`,
      });
      toast.success(`${data.code} applied — ${data.discount}% off!`, {
        id: "coupon",
      });
    } catch {
      setCoupon(null, null);
      setMsg({ type: "err", text: "Could not validate coupon." });
      toast.error("Could not validate coupon.", { id: "coupon" });
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card/80 p-3">
      <p className="text-xs font-medium text-botanical-text-muted">Coupon</p>
      <div className="mt-2 flex gap-2">
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="SAVE10"
          className="rounded-full border-border font-mono text-sm uppercase"
        />
        <Button
          type="button"
          variant="secondary"
          className="shrink-0 rounded-full"
          onClick={apply}
        >
          Apply
        </Button>
      </div>
      {applied && (
        <p className="mt-2 text-xs text-botanical-text-muted">
          Applied: <strong>{applied}</strong>
        </p>
      )}
      {msg?.type === "err" && (
        <p className="mt-2 text-xs text-destructive">{msg.text}</p>
      )}
      {msg?.type === "ok" && (
        <p className="mt-2 text-xs text-botanical-primary">{msg.text}</p>
      )}
    </div>
  );
}
