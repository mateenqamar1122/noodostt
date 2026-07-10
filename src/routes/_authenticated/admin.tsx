import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatPKR } from "@/lib/format";
import { LogOut, Mail, Package, ShieldAlert, Phone, Building2, Download, Search, TrendingUp, Users, RefreshCw, LayoutDashboard } from "lucide-react";

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
  const [tab, setTab] = useState<"overview" | "inquiries" | "orders">("overview");
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<"7" | "30" | "90" | "all">("30");

  async function loadData() {
    setRefreshing(true);
    const [{ data: inq }, { data: ords }] = await Promise.all([
      db.from("business_inquiries").select("*").order("created_at", { ascending: false }),
      db.from("orders").select("*").order("created_at", { ascending: false }),
    ]);
    setInquiries((inq ?? []) as Inquiry[]);
    setOrders((ords ?? []) as unknown as Order[]);
    setRefreshing(false);
  }

  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) { navigate({ to: "/auth" }); return; }
      const { data: roles } = await db.from("user_roles").select("role").eq("user_id", userData.user.id);
      const admin = !!(roles as { role: string }[] | null)?.some((r) => r.role === "admin");
      setIsAdmin(admin);
      if (!admin) { setLoading(false); return; }
      await loadData();
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

  // Reset filters when switching tabs
  useEffect(() => { setQuery(""); setStatusFilter("all"); }, [tab]);

  const cutoffMs = dateRange === "all" ? 0 : Number(dateRange) * 24 * 60 * 60 * 1000;
  const inRange = (iso: string) => cutoffMs === 0 || Date.now() - new Date(iso).getTime() <= cutoffMs;

  const filteredInquiries = useMemo(() => {
    const q = query.trim().toLowerCase();
    return inquiries.filter((i) => {
      if (statusFilter !== "all" && i.status !== statusFilter) return false;
      if (!q) return true;
      return [i.name, i.company, i.email, i.phone, i.message, i.inquiry_type].filter(Boolean).join(" ").toLowerCase().includes(q);
    });
  }, [inquiries, query, statusFilter]);

  const filteredOrders = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((o) => {
      if (statusFilter !== "all" && o.status !== statusFilter) return false;
      if (!q) return true;
      return [o.customer_name, o.email, o.city, o.address].join(" ").toLowerCase().includes(q);
    });
  }, [orders, query, statusFilter]);

  // Overview analytics (respect dateRange)
  const rangedOrders = orders.filter((o) => inRange(o.created_at));
  const rangedInquiries = inquiries.filter((i) => inRange(i.created_at));
  const rangedRevenue = rangedOrders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + Number(o.total), 0);
  const avgOrder = rangedOrders.length ? rangedRevenue / rangedOrders.length : 0;
  const codCount = rangedOrders.filter((o) => o.payment_method === "cod").length;
  const uniqueCustomers = new Set(rangedOrders.map((o) => o.email.toLowerCase())).size;

  const topProducts = useMemo(() => {
    const map = new Map<string, { name: string; qty: number }>();
    rangedOrders.forEach((o) => (o.items ?? []).forEach((it) => {
      const key = it.slug || it.name || "unknown";
      const cur = map.get(key) ?? { name: it.name ?? it.slug, qty: 0 };
      cur.qty += Number(it.qty) || 0;
      map.set(key, cur);
    }));
    return [...map.values()].sort((a, b) => b.qty - a.qty).slice(0, 5);
  }, [rangedOrders]);

  const topCities = useMemo(() => {
    const map = new Map<string, number>();
    rangedOrders.forEach((o) => map.set(o.city || "—", (map.get(o.city || "—") ?? 0) + 1));
    return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [rangedOrders]);

  // last 7 day revenue sparkline
  const dailyRevenue = useMemo(() => {
    const days: { label: string; total: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - i);
      const next = new Date(d); next.setDate(next.getDate() + 1);
      const total = orders
        .filter((o) => o.status !== "cancelled")
        .filter((o) => { const t = new Date(o.created_at).getTime(); return t >= d.getTime() && t < next.getTime(); })
        .reduce((s, o) => s + Number(o.total), 0);
      days.push({ label: d.toLocaleDateString(undefined, { weekday: "short" }), total });
    }
    return days;
  }, [orders]);

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
        <div className="flex flex-wrap items-center gap-2">
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value as typeof dateRange)} className="rounded-full border-2 border-ink/20 bg-white px-3 py-2 text-sm font-bold text-ink/70">
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="all">All time</option>
          </select>
          <button onClick={loadData} disabled={refreshing} className="inline-flex items-center gap-2 rounded-full border-2 border-ink/20 bg-white px-4 py-2 font-bold text-ink/70 hover:border-ink hover:text-ink disabled:opacity-50">
            <RefreshCw className={`size-4 ${refreshing ? "animate-spin" : ""}`} /> Refresh
          </button>
          <button onClick={signOut} className="inline-flex items-center gap-2 rounded-full border-2 border-ink/20 bg-white px-4 py-2 font-bold text-ink/70 hover:border-ink hover:text-ink">
            <LogOut className="size-4" /> Sign out
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="New inquiries" value={newInquiries} icon={<Mail className="size-5" />} accent="bg-chicken-soft text-chicken-dark" />
        <Stat label="Pending orders" value={pendingOrders} icon={<Package className="size-5" />} accent="bg-spicy/15 text-spicy" />
        <Stat label="Revenue (total)" value={formatPKR(revenue)} icon={<Building2 className="size-5" />} accent="bg-beef/15 text-beef" />
        <Stat label="Avg order value" value={formatPKR(avgOrder)} icon={<TrendingUp className="size-5" />} accent="bg-emerald-100 text-emerald-700" />
      </div>

      <div className="mt-8 flex gap-2 border-b-2 border-chicken-soft">
        <TabBtn active={tab === "overview"} onClick={() => setTab("overview")}>Overview</TabBtn>
        <TabBtn active={tab === "inquiries"} onClick={() => setTab("inquiries")}>Business Inquiries ({inquiries.length})</TabBtn>
        <TabBtn active={tab === "orders"} onClick={() => setTab("orders")}>Orders ({orders.length})</TabBtn>
      </div>

      {tab !== "overview" && (
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink/40" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={`Search ${tab}…`} className="w-full rounded-full border-2 border-chicken-soft bg-white py-2 pl-10 pr-4 text-sm outline-none focus:border-chicken-dark" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-full border-2 border-chicken-soft bg-white px-3 py-2 text-sm font-bold text-ink/70">
            <option value="all">All statuses</option>
            {(tab === "inquiries" ? ["new", "contacted", "closed"] : ["pending", "confirmed", "shipped", "delivered", "cancelled"]).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button
            onClick={() => tab === "inquiries" ? exportCSV("inquiries", filteredInquiries) : exportCSV("orders", filteredOrders)}
            className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-bold text-white hover:bg-ink/90"
          >
            <Download className="size-4" /> Export CSV
          </button>
        </div>
      )}

      {tab === "overview" && (
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border-2 border-chicken-soft bg-white p-5 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-bold">Revenue · last 7 days</h3>
              <LayoutDashboard className="size-5 text-ink/40" />
            </div>
            <div className="mt-6 flex h-48 items-end gap-3">
              {dailyRevenue.map((d, i) => {
                const max = Math.max(...dailyRevenue.map((x) => x.total), 1);
                const h = (d.total / max) * 100;
                return (
                  <div key={i} className="flex flex-1 flex-col items-center gap-2">
                    <div className="w-full text-center text-xs font-bold text-ink/60">{d.total ? formatPKR(d.total) : ""}</div>
                    <div className="w-full rounded-t-lg bg-chicken-dark/80" style={{ height: `${Math.max(h, 4)}%` }} />
                    <div className="text-xs text-ink/50">{d.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="grid gap-4">
            <MiniStat label="Unique customers" value={uniqueCustomers} icon={<Users className="size-5" />} />
            <MiniStat label="COD orders" value={`${codCount} / ${rangedOrders.length}`} icon={<Package className="size-5" />} />
            <MiniStat label="Inquiries in range" value={rangedInquiries.length} icon={<Mail className="size-5" />} />
          </div>

          <div className="rounded-2xl border-2 border-chicken-soft bg-white p-5">
            <h3 className="font-display text-xl font-bold">Top products</h3>
            {topProducts.length === 0 ? <p className="mt-3 text-sm text-ink/50">No orders in this range.</p> : (
              <ul className="mt-4 space-y-3">
                {topProducts.map((p, i) => {
                  const max = topProducts[0].qty;
                  return (
                    <li key={i}>
                      <div className="flex items-center justify-between text-sm"><span className="font-bold">{p.name}</span><span className="text-ink/60">{p.qty} sold</span></div>
                      <div className="mt-1 h-2 rounded-full bg-cream"><div className="h-full rounded-full bg-spicy" style={{ width: `${(p.qty / max) * 100}%` }} /></div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="rounded-2xl border-2 border-chicken-soft bg-white p-5">
            <h3 className="font-display text-xl font-bold">Top cities</h3>
            {topCities.length === 0 ? <p className="mt-3 text-sm text-ink/50">No orders in this range.</p> : (
              <ul className="mt-4 space-y-2">
                {topCities.map(([city, n]) => (
                  <li key={city} className="flex items-center justify-between rounded-xl bg-cream px-3 py-2 text-sm"><span className="font-bold">{city}</span><span className="text-ink/60">{n} orders</span></li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-2xl border-2 border-chicken-soft bg-white p-5">
            <h3 className="font-display text-xl font-bold">Recent activity</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {[...orders.slice(0, 3).map((o) => ({ t: o.created_at, txt: `Order · ${o.customer_name} · ${formatPKR(Number(o.total))}` })),
                ...inquiries.slice(0, 3).map((i) => ({ t: i.created_at, txt: `Inquiry · ${i.name}${i.company ? ` (${i.company})` : ""}` }))]
                .sort((a, b) => new Date(b.t).getTime() - new Date(a.t).getTime())
                .slice(0, 6)
                .map((a, idx) => (
                  <li key={idx} className="flex items-start justify-between gap-3 rounded-xl bg-cream px-3 py-2"><span>{a.txt}</span><span className="shrink-0 text-xs text-ink/50">{new Date(a.t).toLocaleDateString()}</span></li>
                ))}
              {orders.length === 0 && inquiries.length === 0 && <li className="text-ink/50">Nothing yet.</li>}
            </ul>
          </div>
        </div>
      )}

      {tab === "inquiries" && (
        <div className="mt-6 space-y-4">
          {filteredInquiries.length === 0 && <Empty label="No inquiries match." />}
          {filteredInquiries.map((i) => (
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
          {filteredOrders.length === 0 && <Empty label="No orders match." />}
          {filteredOrders.map((o) => (
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

function MiniStat({ label, value, icon }: { label: string; value: React.ReactNode; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border-2 border-chicken-soft bg-white p-4">
      <div className="inline-flex size-10 items-center justify-center rounded-full bg-chicken-soft text-chicken-dark">{icon}</div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-ink/50">{label}</p>
        <p className="font-display text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}

function exportCSV(kind: "inquiries" | "orders", rows: unknown[]) {
  if (rows.length === 0) return;
  const escape = (v: unknown) => {
    const s = v === null || v === undefined ? "" : typeof v === "object" ? JSON.stringify(v) : String(v);
    return `"${s.replace(/"/g, '""')}"`;
  };
  const cols = kind === "inquiries"
    ? ["created_at", "name", "company", "email", "phone", "inquiry_type", "quantity", "status", "message"]
    : ["created_at", "customer_name", "email", "address", "city", "zip", "payment_method", "status", "subtotal", "shipping", "total", "items"];
  const header = cols.join(",");
  const body = (rows as Record<string, unknown>[]).map((r) => cols.map((c) => escape(r[c])).join(",")).join("\n");
  const blob = new Blob([`${header}\n${body}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `${kind}-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click(); URL.revokeObjectURL(url);
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