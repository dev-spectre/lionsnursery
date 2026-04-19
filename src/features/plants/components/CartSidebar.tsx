"use client";

import { useCart } from "../hooks/useCart";
import { CouponInput } from "./CouponInput";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2 } from "lucide-react";

type Props = {
  onCheckout: () => void;
};

export function CartSidebar({ onCheckout }: Props) {
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const couponDiscount = useCart((s) => s.couponDiscount);

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const discount =
    couponDiscount != null ? (subtotal * couponDiscount) / 100 : 0;
  const total = Math.max(0, subtotal - discount);

  return (
    <aside className="h-fit rounded-xl border border-border bg-card p-5 shadow-md lg:sticky lg:top-24">
      <h2 className="font-display text-xl font-semibold text-botanical-text">
        Your cart
      </h2>
      <Separator className="my-4" />
      {!items.length ? (
        <p className="text-sm text-botanical-text-muted">
          Add plants to start an order. Your selections stay saved on this device.
        </p>
      ) : (
        <ul className="max-h-72 space-y-3 overflow-y-auto pr-1">
          {items.map((i) => (
            <li
              key={i.plantId}
              className="flex items-start justify-between gap-2 text-sm"
            >
              <div>
                <p className="font-medium text-botanical-text">{i.name}</p>
                <p className="text-xs text-botanical-text-muted">
                  ₹{i.price} × {i.quantity}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-full"
                  onClick={() => setQty(i.plantId, i.quantity - 1)}
                >
                  <Minus className="h-3.5 w-3.5" />
                </Button>
                <span className="w-6 text-center text-xs font-semibold">
                  {i.quantity}
                </span>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-full"
                  onClick={() => setQty(i.plantId, i.quantity + 1)}
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-full text-destructive"
                  onClick={() => remove(i.plantId)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4">
        <CouponInput />
      </div>

      <Separator className="my-4" />
      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-botanical-text-muted">
          <span>Subtotal</span>
          <span>₹{subtotal.toFixed(0)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-botanical-primary">
            <span>Discount</span>
            <span>− ₹{discount.toFixed(0)}</span>
          </div>
        )}
        <div className="flex justify-between text-base font-bold text-botanical-text">
          <span>Total</span>
          <span>₹{total.toFixed(0)}</span>
        </div>
      </div>
      <Button
        type="button"
        className="mt-5 w-full rounded-full shadow-none"
        disabled={!items.length}
        onClick={onCheckout}
      >
        Proceed to Checkout
      </Button>
    </aside>
  );
}
