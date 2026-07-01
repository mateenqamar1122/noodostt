import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Phone, Mail, Briefcase, Package, Send, Building2, Sparkles } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import dongdaBuilding from "@/assets/dongda-building.png";
import { supabase } from "@/integrations/supabase/client";

const db = supabase as unknown as {
  from: (t: string) => { insert: (v: Record<string, unknown>) => Promise<{ error: { message: string } | null }> };
};

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — Noodle World Business Inquiries" },
      { name: "description", content: "Get in touch with Noodle World for bulk orders, distribution, and business inquiries across Pakistan." },
      { property: "og:title", content: "Contact Us — Noodle World" },
      { property: "og:description", content: "Bulk orders & business inquiries. Reach our team in Karachi, Pakistan." },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  company: z.string().trim().max(120).optional(),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().min(7, "Phone is required").max(30),
  inquiryType: z.enum(["bulk", "distribution", "retail", "other"]),
  quantity: z.string().trim().max(50).optional(),
  message: z.string().trim().min(10, "Tell us a bit more").max(1500),
});

const PHONES = [
  { label: "Sales", number: "+92 311 2606778", href: "tel:+923112606778" },
  { label: "Bulk Orders", number: "+92 301 9512876", href: "tel:+923019512876" },
  { label: "Support", number: "0311-7866773", href: "tel:+923117866773" },
];

