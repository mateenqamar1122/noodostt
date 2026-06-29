import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { FLAVORS, getProductsByFlavor, type FlavorSlug } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { HeroBowl } from "@/components/HeroBowl";
import { SpiceMeter, IngredientReveal, PerfectCookGame } from "@/components/WorldInteractives";

export const Route = createFileRoute("/world/$slug")({
  head: ({ params }) => {
    const f = FLAVORS[params.slug as FlavorSlug];
    if (!f) return { meta: [{ title: "World not found — Noodle World" }] };
    return {
      meta: [
        { title: `${f.name} — ${f.tagline} | Noodle World` },
        { name: "description", content: f.description },
        { property: "og:title", content: `${f.name} — Noodle World` },
        { property: "og:description", content: f.description },
        { property: "og:image", content: f.worldImg },
      ],
    };
  },
  loader: ({ params }) => {
    const flavor = FLAVORS[params.slug as FlavorSlug];
    if (!flavor) throw notFound();
    return { flavor };
  },
  notFoundComponent: () => (
    <div className="px-6 py-32 text-center">
      <h1 className="font-display text-4xl font-bold">World not found</h1>
      <Link to="/" className="mt-4 inline-block text-chicken-dark underline">Back home</Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="px-6 py-32 text-center">
      <h1 className="font-display text-4xl font-bold">Oh noodles!</h1>
      <p className="mt-2 text-ink/60">{error.message}</p>
    </div>
  ),
  component: WorldPage,
});

function WorldPage() {
  const { flavor } = Route.useLoaderData();
  const products = getProductsByFlavor(flavor.slug);

  const accent = flavor.slug === "chicken" ? "bg-chicken" : flavor.slug === "beef" ? "bg-beef" : "bg-spicy";

  return (
    <div className={`${flavor.bgClass}`}>
      {/* Hero scene */}
      <section className="relative overflow-hidden px-6 pb-20 pt-12">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div className="relative order-2 lg:order-1">
            <div className="relative overflow-hidden rounded-[3rem] border-4 border-white shadow-2xl">
              <img src={flavor.worldImg} alt={`${flavor.name} world scene`} width={1280} height={1024} className="w-full object-cover" />
              <img src={flavor.characterImg} alt={flavor.name} className="absolute -bottom-6 -right-6 w-1/2 drop-shadow-2xl animate-float-bowl" />
            </div>
          </div>
          <div className="order-1 text-center lg:order-2 lg:text-left">
            <Link to="/" className="text-sm font-bold text-ink/50 hover:text-ink">← Back to all worlds</Link>
            <span className={`mt-4 inline-block rounded-full bg-white px-4 py-1 text-sm font-bold ${flavor.textClass}`}>
              {flavor.world}
            </span>
            <h1 className={`mt-4 font-display text-6xl font-bold leading-none md:text-7xl ${flavor.textClass}`}>
              {flavor.name}
            </h1>
            <p className="mt-6 max-w-md text-lg text-ink/70 lg:mx-0">{flavor.description}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start">
              <a href="#products" className={`rounded-3xl px-8 py-4 font-display text-lg font-bold ${flavor.buttonClass}`}>
                Shop {flavor.name}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Featured bowl */}
      <section className="relative px-6 py-16">
        <div className={`mx-auto max-w-4xl rounded-[3rem] ${accent} p-12 text-center text-white shadow-2xl`}>
          <h2 className="font-display text-4xl font-bold">The Signature Bowl</h2>
          <p className="mx-auto mt-2 max-w-md text-white/80">Hover, tilt, and slurp. Your taste buds will thank you.</p>
          <div className="mt-8">
            <HeroBowl size="md" src={flavor.characterImg} />
          </div>
        </div>
      </section>

      {/* Interactive playground */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 text-center">
            <span className={`inline-block rounded-full bg-white px-4 py-1 text-xs font-bold uppercase tracking-wider ${flavor.textClass}`}>
              Play with your food
            </span>
            <h2 className={`mt-3 font-display text-4xl font-bold ${flavor.textClass}`}>The {flavor.name} Playground</h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <SpiceMeter flavor={flavor} />
            <IngredientReveal flavor={flavor} />
            <PerfectCookGame flavor={flavor} />
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="px-6 pb-24">
        <div className="mx-auto max-w-7xl">
          <h2 className={`mb-8 font-display text-4xl font-bold ${flavor.textClass}`}>All {flavor.name} bowls</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => <ProductCard key={p.slug} product={p} />)}
          </div>
        </div>
      </section>
    </div>
  );
}