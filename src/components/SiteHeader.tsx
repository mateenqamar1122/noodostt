import { Link } from "@tanstack/react-router";
// import { ShoppingBasket } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import Logo from "../assets/logo.svg";
import { ShoppingBasket, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";


export function SiteHeader() {
  const count = useCart((s) => s.items.reduce((n, i) => n + i.qty, 0));
  const open = useCart((s) => s.open);
  const [signedIn, setSignedIn] = useState(false);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSignedIn(!!s));
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-40 px-4 pt-4 sm:px-6">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 rounded-full border-4 border-white bg-white/85 px-6 shadow-[0_8px_30px_-12px_rgba(120,60,0,0.25)] backdrop-blur-md">

<Link to="/" className="flex items-center">
  <img
    src={Logo}
    alt="NooDost Logo"
    className="h-20 w-20"
  />
</Link>
{signedIn && (
            <Link to="/admin" className="inline-flex items-center gap-1 text-chicken-dark transition-colors hover:text-ink">
              <ShieldCheck className="size-4" /> Admin
            </Link>
          )}


        <nav className="hidden items-center gap-7 font-semibold text-ink/70 md:flex">
          <Link to="/" className="transition-colors hover:text-chicken-dark" activeOptions={{ exact: true }} activeProps={{ className: "text-chicken-dark" }}>
            Home
          </Link>
          <Link to="/world/$slug" params={{ slug: "chicken" }} className="transition-colors hover:text-chicken-dark" activeProps={{ className: "text-chicken-dark" }}>
            Worlds
          </Link>
          <Link to="/our-vision" className="transition-colors hover:text-chicken-dark" activeProps={{ className: "text-chicken-dark" }}>
            Our Vision
          </Link>
          <Link to="/products" className="transition-colors hover:text-chicken-dark" activeProps={{ className: "text-chicken-dark" }}>
            Shop
          </Link>
          <Link to="/contact" className="transition-colors hover:text-chicken-dark" activeProps={{ className: "text-chicken-dark" }}>
            contact
          </Link>
        </nav>

        <button
          onClick={open}
          className="relative flex items-center gap-2 rounded-full bg-ink px-4 py-2 font-display text-sm font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95 sm:px-5 sm:text-base"
        >
          <ShoppingBasket className="size-4 sm:size-5" />
          <span className="hidden sm:inline">Noodle Basket</span>
          <span className="sm:hidden">Basket</span>
          {count > 0 && (
            <span className="absolute -right-1 -top-1 grid size-6 place-items-center rounded-full bg-spicy text-xs font-bold text-white ring-2 ring-white animate-pop-in" key={count}>
              {count}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
