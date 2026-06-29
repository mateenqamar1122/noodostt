import { Link } from "@tanstack/react-router";
import { useCart, cartLine, cartTotals } from "@/lib/cart-store";
import { formatPKR } from "@/lib/format";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useEffect } from "react";

export function NoodleBasket() {
  const { items, isOpen, close, setQty, remove } = useCart();
  const { subtotal, count, shipping, total } = cartTotals(items);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={close}
      />
      <aside
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-cream shadow-2xl transition-transform duration-500 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b-4 border-chicken-soft bg-chicken/20 p-5">
          <div>
            <h2 className="font-display text-2xl font-bold text-chicken-dark">Noodle Basket</h2>
            <p className="text-xs text-ink/60">{count} slurpable {count === 1 ? "item" : "items"}</p>
          </div>
          <button onClick={close} aria-label="Close basket" className="grid size-10 place-items-center rounded-full bg-white shadow hover:rotate-90 transition-transform">
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-4 grid size-24 place-items-center rounded-full bg-chicken/20 text-5xl animate-wiggle">🍜</div>
              <p className="font-display text-xl font-bold text-ink">Your basket is empty</p>
              <p className="mt-2 text-sm text-ink/60">Pick a flavor world to start slurping!</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => {
                const { product, subtotal } = cartLine(item);
                if (!product) return null;
                return (
                  <li key={item.slug} className="flex gap-3 rounded-2xl border-2 border-white bg-white p-3 shadow-sm">
                    <img src={product.image} alt={product.name} className="size-20 shrink-0 rounded-xl bg-chicken-soft object-contain" />
                    <div className="flex-1">
                      <div className="flex justify-between gap-2">
                        <p className="font-display font-bold leading-tight">{product.name}</p>
                        <button onClick={() => remove(item.slug)} aria-label="Remove" className="text-ink/40 hover:text-spicy">
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                      <p className="text-xs text-ink/60">{formatPKR(product.price)} each</p>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-1 rounded-full bg-chicken-soft p-1">
                          <button onClick={() => setQty(item.slug, item.qty - 1)} className="grid size-7 place-items-center rounded-full bg-white shadow-sm hover:bg-chicken hover:text-white">
                            <Minus className="size-3" />
                          </button>
                          <span className="w-6 text-center font-bold">{item.qty}</span>
                          <button onClick={() => setQty(item.slug, item.qty + 1)} className="grid size-7 place-items-center rounded-full bg-white shadow-sm hover:bg-chicken hover:text-white">
                            <Plus className="size-3" />
                          </button>
                        </div>
                        <span className="font-display font-bold">{formatPKR(subtotal)}</span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t-4 border-chicken-soft bg-white p-5">
            <div className="mb-1 flex justify-between text-sm text-ink/70">
              <span>Subtotal</span>
              <span>{formatPKR(subtotal)}</span>
            </div>
            <div className="mb-3 flex justify-between text-sm text-ink/70">
              <span>Shipping {subtotal >= 500 && <span className="text-chicken-dark">(free!)</span>}</span>
              <span>{formatPKR(shipping)}</span>
            </div>
            <div className="mb-4 flex justify-between font-display text-xl font-bold">
              <span>Total</span>
              <span className="text-chicken-dark">{formatPKR(total)}</span>
            </div>
            <Link
              to="/checkout"
              onClick={close}
              className="block w-full rounded-2xl bg-chicken-dark py-4 text-center font-display text-lg font-bold text-white chunky-shadow-ink transition-transform active:translate-y-1"
            >
              Checkout →
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}