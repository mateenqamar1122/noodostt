import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import heroBowl from "@/assets/hero-bowl.png";
import { formatPKR } from "@/lib/format";

const searchSchema = z.object({
  name: z.string().optional().default("Slurper"),
  total: z.string().optional().default("0.00"),
});

export const Route = createFileRoute("/order-confirmation")({
  validateSearch: searchSchema,
  head: () => ({ meta: [{ title: "Order confirmed — Noodle World" }] }),
  component: Confirmation,
});

function Confirmation() {
  const { name, total } = Route.useSearch();
  return (
    <div className="relative overflow-hidden">
      {/* Confetti background blobs */}
      <div className="absolute -left-20 top-20 -z-10 size-72 rounded-full bg-chicken/30 blur-3xl" />
      <div className="absolute right-0 top-40 -z-10 size-72 rounded-full bg-spicy/20 blur-3xl" />
      <div className="absolute bottom-20 left-1/2 -z-10 size-96 rounded-full bg-beef/15 blur-3xl" />

      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <div className="mx-auto mb-6 size-64 animate-float-bowl">
          <img src={heroBowl} alt="Celebration bowl" width={1024} height={1024} className="size-full object-contain cartoon-shadow" />
        </div>
        <span className="rounded-full bg-chicken/30 px-4 py-1 text-sm font-bold text-chicken-dark animate-pop-in">ORDER CONFIRMED!</span>
        <h1 className="mt-4 font-display text-6xl font-bold leading-none">
          Slurp on, <br /> <span className="text-chicken-dark">{name}!</span>
        </h1>
        <p className="mx-auto mt-6 max-w-md text-lg text-ink/70">
          Your noodle adventure is officially packed and ready to fly. We just charged <strong>{formatPKR(Number(total))}</strong> — your bowls will arrive in 2-3 days with a free collectible sticker.
        </p>

        <div className="mt-10 grid gap-3 rounded-[2rem] border-4 border-white bg-white p-6 text-left shadow-lg sm:grid-cols-3">
          {[
            { label: "Step 1", title: "We're cooking", emoji: "👨‍🍳" },
            { label: "Step 2", title: "Rocket shipping", emoji: "🚀" },
            { label: "Step 3", title: "Slurp time!", emoji: "🍜" },
          ].map((s, i) => (
            <div key={s.title} className="rounded-2xl bg-chicken-soft p-4 text-center animate-pop-in" style={{ animationDelay: `${i * 0.15}s` }}>
              <div className="text-3xl">{s.emoji}</div>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-ink/50">{s.label}</p>
              <p className="font-display font-bold">{s.title}</p>
            </div>
          ))}
        </div>

        <Link to="/" className="mt-10 inline-block rounded-3xl bg-chicken-dark px-8 py-4 font-display text-lg font-bold text-white chunky-shadow-ink active:translate-y-1">
          Back to Noodle World
        </Link>
      </div>
    </div>
  );
}