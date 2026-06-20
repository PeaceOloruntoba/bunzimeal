import { Outlet, Link } from "react-router";
import { logo } from "../assets";
import SupportContact from "./SupportContact";

export default function AuthLayout() {
  return (
    <div className="min-h-dvh grid grid-cols-1 md:grid-cols-2 bg-slate-50">
      {/* LEFT SIDE: BRAND HERO */}
      <div className="hidden md:flex bg-primary text-white items-center justify-center p-12 relative overflow-hidden">
        {/* Subtle Brand Texture */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--color-accent)_0%,_transparent_50%)]" />

        <div className="max-w-md space-y-8 relative z-10">
          <Link
            to="/"
            className="inline-flex items-center gap-3 text-3xl font-black italic tracking-tighter uppercase"
          >
            <div className="bg-white p-2 rounded-xl">
              <img src={logo} alt="Bunzi" className="h-8 w-8" />
            </div>
            <span>BunziMeal</span>
          </Link>

          <div className="space-y-3">
            <h2 className="text-4xl font-bold leading-tight tracking-tight">
              Smarter meal planning for busy people.
            </h2>
            <p className="text-white/80 text-lg leading-relaxed font-medium">
              Curated Nigerian recipes, nutrition, and shopping—personalized to
              your taste and lifestyle.
            </p>
          </div>

          <ul className="space-y-4 text-white/90 font-bold uppercase tracking-widest text-xs">
            <li className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-accent rounded-full" />
              Plan meals fast with smart suggestions
            </li>
            <li className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-accent rounded-full" />
              Track macros automatically
            </li>
            <li className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-accent rounded-full" />
              Generate shopping lists in one click
            </li>
          </ul>
        </div>
      </div>

      {/* RIGHT SIDE: FORM AREA */}
      <div className="flex flex-col items-center justify-center p-8 relative">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="mb-10 flex items-center gap-3 md:hidden">
            <div className="bg-primary p-2 rounded-xl">
              <img src={logo} alt="Bunzi" className="h-6 w-6" />
            </div>
            <span className="font-bold text-2xl tracking-tighter text-primary uppercase italic">
              BunziMeal
            </span>
          </div>

          <Outlet />
        </div>

        {/* Support at the bottom of the form side */}
        <div className="absolute bottom-8">
          <SupportContact />
        </div>
      </div>
    </div>
  );
}
