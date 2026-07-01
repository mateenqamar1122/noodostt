import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatPKR } from "@/lib/format";
import { LogOut, Mail, Package, ShieldAlert, Phone, Building2 } from "lucide-react";

// Cast for tables not yet in generated types
const db = supabase as unknown as {
  from: (t: string) => {
    select: (c?: string) => { eq: (k: string, v: string) => Promise<{ data: unknown[] | null }>; order: (c: string, o: { ascending: boolean }) => Promise<{ data: unknown[] | null }> };
    update: (v: Record<string, unknown>) => { eq: (k: string, v: string) => Promise<unknown> };
    insert: (v: Record<string, unknown>) => Promise<{ error: { message: string } | null }>;
  };
};

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin Dashboard — Noodle World" }, { name: "description", content: "Manage business inquiries and customer orders." }] }),
  component: AdminDashboard,
});

type Inquiry = {
  id: string; name: string; company: string | null; email: string; phone: string;
  inquiry_type: string; quantity: string | null; message: string; status: string; created_at: string;
};

type OrderItem = { slug: string; qty: number; name?: string };
type Order = {
  id: string; customer_name: string; email: string; address: string; city: string; zip: string;
  payment_method: string; items: OrderItem[]; subtotal: number; shipping: number; total: number;
  status: string; created_at: string;
};

