"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartLine = {
  plantId: string;
  name: string;
  price: number;
  quantity: number;
};

type CartState = {
  items: CartLine[];
  couponCode: string | null;
  couponDiscount: number | null;
  add: (line: Omit<CartLine, "quantity"> & { quantity?: number }) => void;
  setQty: (plantId: string, quantity: number) => void;
  remove: (plantId: string) => void;
  clear: () => void;
  setCoupon: (code: string | null, discountPercent: number | null) => void;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,
      couponDiscount: null,
      add: (line) => {
        const items = [...get().items];
        const i = items.findIndex((x) => x.plantId === line.plantId);
        const q = line.quantity ?? 1;
        if (i >= 0) {
          items[i] = {
            ...items[i]!,
            quantity: items[i]!.quantity + q,
          };
        } else {
          items.push({
            plantId: line.plantId,
            name: line.name,
            price: line.price,
            quantity: q,
          });
        }
        set({ items });
      },
      setQty: (plantId, quantity) => {
        const items = get().items
          .map((it) =>
            it.plantId === plantId ? { ...it, quantity } : it,
          )
          .filter((it) => it.quantity > 0);
        set({ items });
      },
      remove: (plantId) =>
        set({ items: get().items.filter((i) => i.plantId !== plantId) }),
      clear: () => set({ items: [], couponCode: null, couponDiscount: null }),
      setCoupon: (code, discountPercent) =>
        set({ couponCode: code, couponDiscount: discountPercent }),
    }),
    { name: "lions-nursery-cart" },
  ),
);
