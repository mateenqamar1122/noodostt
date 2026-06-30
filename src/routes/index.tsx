import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { HeroBowl } from "@/components/HeroBowl";
import { FlavorWorldCard } from "@/components/FlavorWorldCard";
import { ProductCard } from "@/components/ProductCard";
import { FLAVOR_LIST, PRODUCTS } from "@/lib/products";
import { Zap, Leaf, Sparkles, Star } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Noodle World — Slurp Into Magic" },
      { name: "description", content: "Premium cartoon noodles for kids and families. Three flavor worlds: Captain Chicken, Beef Boss, Spicy Rocket." },
      { property: "og:title", content: "Noodle World — Slurp Into Magic" },
      { property: "og:description", content: "Three flavor worlds, one slurpable adventure." },
    ],
  }),
  component: Index,
});

function Index() {
  const featured = PRODUCTS.filter((p) => p.badge);
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden px-6 pb-20 pt-12 md:pt-20">
        <div className="absolute -left-32 top-20 -z-10 size-96 rounded-full bg-chicken/30 blur-3xl" />
        <div className="absolute -right-32 top-40 -z-10 size-96 rounded-full bg-spicy/20 blur-3xl" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <span className="inline-block rounded-full bg-chicken/30 px-4 py-1 text-sm font-bold text-chicken-dark animate-pop-in">
              🌟 New Adventure Awaits
            </span>
            <h1 className="mt-6 font-display text-6xl font-bold leading-[0.95] tracking-tight text-ink md:text-7xl lg:text-8xl">
              Enjoy exciting Flavors <br />
              <span className="text-chicken-dark">with Noodost</span>
              <span className="inline-block animate-wiggle">.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-md text-lg text-ink/70 lg:mx-0">
              Premium noodles for tiny adventurers and family-sized appetites. Three flavor worlds, real ingredients, zero boring bits.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start">
              <a
                href="#flavors"
                className="rounded-3xl bg-chicken-dark px-8 py-4 font-display text-lg font-bold text-white chunky-shadow-ink transition-transform active:translate-y-1"
              >
                Pick a Flavor
              </a>
              <a
                href="#featured"
                className="rounded-3xl border-4 border-ink bg-white px-8 py-4 font-display text-lg font-bold text-ink transition-transform hover:-rotate-2"
              >
                Shop Bowls
              </a>
            </div>
            <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm font-semibold text-ink/60 lg:justify-start">
              <span className="flex items-center gap-2"><Star className="size-4 fill-chicken text-chicken" /> 4.9 / 50k families</span>
              <span className="flex items-center gap-2"><Leaf className="size-4 text-chicken-dark" /> Real veggies inside</span>
              <span className="flex items-center gap-2"><Zap className="size-4 text-spicy" /> Ready in 3 min</span>
            </div>
          </div>
          <HeroBowl />
        </div>
      </section>

      {/* Marquee */}
      <div className="overflow-hidden border-y-4 border-ink bg-spicy py-4 text-white">
        <div className="flex w-max gap-12 whitespace-nowrap animate-marquee">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex shrink-0 gap-12">
              {["🍜 FREE STICKERS IN EVERY BOX", "✨ NEW SPICY CHICKEN FLAVOUR", "🚚 FREE SHIPPING OVER RS 500", "🌽 REAL VEGGIES, NO MSG", "🍳 READY IN 3 MINUTES"].map((t) => (
                <span key={t} className="font-display text-xl font-bold tracking-wide">{t}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* FLAVOR WORLDS */}
      <section id="flavors" className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <span className="rounded-full bg-beef-soft px-4 py-1 text-sm font-bold text-beef">CHOOSE YOUR WORLD</span>
            <h2 className="mt-4 font-display text-5xl font-bold md:text-6xl">
              Three Flavors. <br className="md:hidden" /> Three <span className="text-chicken-dark">Adventures</span>.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-ink/60">Each world has its own characters, scenery, and slurpable surprises.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {FLAVOR_LIST.map((f, i) => (
              <FlavorWorldCard key={f.slug} flavor={f} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section id="featured" className="bg-white px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className="rounded-full bg-chicken-soft px-4 py-1 text-sm font-bold text-chicken-dark">THE DAILY SLURP</span>
              <h2 className="mt-3 font-display text-5xl font-bold">Featured Bowls</h2>
            </div>
            <Link to="/world/$slug" params={{ slug: "chicken" }} className="font-display font-bold text-chicken-dark underline decoration-chicken decoration-4 underline-offset-4">
              See all products →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* WHY KIDS LOVE */}
      <section id="why" className="relative overflow-hidden bg-chicken px-6 py-24">
        <div className="absolute -left-20 top-20 size-72 rounded-full bg-chicken-dark/20 blur-3xl" />
        <div className="mx-auto grid max-w-7xl items-center gap-16 md:grid-cols-2">
          <div className="relative">
            <div className="relative mx-auto grid size-80 place-items-center rounded-full bg-white/30 backdrop-blur md:size-96">
              <HeroBowl size="md" />
            </div>
          </div>
          <div className="text-ink">
            <h2 className="mb-8 font-display text-5xl font-bold leading-tight md:text-6xl">
              Why Kids <br /> (and Parents) <br /> <span className="text-white">Love Us</span>
            </h2>
            <div className="space-y-5">
              {[
                { icon: <Zap className="size-6" />, title: "Ready in 3 minutes", body: "Faster than a rocket launch. Perfect for hangry explorers." },
                { icon: <Leaf className="size-6" />, title: "Hidden veggie power", body: "Delicious flavors that secretly pack real broccoli, corn & carrots." },
                { icon: <Sparkles className="size-6" />, title: "Collectible stickers", body: "Every pack ships with a world-builder sticker to trade and stick." },
              ].map((f) => (
                <div key={f.title} className="flex gap-4 rounded-3xl bg-white/80 p-5 backdrop-blur transition-transform hover:-translate-y-1">
                  <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-chicken-dark text-white">{f.icon}</div>
                  <div>
                    <h4 className="font-display text-xl font-bold">{f.title}</h4>
                    <p className="text-sm text-ink/70">{f.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <span className="rounded-full bg-spicy/15 px-4 py-1 text-sm font-bold text-spicy">SLURP REPORTS</span>
            <h2 className="mt-3 font-display text-5xl font-bold">Loved by Families</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { name: "Mia, age 8", quote: "Captain Chicken is my BEST friend. I want him in every meal!", color: "chicken", emoji: "🐔" },
              { name: "Jake & Dad", quote: "Beef Boss tastes like Sunday dinner but ready before homework's done.", color: "beef", emoji: "🐮" },
              { name: "Sam, age 12", quote: "Spicy Rocket = level 100 noodles. Took the heat challenge twice!", color: "spicy", emoji: "🌶️" },
            ].map((r) => (
              <div key={r.name} className="rounded-[2rem] border-4 border-white bg-white p-6 shadow-[0_10px_30px_-15px_rgba(120,60,0,0.25)]">
                <div className="mb-3 flex text-chicken">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="size-5 fill-current" />)}</div>
                <p className="mb-6 font-display text-lg leading-snug">"{r.quote}"</p>
                <div className="flex items-center gap-3">
                  <span className={`grid size-12 place-items-center rounded-full text-2xl ${r.color === "chicken" ? "bg-chicken-soft" : r.color === "beef" ? "bg-beef-soft" : "bg-spicy-soft"}`}>{r.emoji}</span>
                  <span className="font-bold text-ink/70">{r.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROMO CTA */}
      <section className="px-6 pb-24">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[3rem] bg-beef-dark p-12 text-center shadow-2xl md:p-16">
          <div className="absolute -left-10 -top-10 size-60 rounded-full bg-spicy/30 blur-3xl" />
          <div className="absolute -right-10 -bottom-10 size-60 rounded-full bg-chicken/30 blur-3xl" />
          <span className="relative inline-block rounded-full bg-white/15 px-4 py-1 text-sm font-bold text-chicken">JOIN THE CLUB</span>
          <h2 className="relative mt-4 font-display text-5xl font-bold text-white md:text-6xl">
            Get 20% off your <br /> first <span className="text-chicken">Adventure Box</span>
          </h2>
          <p className="relative mx-auto mt-4 max-w-md text-white/70">Plus a free collectible sticker pack and exclusive access to new flavor worlds.</p>
          <form onSubmit={(e) => e.preventDefault()} className="relative mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 rounded-full bg-white px-6 py-4 text-ink focus:outline-none"
            />
            <button className="rounded-full bg-chicken px-8 py-4 font-display text-lg font-bold text-ink chunky-shadow-chicken active:translate-y-1">
              Join Quest
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
