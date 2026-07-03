import { Link } from "@tanstack/react-router";
import { useCart } from "@/lib/cart-store";
import { FLAVORS, type Product } from "@/lib/products";
import { formatPKR } from "@/lib/format";
import { Plus } from "lucide-react";

export function ProductCard({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const flavor = FLAVORS[product.flavor];

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-[2rem] border-4 border-white bg-white p-5 shadow-[0_10px_30px_-15px_rgba(120,60,0,0.25)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(120,60,0,0.35)]">
      {product.comingSoon ? (
        <span className="absolute -right-2 top-4 z-10 rounded-l-full bg-ink px-3 py-1 text-xs font-bold text-white">
          Coming Soon
        </span>
      ) : product.badge && (
        <span className={`absolute -right-2 top-4 z-10 rounded-l-full px-3 py-1 text-xs font-bold text-white ${product.flavor === "chicken" ? "bg-chicken-dark" : product.flavor === "beef" ? "bg-beef" : "bg-spicy"} animate-wiggle origin-right`}>
          {product.badge}
        </span>
      )}
      {product.comingSoon ? (
        <div className={`relative mb-4 grid aspect-square place-items-center overflow-hidden rounded-[1.5rem] ${flavor.bgClass}`}>
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            width={600}
            height={600}
            className="size-4/5 object-contain transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6"
          />
        </div>
      ) : (
        <Link
          to="/product/$slug"
          params={{ slug: product.slug }}
          className={`relative mb-4 grid aspect-square place-items-center overflow-hidden rounded-[1.5rem] ${flavor.bgClass}`}
        >
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            width={600}
            height={600}
            className="size-4/5 object-contain transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6"
          />
        </Link>
      )}
      <div className="flex-1">
        <div className="mb-1 flex items-start justify-between gap-2">
          {product.comingSoon ? (
            <span className="font-display text-lg font-bold leading-tight text-ink/70">{product.name}</span>
          ) : (
            <Link to="/product/$slug" params={{ slug: product.slug }} className="font-display text-lg font-bold leading-tight hover:underline">
              {product.name}
            </Link>
          )}
          <span className={`shrink-0 font-display text-lg font-bold ${flavor.textClass}`}>{formatPKR(product.price)}</span>
        </div>
        <p className="mb-5 text-sm text-ink/60">{product.blurb}</p>
      </div>
      <button
        onClick={() => add(product.slug)}
        disabled={product.comingSoon}
        className={`flex w-full items-center justify-center gap-2 rounded-2xl py-3 font-display font-bold transition-transform active:translate-y-1 ${product.comingSoon ? "cursor-not-allowed bg-ink/10 text-ink/50" : flavor.buttonClass}`}
      >
        <Plus className="size-4" /> Add to Basket
      </button>
    </div>
  );
}