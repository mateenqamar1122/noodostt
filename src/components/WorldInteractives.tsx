import { useEffect, useMemo, useRef, useState } from "react";
import type { Flavor } from "@/lib/products";

type Props = { flavor: Flavor };

const HEAT_BY_FLAVOR: Record<string, number> = {
  chicken: 2,
  beef: 4,
  spicy: 9,
};

const INGREDIENTS: Record<string, { x: number; y: number; emoji: string; label: string; note: string }[]> = {
  chicken: [
    { x: 22, y: 30, emoji: "🌾", label: "Golden Wheat", note: "Slow-dried noodle strands" },
    { x: 65, y: 22, emoji: "🧄", label: "Roasted Garlic", note: "Sweet, mellow depth" },
    { x: 48, y: 60, emoji: "🐔", label: "Free-Range Broth", note: "Simmered 8 hours" },
    { x: 78, y: 70, emoji: "🌿", label: "Fresh Herbs", note: "Picked at sunrise" },
  ],
  beef: [
    { x: 28, y: 28, emoji: "🥩", label: "Ranch Beef", note: "Slow-braised, fall-apart tender" },
    { x: 70, y: 26, emoji: "🧅", label: "Caramel Onion", note: "Charred for smoke" },
    { x: 40, y: 65, emoji: "🌶️", label: "Black Pepper", note: "Cracked, not ground" },
    { x: 75, y: 68, emoji: "🍄", label: "Wild Mushroom", note: "Forest umami punch" },
  ],
  spicy: [
    { x: 25, y: 32, emoji: "🌶️", label: "Volcano Chili", note: "Hand-toasted for crunch heat" },
    { x: 68, y: 24, emoji: "🔥", label: "Lava Oil", note: "Triple chili infusion" },
    { x: 45, y: 62, emoji: "🧄", label: "Burnt Garlic", note: "Bittersweet rocket fuel" },
    { x: 78, y: 68, emoji: "🍋", label: "Bright Lime", note: "Cools the launchpad" },
  ],
};

export function SpiceMeter({ flavor }: Props) {
  const max = 10;
  const [heat, setHeat] = useState(HEAT_BY_FLAVOR[flavor.slug] ?? 5);
  const flames = "🔥".repeat(Math.max(1, Math.round(heat / 2)));
  const mood =
    heat <= 2 ? "Cozy snuggle" : heat <= 4 ? "Warm hug" : heat <= 6 ? "Tingle zone" : heat <= 8 ? "Sweat mode" : "ROCKET LAUNCH 🚀";

  return (
    <div className="rounded-[2.5rem] border-4 border-white bg-white/70 p-8 shadow-xl backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className={`font-display text-3xl font-bold ${flavor.textClass}`}>Spice-O-Meter</h3>
          <p className="text-sm text-ink/60">Slide it. Feel it. Imagine it.</p>
        </div>
        <div className="text-right">
          <div className="font-display text-5xl font-bold leading-none">{heat}</div>
          <div className="text-xs font-bold uppercase tracking-wider text-ink/50">/ {max}</div>
        </div>
      </div>

      <div className="mt-6 select-none text-4xl transition-transform duration-200" style={{ transform: `scale(${1 + heat * 0.04})` }}>
        {flames}
      </div>

      <input
        type="range"
        min={0}
        max={max}
        value={heat}
        onChange={(e) => setHeat(Number(e.target.value))}
        className="mt-4 w-full accent-current"
        style={{ color: `var(--color-${flavor.colorVar})` as string }}
        aria-label="Spice level"
      />

      <div className="mt-3 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-ink/50">
        <span>Mild</span>
        <span className={flavor.textClass}>{mood}</span>
        <span>Volcano</span>
      </div>
    </div>
  );
}

