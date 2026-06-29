import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useCart, cartLine, cartTotals } from "@/lib/cart-store";
import { formatPKR } from "@/lib/format";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Noodle World" }, { name: "description", content: "Complete your noodle adventure." }] }),
  component: Checkout,
  errorComponent: ({ error }) => <div className="p-12 text-center">{error.message}</div>,
});

function Checkout() {
  const navigate = useNavigate();
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  const { subtotal, shipping, total, count } = cartTotals(items);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name") || "Slurper");
    setSubmitting(true);
    setTimeout(() => {
      clear();
      navigate({ to: "/order-confirmation", search: { name, total: String(Math.round(total)) } });
    }, 700);
  };

  if (count === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <div className="mb-4 text-6xl animate-wiggle">🍜</div>
        <h1 className="font-display text-4xl font-bold">Your basket is empty</h1>
        <p className="mt-2 text-ink/60">Add some bowls before checking out.</p>
        <Link to="/" className="mt-6 inline-block rounded-full bg-chicken-dark px-6 py-3 font-display font-bold text-white">Pick a flavor</Link>
      </div>
    );
  }

  return (
    <div className="px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <Link to="/" className="text-sm font-bold text-ink/50 hover:text-ink">← Keep shopping</Link>
        <h1 className="mt-3 font-display text-5xl font-bold">Checkout <span className="text-chicken-dark">🥢</span></h1>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_400px]">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8 rounded-[2rem] border-4 border-white bg-white p-8 shadow-lg">
            <Fieldset title="Where to send it?">
              <Input name="name" label="Full name" required />
              <Input name="email" label="Email" type="email" required />
              <Input name="address" label="Street address" required />
              <div className="grid gap-4 sm:grid-cols-2">
                <Input name="city" label="City" required />
                <Input name="zip" label="ZIP" required />
              </div>
            </Fieldset>

            <Fieldset title="How to pay?">
              <Input name="card" label="Card number" placeholder="4242 4242 4242 4242" required />
              <div className="grid gap-4 sm:grid-cols-2">
                <Input name="exp" label="Expiry" placeholder="MM/YY" required />
                <Input name="cvc" label="CVC" placeholder="123" required />
              </div>
            </Fieldset>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-3xl bg-chicken-dark py-5 font-display text-xl font-bold text-white chunky-shadow-ink transition-transform active:translate-y-1 disabled:opacity-60"
            >
              {submitting ? "Cooking your order…" : `Place Order — ${formatPKR(total)}`}
            </button>
          </form>

          {/* Summary */}
          <aside className="space-y-4 self-start rounded-[2rem] border-4 border-chicken-soft bg-chicken-soft/50 p-6">
            <h2 className="font-display text-2xl font-bold">Your Basket</h2>
            <ul className="space-y-3">
              {items.map((item) => {
                const { product, subtotal } = cartLine(item);
                if (!product) return null;
                return (
                  <li key={item.slug} className="flex gap-3">
                    <img src={product.image} alt={product.name} className="size-14 rounded-xl bg-white object-contain" />
                    <div className="flex-1 text-sm">
                      <p className="font-bold">{product.name}</p>
                      <p className="text-ink/60">× {item.qty}</p>
                    </div>
                    <span className="font-display font-bold">{formatPKR(subtotal)}</span>
                  </li>
                );
              })}
            </ul>
            <div className="border-t-2 border-white pt-3 text-sm text-ink/70">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatPKR(subtotal)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{formatPKR(shipping)}</span></div>
            </div>
            <div className="flex justify-between font-display text-xl font-bold">
              <span>Total</span><span className="text-chicken-dark">{formatPKR(total)}</span>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Fieldset({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-4 font-display text-xl font-bold">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Input({ label, name, type = "text", required, placeholder }: { label: string; name: string; type?: string; required?: boolean; placeholder?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-ink/60">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-2xl border-2 border-chicken-soft bg-cream px-4 py-3 font-medium focus:border-chicken focus:outline-none focus:ring-4 focus:ring-chicken/30"
      />
    </label>
  );
}