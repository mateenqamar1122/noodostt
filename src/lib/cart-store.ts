import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PRODUCTS, type Product } from "./products";

export type CartItem = {
  slug: string;
  qty: number;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  lastAddedSlug: string | null;
  open: () => void;
  close: () => void;
  add: (slug: string, qty?: number) => void;
  remove: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      lastAddedSlug: null,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      add: (slug, qty = 1) =>
        set((s) => {
          const p = PRODUCTS.find((x) => x.slug === slug);
          if (!p || p.comingSoon) return s;
          const existing = s.items.find((i) => i.slug === slug);
          const items = existing
            ? s.items.map((i) => (i.slug === slug ? { ...i, qty: i.qty + qty } : i))
            : [...s.items, { slug, qty }];
          return { items, lastAddedSlug: slug, isOpen: true };
        }),
      remove: (slug) => set((s) => ({ items: s.items.filter((i) => i.slug !== slug) })),
      setQty: (slug, qty) =>
        set((s) => ({
          items: qty <= 0
            ? s.items.filter((i) => i.slug !== slug)
            : s.items.map((i) => (i.slug === slug ? { ...i, qty } : i)),
        })),
      clear: () => set({ items: [] }),
    }),
    { name: "noodle-basket" },
  ),
);

export function cartLine(item: CartItem): { product: Product | undefined; subtotal: number } {
  const product = PRODUCTS.find((p) => p.slug === item.slug);
  return { product, subtotal: (product?.price ?? 0) * item.qty };
}

export function cartTotals(items: CartItem[]) {
  const subtotal = items.reduce((sum, i) => sum + cartLine(i).subtotal, 0);
  const count = items.reduce((sum, i) => sum + i.qty, 0);
  const shipping = subtotal > 0 && subtotal < 500 ? 150 : 0;
  const total = subtotal + shipping;
  return { subtotal, count, shipping, total };
}