function ContactPage() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => { errs[i.path[0] as string] = i.message; });
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);
    const { error } = await db.from("business_inquiries").insert({
      name: parsed.data.name,
      company: parsed.data.company ?? null,
      email: parsed.data.email,
      phone: parsed.data.phone,
      inquiry_type: parsed.data.inquiryType,
      quantity: parsed.data.quantity ?? null,
      message: parsed.data.message,
    });
    setSubmitting(false);
    if (error) { setErrors({ message: "Could not send: " + error.message }); return; }
    setSent(true);
    (e.target as HTMLFormElement).reset();
  }

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden px-6 pb-16 pt-16 md:pt-24">
        <div className="absolute -left-32 top-20 -z-10 size-96 rounded-full bg-chicken/25 blur-3xl" />
        <div className="absolute -right-32 top-40 -z-10 size-96 rounded-full bg-spicy/15 blur-3xl" />
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-block rounded-full bg-chicken/30 px-4 py-1 text-sm font-bold text-chicken-dark animate-pop-in">
            <Briefcase className="mr-1 inline size-4" />
            Business Inquiries
          </span>
          <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight text-ink md:text-7xl">
            Let's Talk <span className="text-chicken-dark">Bulk & Business</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink/70">
            Wholesale, distribution, retail partnerships and corporate orders — our team in Karachi is ready to slurp into business with you.
          </p>
        </div>
      </section>

      {/* CONTACT INFO + FORM */}
      <section className="px-6 pb-24">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-5">
          {/* INFO */}
          <div className="lg:col-span-2 space-y-5">
            <div className="rounded-3xl border-4 border-chicken-soft bg-white p-6 shadow-[0_8px_30px_-12px_rgba(120,60,0,0.25)]">
              <div className="mb-3 flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-full bg-chicken/30 text-chicken-dark"><MapPin className="size-5" /></span>
                <h3 className="font-display text-xl font-bold">Head Office</h3>
              </div>
              <p className="text-ink/70 leading-relaxed">
                Plot# 351/4, 4th Floor,<br />Korangi Creek, DHA Korangi,<br />Karachi, Pakistan
              </p>
            </div>

            <div className="rounded-3xl border-4 border-chicken-soft bg-white p-6 shadow-[0_8px_30px_-12px_rgba(120,60,0,0.25)]">
              <div className="mb-3 flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-full bg-spicy/20 text-spicy"><Phone className="size-5" /></span>
                <h3 className="font-display text-xl font-bold">Call Us</h3>
              </div>
              <ul className="space-y-2">
                {PHONES.map((p) => (
                  <li key={p.number} className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-ink/60">{p.label}</span>
                    <a href={p.href} className="font-display font-bold text-ink hover:text-chicken-dark">{p.number}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border-4 border-chicken-soft bg-white p-6 shadow-[0_8px_30px_-12px_rgba(120,60,0,0.25)]">
              <div className="mb-3 flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-full bg-beef/20 text-beef"><Mail className="size-5" /></span>
                <h3 className="font-display text-xl font-bold">Email</h3>
              </div>
              <a href="mailto:z534769076@gmail.com" className="font-display font-bold text-ink hover:text-chicken-dark">
                z534769076@gmail.com
              </a>
              <p className="mt-2 text-sm text-ink/60">We reply to business inquiries within 1 business day.</p>
            </div>

            <div className="rounded-3xl bg-ink p-6 text-white">
              <div className="mb-2 flex items-center gap-2">
                <Package className="size-5 text-chicken" />
                <h3 className="font-display text-lg font-bold">Minimum Bulk Order</h3>
              </div>
              <p className="text-sm text-white/80">Cartons start at 24 units. Flexible pricing for distributors, supermarkets, restaurants & corporate gifting.</p>
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={onSubmit} className="lg:col-span-3 rounded-3xl border-4 border-chicken-soft bg-cream p-8 shadow-[0_8px_30px_-12px_rgba(120,60,0,0.25)]">
            <div className="mb-6 flex items-center gap-3">
              <Building2 className="size-6 text-chicken-dark" />
              <h2 className="font-display text-2xl font-bold">Send a Business Inquiry</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field name="name" label="Your Name *" error={errors.name} />
              <Field name="company" label="Company / Brand" error={errors.company} />
              <Field name="email" label="Email *" type="email" error={errors.email} />
              <Field name="phone" label="Phone *" error={errors.phone} />

              <div className="md:col-span-1">
                <label className="mb-1 block text-sm font-bold text-ink/70">Inquiry Type *</label>
                <select name="inquiryType" defaultValue="bulk" className="w-full rounded-2xl border-2 border-chicken-soft bg-white px-4 py-3 font-medium focus:border-chicken focus:outline-none">
                  <option value="bulk">Bulk Order</option>
                  <option value="distribution">Distribution / Wholesale</option>
                  <option value="retail">Retail Partnership</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <Field name="quantity" label="Estimated Quantity (cartons)" placeholder="e.g. 200 cartons" error={errors.quantity} />

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-bold text-ink/70">Message *</label>
                <textarea name="message" rows={5} maxLength={1500} placeholder="Tell us about your business and what you need…" className="w-full rounded-2xl border-2 border-chicken-soft bg-white px-4 py-3 font-medium focus:border-chicken focus:outline-none" />
                {errors.message && <p className="mt-1 text-sm font-semibold text-spicy">{errors.message}</p>}
              </div>
            </div>

            <button type="submit" disabled={submitting} className="mt-6 inline-flex items-center gap-2 rounded-full bg-chicken-dark px-6 py-3 font-display font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:opacity-60">
              <Send className="size-4" /> {submitting ? "Sending…" : "Send Inquiry"}
            </button>
            {sent && <p className="mt-3 rounded-xl bg-chicken-soft px-3 py-2 text-sm font-semibold text-chicken-dark">✓ Thanks! Our team will get back to you within 1 business day.</p>}
          </form>
        </div>
      </section>

      {/* PARENT COMPANY — DONG DA */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="overflow-hidden rounded-[2.5rem] border-4 border-chicken-soft bg-white shadow-[0_8px_30px_-12px_rgba(120,60,0,0.25)]">
            <div className="grid gap-0 lg:grid-cols-2">
              <div className="relative min-h-[320px] lg:min-h-[480px]">
                <img
                  src={dongdaBuilding}
                  alt="Dong Da (Pvt) Ltd head office building in Karachi"
                  className="absolute inset-0 size-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-8 md:p-12">
                <span className="inline-block rounded-full bg-spicy/15 px-4 py-1 text-sm font-bold text-spicy">
                  <Sparkles className="mr-1 inline size-4" />
                  Our Parent Company
                </span>
                <h2 className="mt-4 font-display text-4xl font-bold leading-tight text-ink md:text-5xl">
                  Powered by <span className="text-chicken-dark">DONG DA (Pvt) Ltd</span>
                </h2>
                <p className="mt-5 text-base leading-relaxed text-ink/75">
                  <span className="font-bold text-ink">NOODOST</span> is a unique noodle brand under{" "}
                  <span className="font-bold text-ink">DONG DA (Pvt) Ltd</span>, inspired by the strong
                  friendship between China and Pakistan. The brand name is derived from the combination
                  of <span className="italic">'Noodle'</span> and <span className="italic">'Dost'</span> (Friend),
                  symbolizing quality, taste, cultural connection, and a shared spirit of partnership.
                </p>
                <p className="mt-4 text-base leading-relaxed text-ink/75">
                  NOODOST aims to deliver delicious, high-quality noodle products while building a
                  recognizable and trusted food brand in the market.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-2xl bg-chicken-soft p-4">
                    <p className="font-bold text-chicken-dark">🇨🇳 🇵🇰</p>
                    <p className="mt-1 text-ink/70">China–Pakistan friendship</p>
                  </div>
                  <div className="rounded-2xl bg-spicy-soft p-4">
                    <p className="font-bold text-spicy">Noodle + Dost</p>
                    <p className="mt-1 text-ink/70">A name with meaning</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Field({ name, label, type = "text", placeholder, error }: { name: string; label: string; type?: string; placeholder?: string; error?: string }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-bold text-ink/70">{label}</label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        maxLength={255}
        className="w-full rounded-2xl border-2 border-chicken-soft bg-white px-4 py-3 font-medium focus:border-chicken focus:outline-none"
      />
      {error && <p className="mt-1 text-sm font-semibold text-spicy">{error}</p>}
    </div>
  );
}