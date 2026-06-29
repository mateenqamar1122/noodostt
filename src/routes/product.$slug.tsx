import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useState } from "react";
import { getProduct, FLAVORS, PRODUCTS, type FlavorSlug } from "@/lib/products";
import { useCart } from "@/lib/cart-store";
import { formatPKR } from "@/lib/format";
import { Minus, Plus, Heart, Truck, Leaf, Sparkles } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/product/$slug")({
  head: ({ params }) => {
    const p = getProduct(params.slug);
    if (!p) return { meta: [{ title: "Product not found" }] };
    return {
      meta: [
        { title: `${p.name} — Noodle World` },
        { name: "description", content: p.blurb },
        { property: "og:title", content: `${p.name} — Noodle World` },
        { property: "og:description", content: p.blurb },
        { property: "og:image", content: p.image },
      ],
    };
  },
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  notFoundComponent: () => (
    <div className="px-6 py-32 text-center">
      <h1 className="font-display text-4xl font-bold">Bowl not found</h1>
      <Link to="/" className="mt-4 inline-block text-chicken-dark underline">Back home</Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="px-6 py-32 text-center"><h1 className="font-display text-4xl font-bold">Oh noodles!</h1><p>{error.message}</p></div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const flavor = FLAVORS[product.flavor as FlavorSlug];
  const add = useCart((s) => s.add);
  const [qty, setQty] = useState(1);
  const [liked, setLiked] = useState(false);

  const related = PRODUCTS.filter((p) => p.flavor === product.flavor && p.slug !== product.slug);

  return (
    <div className={flavor.bgClass}>
      <section className="px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <Link to="/world/$slug" params={{ slug: flavor.slug }} className="text-sm font-bold text-ink/50 hover:text-ink">
            ← Back to {flavor.name}
          </Link>

          <div className="mt-6 grid items-center gap-12 lg:grid-cols-2">
            {/* Image */}
            <div className="relative">
              <div className="absolute inset-8 -z-10 rounded-full bg-white/60 blur-2xl" />
              <div className="relative aspect-square overflow-hidden rounded-[3rem] border-4 border-white bg-white p-8 shadow-2xl">
                <img src={product.image} alt={product.name} width={1024} height={1024} className="size-full object-contain animate-float-bowl cartoon-shadow" />
                <span className="pointer-events-none absolute -top-6 left-1/2 flex -translate-x-1/2 gap-2">
                  <span className="h-12 w-2 rounded-full bg-white/80 blur-md animate-steam" />
                  <span className="h-16 w-2 rounded-full bg-white/80 blur-md animate-steam" style={{ animationDelay: "0.6s" }} />
                </span>
              </div>
            </div>

            {/* Details */}
            <div>
              <span className={`inline-block rounded-full bg-white px-4 py-1 text-sm font-bold ${flavor.textClass}`}>
                {flavor.name}
              </span>
              <h1 className="mt-3 font-display text-5xl font-bold leading-none md:text-6xl">{product.name}</h1>
              <p className="mt-4 text-lg text-ink/70">{product.blurb}</p>
              <p className={`mt-6 font-display text-5xl font-bold ${flavor.textClass}`}>{formatPKR(product.price)}</p>

              <div className="mt-8 flex items-center gap-4">
                <div className="flex items-center gap-2 rounded-full bg-white p-2 shadow">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="grid size-10 place-items-center rounded-full hover:bg-chicken-soft">
                    <Minus className="size-4" />
                  </button>
                  <span className="w-10 text-center font-display text-xl font-bold">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="grid size-10 place-items-center rounded-full hover:bg-chicken-soft">
                    <Plus className="size-4" />
                  </button>
                </div>
                <button
                  onClick={() => setLiked(!liked)}
                  aria-label="Wishlist"
                  className={`grid size-14 place-items-center rounded-full bg-white shadow transition-colors ${liked ? "text-spicy" : "text-ink/40"}`}
                >
                  <Heart className={`size-6 ${liked ? "fill-current" : ""}`} />
                </button>
              </div>

              {product.comingSoon ? (
                <button
                  disabled
                  className="mt-6 w-full cursor-not-allowed rounded-3xl bg-ink/10 py-5 font-display text-xl font-bold text-ink/50"
                >
                  Coming Soon
                </button>
              ) : (
                <button
                  onClick={() => add(product.slug, qty)}
                  className={`mt-6 w-full rounded-3xl py-5 font-display text-xl font-bold transition-transform active:translate-y-1 ${flavor.buttonClass}`}
                >
                  Add {qty} to Basket — {formatPKR(product.price * qty)}
                </button>
              )}

              <div className="mt-8 grid grid-cols-3 gap-3 text-center text-xs font-semibold text-ink/70">
                {[
                  { icon: <Truck className="size-5" />, label: "Free over Rs 500" },
                  { icon: <Leaf className="size-5" />, label: "Real veggies" },
                  { icon: <Sparkles className="size-5" />, label: "+ Sticker" },
                ].map((b) => (
                  <div key={b.label} className="rounded-2xl bg-white/80 p-3">
                    <div className={`mx-auto mb-1 grid size-9 place-items-center rounded-full ${flavor.buttonClass}`}>{b.icon}</div>
                    {b.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="px-6 pb-24">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-6 font-display text-3xl font-bold">More from {flavor.name}</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => <ProductCard key={p.slug} product={p} />)}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}