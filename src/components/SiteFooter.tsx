import { Link } from "@tanstack/react-router";
import { FLAVOR_LIST } from "@/lib/products";
import Logo from "../assets/logo.svg";
export function SiteFooter() {
  return (
    <footer className="mt-24 border-t-8 border-chicken-soft bg-white pb-10 pt-20">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-4">
        <div>
          <div className="mb-5 flex items-center gap-2">
           <Link to="/" className="flex items-center">
  <img
    src={Logo}
    alt="NooDost Logo"
    className="h-full w-30"
  />
</Link>
          </div>
          <p className="text-sm leading-relaxed text-ink/60">
            Crafting magical meals for the next generation of slurpers. Real ingredients, playful souls.
          </p>
        </div>
        <div>
          <h5 className="mb-5 font-display text-lg font-bold">Flavor Worlds</h5>
          <ul className="space-y-3 text-sm font-medium text-ink/60">
            {FLAVOR_LIST.map((f) => (
              <li key={f.slug}>
                <Link to="/world/$slug" params={{ slug: f.slug }} className={`hover:${f.textClass}`}>
                  {f.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h5 className="mb-5 font-display text-lg font-bold">Company</h5>
          <ul className="space-y-3 text-sm font-medium text-ink/60">
            <li><Link to="/our-vision" className="hover:text-chicken-dark">Our Vision</Link></li>
            <li><a href="#" className="hover:text-chicken-dark">Shipping</a></li>
            <li><Link to="/contact" className="hover:text-chicken-dark">Contact Us</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="mb-5 font-display text-lg font-bold">Stay Slurpy</h5>
          <p className="mb-4 text-sm text-ink/60">Get 20% off your first order.</p>
          <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="you@home.com" className="min-w-0 flex-1 rounded-full border-2 border-chicken-soft bg-cream px-4 py-2 text-sm focus:border-chicken focus:outline-none" />
            <button className="rounded-full bg-chicken-dark px-4 py-2 font-display text-sm font-bold text-white">Join</button>
          </form>
        </div>
      </div>
      <div className="mx-auto mt-16 max-w-7xl border-t border-chicken-soft px-6 pt-6 text-center text-xs text-ink/40">
        © 2026 Noodle World Adventures. All  rights reserved.
      </div>
    </footer>
  );
}