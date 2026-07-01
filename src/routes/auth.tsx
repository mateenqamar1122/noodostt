import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Admin Sign In — Noodle World" }, { name: "description", content: "Sign in to manage inquiries and orders." }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setInfo(null); setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: window.location.origin + "/admin" },
        });
        if (error) throw error;
        setInfo("Account created — signing you in…");
        const { error: e2 } = await supabase.auth.signInWithPassword({ email, password });
        if (e2) throw e2;
        navigate({ to: "/admin" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/admin" });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <Link to="/" className="text-sm font-bold text-ink/50 hover:text-ink">← Back home</Link>
      <div className="mt-4 rounded-[2rem] border-4 border-white bg-white p-8 shadow-lg">
        <h1 className="font-display text-4xl font-bold">{mode === "signin" ? "Admin Sign In" : "Create Admin Account"}</h1>
        <p className="mt-2 text-sm text-ink/60">The first account created becomes the admin automatically.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-ink/60">Email</span>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-2xl border-2 border-chicken-soft bg-cream px-4 py-3 font-medium focus:border-chicken focus:outline-none" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-ink/60">Password</span>
            <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-2xl border-2 border-chicken-soft bg-cream px-4 py-3 font-medium focus:border-chicken focus:outline-none" />
          </label>
          {error && <p className="rounded-xl bg-spicy/15 px-3 py-2 text-sm font-semibold text-spicy">{error}</p>}
          {info && <p className="rounded-xl bg-chicken-soft px-3 py-2 text-sm font-semibold text-chicken-dark">{info}</p>}
          <button type="submit" disabled={loading} className="w-full rounded-2xl bg-chicken-dark py-4 font-display text-lg font-bold text-white chunky-shadow-ink disabled:opacity-60">
            {loading ? "Please wait…" : mode === "signin" ? "Sign In" : "Create Account"}
          </button>
        </form>
        <button onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(null); setInfo(null); }} className="mt-4 w-full text-sm font-bold text-ink/60 hover:text-chicken-dark">
          {mode === "signin" ? "No account yet? Create the admin account →" : "Already have an account? Sign in →"}
        </button>
      </div>
    </div>
  );
}