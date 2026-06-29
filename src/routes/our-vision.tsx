import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Package, ShieldCheck, Eye, Factory, Globe, ChefHat, Sparkles } from "lucide-react";

export const Route = createFileRoute("/our-vision")({
  head: () => ({
    meta: [
      { title: "Our Vision — Noodle World" },
      { name: "description", content: "Discover the story behind Noodle World. Dong Da Trading is committed to delivering premium instant noodles across Pakistan." },
      { property: "og:title", content: "Our Vision — Noodle World" },
      { property: "og:description", content: "Discover the story behind Noodle World." },
    ],
  }),
  component: OurVisionPage,
});

function OurVisionPage() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden px-6 pb-20 pt-16 md:pt-24">
        <div className="absolute -left-32 top-20 -z-10 size-96 rounded-full bg-chicken/25 blur-3xl" />
        <div className="absolute -right-32 top-40 -z-10 size-96 rounded-full bg-beef/15 blur-3xl" />
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-block rounded-full bg-chicken/30 px-4 py-1 text-sm font-bold text-chicken-dark animate-pop-in">
            <Factory className="mr-1 inline size-4" />
            Our Story
          </span>
          <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight text-ink md:text-7xl">
            Crafted With Care, <br />
            <span className="text-chicken-dark">Served With Joy</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink/70">
            Behind every bowl of Noodle World is Dong Da Trading (Pvt.) Ltd. — a team blending authentic Chinese expertise with the vibrant tastes of Pakistan.
          </p>
        </div>
      </section>

      {/* ABOUT */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="relative">
              <div className="rounded-[2.5rem] border-4 border-white bg-chicken-soft p-8 md:p-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="grid size-12 place-items-center rounded-2xl bg-chicken text-ink">
                    <Factory className="size-6" />
                  </div>
                  <h2 className="font-display text-3xl font-bold text-ink md:text-4xl">Who We Are</h2>
                </div>
                <p className="text-ink/80 leading-relaxed">
                  Dong Da Trading (Pvt.) Ltd. is a Chinese-owned food manufacturing company operating in Pakistan with its production facility located in the Karachi Industrial Area. Since establishing operations in Pakistan over two years ago, the company has been committed to delivering high-quality instant noodles that combine authentic Chinese expertise with flavors specially developed for the Pakistani market.
                </p>
              </div>
              <div className="absolute -bottom-6 -right-6 -z-10 size-40 rounded-full bg-chicken/20 blur-2xl" />
            </div>
            <div className="relative">
              <div className="rounded-[2.5rem] border-4 border-white bg-beef-soft p-8 md:p-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="grid size-12 place-items-center rounded-2xl bg-beef text-white">
                    <ChefHat className="size-6" />
                  </div>
                  <h2 className="font-display text-3xl font-bold text-ink md:text-4xl">Our Mission</h2>
                </div>
                <p className="text-ink/80 leading-relaxed">
                  Our mission is to provide consumers with premium-quality products that offer exceptional taste, hygienic production, and outstanding value. By blending advanced Chinese manufacturing standards with local consumer preferences, we have created a product that reflects the best of both cultures.
                </p>
              </div>
              <div className="absolute -top-6 -left-6 -z-10 size-40 rounded-full bg-beef/15 blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* PRESENCE */}
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <span className="inline-block rounded-full bg-spicy/15 px-4 py-1 text-sm font-bold text-spicy">
              <Globe className="mr-1 inline size-4" />
              Our Presence
            </span>
            <h2 className="mt-4 font-display text-4xl font-bold md:text-5xl">Growing Across Pakistan</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { city: "Karachi", detail: "Our home base and production hub. Products are widely available across the city.", color: "bg-chicken-soft", icon: <MapPin className="size-6 text-chicken-dark" /> },
              { city: "Sindh", detail: "Expanding our professional sales operations throughout the Sindh region.", color: "bg-beef-soft", icon: <MapPin className="size-6 text-beef" /> },
              { city: "Punjab", detail: "Active distribution network strengthening availability in every major market.", color: "bg-spicy-soft", icon: <MapPin className="size-6 text-spicy" /> },
            ].map((loc) => (
              <div key={loc.city} className="rounded-[2rem] border-4 border-white p-8 shadow-[0_10px_30px_-15px_rgba(120,60,0,0.2)] transition-transform hover:-translate-y-1">
                <div className={`mb-4 grid size-14 place-items-center rounded-2xl ${loc.color}`}>
                  {loc.icon}
                </div>
                <h3 className="mb-2 font-display text-2xl font-bold">{loc.city}</h3>
                <p className="text-sm leading-relaxed text-ink/70">{loc.detail}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-ink/60">
            We continue to expand our distribution network into new cities and regions throughout Pakistan.
          </p>
        </div>
      </section>

      {/* PRODUCTS & FLAVORS */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <span className="inline-block rounded-full bg-chicken/30 px-4 py-1 text-sm font-bold text-chicken-dark">
              <Package className="mr-1 inline size-4" />
              Our Products
            </span>
            <h2 className="mt-4 font-display text-4xl font-bold md:text-5xl">Flavors for Every Explorer</h2>
            <p className="mx-auto mt-3 max-w-xl text-ink/60">
              Our flagship brand offers delicious, high-quality instant noodles in a unique 80g premium pack, specially designed to deliver the perfect serving size while maintaining excellent quality.
            </p>
          </div>

          <div className="mb-10">
            <h3 className="mb-6 text-center font-display text-2xl font-bold text-ink">Current Favorites</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {["Spicy Chicken", "Spicy Beef"].map((flavor) => (
                <div key={flavor} className="flex items-center gap-3 rounded-full border-4 border-chicken bg-white px-6 py-3 font-display text-lg font-bold text-ink shadow-[0_6px_0_0_var(--chicken-dark)]">
                  <Sparkles className="size-5 text-chicken-dark" />
                  {flavor}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-6 text-center font-display text-2xl font-bold text-ink">Coming Soon</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {["2X Spicy", "Chicken Noodles", "Beef Noodles", "Chatpata"].map((flavor) => (
                <div key={flavor} className="flex items-center gap-3 rounded-full border-4 border-beef bg-white px-6 py-3 font-display text-lg font-bold text-ink shadow-[0_6px_0_0_var(--beef-dark)]">
                  <Sparkles className="size-5 text-beef" />
                  {flavor}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* QUALITY COMMITMENT */}
      <section className="relative overflow-hidden bg-beef-dark px-6 py-20 text-white">
        <div className="absolute -left-20 top-20 size-72 rounded-full bg-spicy/30 blur-3xl" />
        <div className="absolute -right-20 bottom-20 size-72 rounded-full bg-chicken/20 blur-3xl" />
        <div className="relative mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <span className="inline-block rounded-full bg-white/15 px-4 py-1 text-sm font-bold">
              <ShieldCheck className="mr-1 inline size-4" />
              Quality Commitment
            </span>
            <h2 className="mt-4 font-display text-4xl font-bold md:text-5xl">Premium in Every Pack</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-[2rem] bg-white/10 p-8 backdrop-blur-sm">
              <div className="mb-4 grid size-14 place-items-center rounded-2xl bg-chicken text-ink">
                <Globe className="size-6" />
              </div>
              <h3 className="mb-2 font-display text-xl font-bold">Global Ingredients</h3>
              <p className="text-white/80 leading-relaxed">
                We import our specialized seasoning blends and packaging materials from carefully selected international suppliers. This enables us to deliver authentic flavor, superior freshness, and consistent product quality in every bowl.
              </p>
            </div>
            <div className="rounded-[2rem] bg-white/10 p-8 backdrop-blur-sm">
              <div className="mb-4 grid size-14 place-items-center rounded-2xl bg-spicy text-white">
                <ShieldCheck className="size-6" />
              </div>
              <h3 className="mb-2 font-display text-xl font-bold">Hygienic Production</h3>
              <p className="text-white/80 leading-relaxed">
                Our manufacturing processes follow strict hygiene and quality control standards, ensuring that every pack is produced in a safe, clean, and modern production environment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VISION STATEMENT */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <div className="relative rounded-[3rem] border-4 border-chicken bg-chicken-soft p-10 md:p-16">
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 grid size-16 place-items-center rounded-full bg-chicken-dark text-white shadow-lg">
              <Eye className="size-8" />
            </div>
            <h2 className="mt-6 font-display text-4xl font-bold text-ink md:text-5xl">Our Vision</h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink/80">
              Our vision is to become one of Pakistan&apos;s most trusted instant noodle brands by continuously expanding our nationwide distribution network, introducing innovative flavors, and providing consumers with delicious, hygienic, and affordable products.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <span className="rounded-full bg-white px-5 py-2 text-sm font-bold text-chicken-dark shadow-sm">Nationwide Reach</span>
              <span className="rounded-full bg-white px-5 py-2 text-sm font-bold text-beef shadow-sm">Innovative Flavors</span>
              <span className="rounded-full bg-white px-5 py-2 text-sm font-bold text-spicy shadow-sm">Trusted Quality</span>
            </div>
          </div>
          <p className="mx-auto mt-10 max-w-2xl text-ink/60">
            At Dong Da Trading (Pvt.) Ltd., we believe that great taste, premium quality, and customer satisfaction are the foundation of long-term success. As we continue to grow across Pakistan, we remain committed to excellence in every pack we produce.
          </p>
        </div>
      </section>
    </div>
  );
}
