"use client";

import { useEffect, useState } from "react";
import { useCart } from "../hooks/useCart";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChange: (o: boolean) => void;
};

export function OrderModal({ open, onOpenChange }: Props) {
  const items = useCart((s) => s.items);
  const couponCode = useCart((s) => s.couponCode);
  const clear = useCart((s) => s.clear);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [couponField, setCouponField] = useState(couponCode ?? "");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) setCouponField(couponCode ?? "");
  }, [open, couponCode]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !phone.trim()) {
      setError("Name and phone are required.");
      return;
    }
    if (!items.length) {
      setError("Your cart is empty.");
      return;
    }
    toast.loading("Placing your order…", { id: "order" });
    try {
      const r = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name.trim(),
          phone: phone.trim(),
          address: address.trim() || undefined,
          message: message.trim() || undefined,
          couponCode: couponField.trim() || undefined,
          items: items.map((i) => ({
            plantId: i.plantId,
            quantity: i.quantity,
          })),
        }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) {
        setError(
          typeof data.error === "string"
            ? data.error
            : "Failed to place order. Please try again.",
        );
        toast.error("Failed to place order. Please try again.", { id: "order" });
        return;
      }
      toast.success("Order placed! We'll call you shortly. 🎉", { id: "order" });
      clear();
      onOpenChange(false);
      setName("");
      setPhone("");
      setAddress("");
      setMessage("");
      setCouponField("");
    } catch {
      setError("Network error. Please try again.");
      toast.error("Failed to place order. Please try again.", { id: "order" });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-xl sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            Complete your order
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-sm font-medium" htmlFor="ord-name">
              Full Name *
            </label>
            <Input
              id="ord-name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 rounded-lg"
            />
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="ord-phone">
              Phone *
            </label>
            <Input
              id="ord-phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 rounded-lg"
            />
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="ord-addr">
              Address
            </label>
            <Textarea
              id="ord-addr"
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-1 rounded-lg"
            />
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="ord-coupon">
              Coupon code
            </label>
            <Input
              id="ord-coupon"
              value={couponField}
              onChange={(e) => setCouponField(e.target.value.toUpperCase())}
              className="mt-1 rounded-lg font-mono uppercase"
            />
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="ord-msg">
              Message
            </label>
            <Textarea
              id="ord-msg"
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-1 rounded-lg"
            />
          </div>
          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
          <Button type="submit" className="w-full rounded-full">
            Place order
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