function AdminDashboard() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [tab, setTab] = useState<"inquiries" | "orders">("inquiries");
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) { navigate({ to: "/auth" }); return; }
      const { data: roles } = await db.from("user_roles").select("role").eq("user_id", userData.user.id);
      const admin = !!(roles as { role: string }[] | null)?.some((r) => r.role === "admin");
      setIsAdmin(admin);
      if (!admin) { setLoading(false); return; }
      const [{ data: inq }, { data: ords }] = await Promise.all([
        db.from("business_inquiries").select("*").order("created_at", { ascending: false }),
        db.from("orders").select("*").order("created_at", { ascending: false }),
      ]);
      setInquiries((inq ?? []) as Inquiry[]);
      setOrders((ords ?? []) as unknown as Order[]);
      setLoading(false);
    })();
  }, [navigate]);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  async function markInquiry(id: string, status: string) {
    await db.from("business_inquiries").update({ status }).eq("id", id);
    setInquiries((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
  }

  async function markOrder(id: string, status: string) {
    await db.from("orders").update({ status }).eq("id", id);
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  }

  if (loading) return <div className="p-16 text-center font-display text-2xl">Loading dashboard…</div>;

  if (isAdmin === false) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <ShieldAlert className="mx-auto size-14 text-spicy" />
        <h1 className="mt-4 font-display text-4xl font-bold">Not authorized</h1>
        <p className="mt-2 text-ink/60">Your account doesn't have admin access.</p>
        <button onClick={signOut} className="mt-6 rounded-2xl bg-ink px-6 py-3 font-display font-bold text-white">Sign out</button>
      </div>
    );
  }

  const newInquiries = inquiries.filter((i) => i.status === "new").length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const revenue = orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + Number(o.total), 0);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold">Admin Dashboard</h1>
          <p className="text-ink/60">Manage inquiries and orders in one place.</p>
        </div>
        <button onClick={signOut} className="inline-flex items-center gap-2 rounded-full border-2 border-ink/20 bg-white px-4 py-2 font-bold text-ink/70 hover:border-ink hover:text-ink">
          <LogOut className="size-4" /> Sign out
        </button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Stat label="New inquiries" value={newInquiries} icon={<Mail className="size-5" />} accent="bg-chicken-soft text-chicken-dark" />
        <Stat label="Pending orders" value={pendingOrders} icon={<Package className="size-5" />} accent="bg-spicy/15 text-spicy" />
        <Stat label="Revenue" value={formatPKR(revenue)} icon={<Building2 className="size-5" />} accent="bg-beef/15 text-beef" />
      </div>

      <div className="mt-8 flex gap-2 border-b-2 border-chicken-soft">
        <TabBtn active={tab === "inquiries"} onClick={() => setTab("inquiries")}>Business Inquiries ({inquiries.length})</TabBtn>
        <TabBtn active={tab === "orders"} onClick={() => setTab("orders")}>Orders ({orders.length})</TabBtn>
      </div>

      {tab === "inquiries" && (
        <div className="mt-6 space-y-4">
          {inquiries.length === 0 && <Empty label="No inquiries yet." />}
          {inquiries.map((i) => (
            <div key={i.id} className="rounded-2xl border-2 border-chicken-soft bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-xl font-bold">{i.name}{i.company ? <span className="text-ink/50 font-normal"> · {i.company}</span> : null}</h3>
                  <div className="mt-1 flex flex-wrap gap-3 text-sm text-ink/60">
                    <a href={`mailto:${i.email}`} className="inline-flex items-center gap-1 hover:text-chicken-dark"><Mail className="size-3.5" />{i.email}</a>
                    <a href={`tel:${i.phone}`} className="inline-flex items-center gap-1 hover:text-chicken-dark"><Phone className="size-3.5" />{i.phone}</a>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={i.status} />
                  <span className="text-xs text-ink/50">{new Date(i.created_at).toLocaleString()}</span>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <Tag>Type: {i.inquiry_type}</Tag>
                {i.quantity && <Tag>Qty: {i.quantity}</Tag>}
              </div>
              <p className="mt-3 whitespace-pre-wrap rounded-xl bg-cream p-4 text-sm text-ink/80">{i.message}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <ActionBtn onClick={() => markInquiry(i.id, "contacted")}>Mark contacted</ActionBtn>
                <ActionBtn onClick={() => markInquiry(i.id, "closed")}>Close</ActionBtn>
                <ActionBtn onClick={() => markInquiry(i.id, "new")}>Reopen</ActionBtn>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "orders" && (
        <div className="mt-6 space-y-4">
          {orders.length === 0 && <Empty label="No orders yet." />}
          {orders.map((o) => (
            <div key={o.id} className="rounded-2xl border-2 border-chicken-soft bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-xl font-bold">{o.customer_name}</h3>
                  <p className="text-sm text-ink/60">{o.email} · {o.address}, {o.city} {o.zip}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={o.status} />
                  <span className="text-xs text-ink/50">{new Date(o.created_at).toLocaleString()}</span>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <Tag>{o.payment_method === "cod" ? "💵 Cash on Delivery" : "💳 Card"}</Tag>
                <Tag>Total: {formatPKR(Number(o.total))}</Tag>
              </div>
              <ul className="mt-3 space-y-1 rounded-xl bg-cream p-4 text-sm">
                {(o.items ?? []).map((it, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span>{it.name ?? it.slug} × {it.qty}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex flex-wrap gap-2">
                <ActionBtn onClick={() => markOrder(o.id, "confirmed")}>Confirm</ActionBtn>
                <ActionBtn onClick={() => markOrder(o.id, "shipped")}>Mark shipped</ActionBtn>
                <ActionBtn onClick={() => markOrder(o.id, "delivered")}>Delivered</ActionBtn>
                <ActionBtn onClick={() => markOrder(o.id, "cancelled")}>Cancel</ActionBtn>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, icon, accent }: { label: string; value: React.ReactNode; icon: React.ReactNode; accent: string }) {
  return (
    <div className="rounded-2xl border-2 border-chicken-soft bg-white p-5">
      <div className={`inline-flex size-10 items-center justify-center rounded-full ${accent}`}>{icon}</div>
      <p className="mt-3 text-sm font-bold uppercase tracking-wide text-ink/50">{label}</p>
      <p className="mt-1 font-display text-3xl font-bold">{value}</p>
    </div>
  );
}
function TabBtn({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return <button onClick={onClick} className={`-mb-0.5 border-b-4 px-4 py-3 font-display font-bold transition ${active ? "border-chicken-dark text-chicken-dark" : "border-transparent text-ink/50 hover:text-ink"}`}>{children}</button>;
}
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    new: "bg-chicken-soft text-chicken-dark",
    pending: "bg-chicken-soft text-chicken-dark",
    contacted: "bg-beef/15 text-beef",
    confirmed: "bg-beef/15 text-beef",
    shipped: "bg-spicy/15 text-spicy",
    delivered: "bg-emerald-100 text-emerald-700",
    closed: "bg-ink/10 text-ink/60",
    cancelled: "bg-red-100 text-red-700",
  };
  return <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${map[status] ?? "bg-ink/10 text-ink/60"}`}>{status}</span>;
}
function Tag({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-cream px-3 py-1 font-semibold text-ink/70">{children}</span>;
}
function ActionBtn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return <button onClick={onClick} className="rounded-full border-2 border-ink/15 bg-white px-3 py-1.5 text-xs font-bold text-ink/70 hover:border-chicken-dark hover:text-chicken-dark">{children}</button>;
}
function Empty({ label }: { label: string }) {
  return <div className="rounded-2xl border-2 border-dashed border-chicken-soft bg-white/50 p-12 text-center text-ink/50">{label}</div>;
}