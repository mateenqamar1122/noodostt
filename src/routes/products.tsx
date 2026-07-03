import { createFileRoute, Link } from "@tanstack/react-router";
import { ProductCard } from "@/components/ProductCard";
import { PRODUCTS } from "@/lib/products";
import { ShoppingBag } from "lucide-react";
export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "All Products — Noodle World" },
      { name: "description", content: "Browse every NooDost flavour: Captain Chicken, Beef Boss, and Spicy Rocket. Family packs, single bowls, and limited drops." },
      { property: "og:title", content: "All Products — Noodle World" },
      { property: "og:description", content: "Browse every NooDost flavour." },
    ],
  }),
  component: ProductsPage,
});
function ProductsPage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <section className="relative overflow-hidden px-6 pb-16 pt-12 md:pt-20">
        <div className="absolute -left-32 top-20 -z-10 size-96 rounded-full bg-chicken/30 blur-3xl" />
        <div className="absolute -right-32 top-40 -z-10 size-96 rounded-full bg-spicy/20 blur-3xl" />
        <div className="mx-auto max-w-7xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-chicken-soft px-4 py-1 text-sm font-bold text-chicken-dark">
            <ShoppingBag className="size-4" /> THE FULL MENU
          </span>
          <h1 className="mt-6 font-display text-5xl font-bold leading-[0.95] tracking-tight text-ink md:text-6xl lg:text-7xl">
            Every <span className="text-chicken-dark">Bowl</span>.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-ink/70">
            From classic comfort to fiery adventures — every flavour world, every pack size, all in one place.
          </p>
        </div>
      </section>
      {/* Grid */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PRODUCTS.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