export function IngredientReveal({ flavor }: Props) {
  const items = INGREDIENTS[flavor.slug] ?? [];
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="rounded-[2.5rem] border-4 border-white bg-white/70 p-8 shadow-xl backdrop-blur">
      <h3 className={`font-display text-3xl font-bold ${flavor.textClass}`}>Inside the Bowl</h3>
      <p className="text-sm text-ink/60">Tap the glowing spots to meet the ingredients.</p>

      <div className="relative mt-6 overflow-hidden rounded-3xl">
        <img src={flavor.worldImg} alt="" className="h-72 w-full object-cover" />
        <div className="absolute inset-0 bg-ink/20" />
        {items.map((it, i) => (
          <button
            key={i}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive((cur) => (cur === i ? null : cur))}
            onClick={() => setActive(i)}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${it.x}%`, top: `${it.y}%` }}
            aria-label={it.label}
          >
            <span className="relative flex h-10 w-10 items-center justify-center">
              <span className="absolute inset-0 animate-ping rounded-full bg-white/70" />
              <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl shadow-lg transition-transform hover:scale-110">
                {it.emoji}
              </span>
            </span>
          </button>
        ))}

        {active !== null && (
          <div className="pointer-events-none absolute inset-x-4 bottom-4 rounded-2xl bg-white/95 px-4 py-3 shadow-xl animate-fade-in">
            <div className="font-display text-lg font-bold text-ink">
              {items[active].emoji} {items[active].label}
            </div>
            <div className="text-sm text-ink/70">{items[active].note}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export function PerfectCookGame({ flavor }: Props) {
  const TARGET_MS = 3000; // 3 minutes of cooking → 3 seconds of focus
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [result, setResult] = useState<number | null>(null);
  const [best, setBest] = useState<number | null>(null);
  const startedAt = useRef<number>(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(`cook-best-${flavor.slug}`);
    setBest(saved ? Number(saved) : null);
  }, [flavor.slug]);

  useEffect(() => {
    if (!running) return;
    const tick = () => {
      setElapsed(performance.now() - startedAt.current);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [running]);

  const start = () => {
    setResult(null);
    setElapsed(0);
    startedAt.current = performance.now();
    setRunning(true);
  };

  const stop = () => {
    if (!running) return;
    const final = performance.now() - startedAt.current;
    setRunning(false);
    setElapsed(final);
    const diff = Math.abs(final - TARGET_MS);
    setResult(diff);
    setBest((b) => {
      const nb = b === null ? diff : Math.min(b, diff);
      localStorage.setItem(`cook-best-${flavor.slug}`, String(nb));
      return nb;
    });
  };

  const handleClick = () => (running ? stop() : start());

  const seconds = (elapsed / 1000).toFixed(2);
  const pct = Math.min(100, (elapsed / TARGET_MS) * 100);
  const status = useMemo(() => {
    if (result === null) return running ? "Hit STOP at 3.00s" : "Cook the perfect bowl";
    if (result < 50) return "🏆 Perfect Chef!";
    if (result < 150) return "🥇 Master Cook";
    if (result < 400) return "🥈 Nicely done";
    if (result < 800) return "🥉 Almost there";
    return "🍜 Try again!";
  }, [result, running]);

  return (
    <div className="rounded-[2.5rem] border-4 border-white bg-white/70 p-8 shadow-xl backdrop-blur">
      <div className="flex items-center justify-between">
        <div>
          <h3 className={`font-display text-3xl font-bold ${flavor.textClass}`}>Perfect Cook</h3>
          <p className="text-sm text-ink/60">Stop the timer at exactly 3.00 seconds.</p>
        </div>
        <div className="text-right">
          <div className="text-xs font-bold uppercase tracking-wider text-ink/50">Best Δ</div>
          <div className="font-display text-2xl font-bold">
            {best === null ? "—" : `${(best / 1000).toFixed(2)}s`}
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3 text-center">
        <Stat label="Target" value="3.00s" />
        <Stat label="Timer" value={`${seconds}s`} />
        <Stat label="Status" value={status} small />
      </div>

      <button
        onClick={handleClick}
        className={`relative mt-6 flex h-56 w-full items-center justify-center overflow-hidden rounded-3xl ${flavor.bgClass} transition-transform active:scale-95`}
        aria-label={running ? "Stop the timer" : "Start cooking"}
      >
        <img
          src={flavor.characterImg}
          alt=""
          className={`h-40 ${running ? "animate-float-bowl" : ""}`}
        />
        <div className="pointer-events-none absolute inset-x-6 bottom-6">
          <div className="h-3 w-full overflow-hidden rounded-full bg-white/70 shadow-inner">
            <div
              className="h-full rounded-full transition-[width] duration-75"
              style={{ width: `${pct}%`, backgroundColor: `var(--color-${flavor.colorVar})` }}
            />
          </div>
          <div className="mt-2 text-center text-xs font-bold uppercase tracking-wider text-ink/70">
            {running ? "Cooking… tap to stop" : result !== null ? `Off by ${(result / 1000).toFixed(2)}s` : "Tap to start"}
          </div>
        </div>
      </button>

      <button
        onClick={handleClick}
        className={`mt-4 w-full rounded-2xl px-6 py-4 font-display text-lg font-bold ${flavor.buttonClass}`}
      >
        {running ? "Stop!" : result !== null ? "Cook again" : "Start cooking"}
      </button>
    </div>
  );
}

function Stat({ label, value, small }: { label: string; value: string | number; small?: boolean }) {
  return (
    <div className="rounded-2xl bg-white/80 px-3 py-3">
      <div className="text-[10px] font-bold uppercase tracking-wider text-ink/50">{label}</div>
      <div className={`font-display font-bold ${small ? "text-sm" : "text-2xl"}`}>{value}</div>
    </div>
  );
}