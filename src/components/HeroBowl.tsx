import { useEffect, useRef } from "react";
import heroBowl from "@/assets/hero-bowl.png";

export function HeroBowl({ src = heroBowl, size = "lg" }: { src?: string; size?: "lg" | "md" }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handler = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) / r.width;
      const y = (e.clientY - (r.top + r.height / 2)) / r.height;
      el.style.setProperty("--rx", `${-y * 8}deg`);
      el.style.setProperty("--ry", `${x * 12}deg`);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  const dim = size === "lg" ? "size-[22rem] md:size-[30rem]" : "size-64 md:size-80";

  return (
    <div className={`relative ${dim} mx-auto`}>
      {/* Steam */}
      <div className="pointer-events-none absolute -top-8 left-1/2 z-10 flex -translate-x-1/2 gap-3">
        <span className="block h-16 w-2 rounded-full bg-white/70 blur-md animate-steam" style={{ animationDelay: "0s" }} />
        <span className="block h-20 w-2 rounded-full bg-white/70 blur-md animate-steam" style={{ animationDelay: "0.6s" }} />
        <span className="block h-14 w-2 rounded-full bg-white/70 blur-md animate-steam" style={{ animationDelay: "1.2s" }} />
      </div>

      {/* Background blobs */}
      <div className="absolute inset-0 -z-10 rounded-full bg-chicken/40 blur-3xl" />
      <div className="absolute -bottom-10 -right-10 -z-10 size-48 rounded-full bg-spicy/20 blur-2xl" />

      {/* Bowl */}
      <div
        ref={ref}
        className="animate-float-bowl"
        style={{
          transform: "perspective(900px) rotateX(var(--rx,0)) rotateY(var(--ry,0))",
          transition: "transform 0.2s ease-out",
        }}
      >
        <img
          src={src}
          alt="A premium golden bowl of noodles with egg and green onions"
          width={1024}
          height={1024}
          className="size-full object-contain cartoon-shadow"
        />
      </div>

      {/* Orbiting ingredient chips */}
      <Chip className="-top-2 -right-2 bg-white text-chicken-dark" delay="0s">🌽 Sweet Corn</Chip>
      <Chip className="bottom-10 -left-8 bg-white text-beef" delay="1.2s">🥩 Real Beef</Chip>
      <Chip className="-bottom-4 right-6 bg-white text-spicy" delay="2s">🌶️ Spicy Kick</Chip>
    </div>
  );
}

function Chip({ children, className = "", delay = "0s" }: { children: React.ReactNode; className?: string; delay?: string }) {
  return (
    <span
      className={`absolute rounded-full border-2 border-white px-4 py-2 text-xs font-bold shadow-xl animate-float-bowl ${className}`}
      style={{ animationDelay: delay }}
    >
      {children}
    </span>
  );
}
