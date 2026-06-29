import { Link } from "@tanstack/react-router";
import type { Flavor } from "@/lib/products";

export function FlavorWorldCard({ flavor, index }: { flavor: Flavor; index: number }) {
  const offset = index === 1 ? "md:translate-y-10" : "";
  return (
    <Link
      to="/world/$slug"
      params={{ slug: flavor.slug }}
      className={`group relative block overflow-hidden rounded-[3rem] border-4 border-white p-6 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl ${flavor.bgClass} ${offset}`}
    >
      {/* Scene */}
      <div className="relative mb-6 aspect-[5/4] overflow-hidden rounded-[2rem] border-2 border-white/60">
        <img
          src={flavor.worldImg}
          alt={`${flavor.name} world`}
          loading="lazy"
          width={1280}
          height={1024}
          className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <img
          src={flavor.characterImg}
          alt={`${flavor.name} character`}
          loading="lazy"
          width={400}
          height={400}
          className="absolute -bottom-4 -right-2 w-[55%] object-contain drop-shadow-2xl transition-transform duration-500 group-hover:-translate-y-2 group-hover:rotate-3"
        />
      </div>
      <span className={`mb-2 inline-block rounded-full bg-white/80 px-3 py-1 text-xs font-bold ${flavor.textClass}`}>
        {flavor.world}
      </span>
      <h3 className={`font-display text-3xl font-bold ${flavor.textClass}`}>{flavor.name}</h3>
      <p className="mb-6 mt-2 text-sm text-ink/70">{flavor.description}</p>
      <span className={`inline-flex items-center justify-center rounded-2xl px-5 py-3 font-display font-bold transition-transform group-hover:translate-x-1 ${flavor.buttonClass}`}>
        {flavor.cta} →
      </span>

      {/* Corner bubble */}
      <span className="absolute -bottom-6 -right-6 size-32 rounded-full bg-white/20 transition-transform duration-500 group-hover:scale-150" />
    </Link>
  );
}