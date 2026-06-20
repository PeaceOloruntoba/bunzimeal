import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { logo } from "../../../assets";
import { useAuthStore } from "../../auth/authStore";

import { useSEO } from "../../../hooks/useSEO";
import { trackPageView } from "../../../utils/analytics";
import { PAGE_SEO } from "../../../utils/seo";
import {
  ChevronRight,
  CheckCircle2,
  Layout,
  Clock,
  Sparkles,
  MessageSquare,
  Bot,
  ArrowRight,
  Refrigerator,
  ShoppingCart,
  Utensils,
  Zap,
  Download,
} from "lucide-react";

const MEAL_IMAGES = [
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1200&auto=format&fit=crop",
];

export default function Landing() {
  const [idx, setIdx] = useState(0);
  const images = useMemo(() => MEAL_IMAGES, []);
  const { plans } = useAuthStore();
  const { Helmet } = useSEO(PAGE_SEO.landing);

  const today = new Date();
  const year = today.getFullYear();

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % images.length), 4500);
    trackPageView("/", "BunziMeal - Landing Page");
    return () => clearInterval(t);
  }, [images.length]);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {Helmet}

      <header className="fixed top-0 w-full z-50 border-b border-slate-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg">
              <img
                src={logo}
                alt="BunziMeal logo"
                className="h-6 w-6 brightness-0 invert"
              />
            </div>
            <span className="font-bold text-2xl tracking-tighter uppercase text-primary">
              BunziMeal
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <Link
              to="/login"
              className="hover:text-primary transition-colors duration-300"
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className="bg-primary text-white px-6 py-2.5 rounded-full font-semibold hover:bg-primary/90 transition-all duration-300 hover:-translate-y-0.5 shadow-[0_4px_15px_rgba(31,68,76,0.2)]"
            >
              Get Started
            </Link>
          </nav>

          <Link
            to="/signup"
            className="md:hidden bg-primary text-white p-2 rounded-full"
          >
            <ChevronRight size={20} />
          </Link>
        </div>
      </header>

      <main>
        <section className="relative px-4 pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-accent/10 blur-[120px] rounded-full -z-10 animate-pulse" />

          <div className="max-w-7xl mx-auto text-center lg:text-left grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-[13px] font-semibold text-primary tracking-wide uppercase">
                <Zap size={14} className="fill-current" />
                The Ultimate Nigerian Meal Engine
              </div>

              <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[0.95] text-slate-900">
                Master your <br />
                <span className="text-primary">Kitchen.</span>
              </h1>

              <p className="text-lg md:text-xl text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                BunziMeal coordinates your pantry, shopping lists, and nutrition in
                one place. Enjoy tailored meal plans that respect your budget
                and Nigerian taste.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5">
                <Link
                  to="/signup"
                  className="group w-full sm:w-auto px-10 py-5 bg-primary text-white rounded-[2rem] text-xl hover:bg-primary/90 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_8px_30px_rgba(31,68,76,0.2)]"
                >
                  Start Planning <ArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                <div className="hidden sm:flex flex-col items-start border-l border-slate-200 pl-5">
                  <span className="text-2xl font-bold text-primary">500+</span>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">
                    Active Planners
                  </span>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-[3rem] blur-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
              <div className="relative aspect-square rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.08)] bg-white">
                {images.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="Healthy Meal"
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                      i === idx ? "opacity-80" : "opacity-0"
                    }`}
                  />
                ))}
                <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent" />

                <div className="absolute top-10 left-10 bg-white/90 backdrop-blur-md border border-slate-200 p-4 rounded-2xl flex items-center gap-3 shadow-lg animate-float">
                  <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center text-white">
                    <Refrigerator size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      Pantry Status
                    </p>
                    <p className="text-sm font-semibold text-slate-900">
                      Plantains Low (2 left)
                    </p>
                  </div>
                </div>

                <div className="absolute bottom-10 right-10 bg-white/90 backdrop-blur-md border border-slate-200 p-4 rounded-2xl flex items-center gap-3 shadow-lg animate-float-delayed">
                  <div className="h-10 w-10 bg-accent rounded-xl flex items-center justify-center text-primary">
                    <Utensils size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      Dinner Today
                    </p>
                    <p className="text-sm font-semibold text-slate-900">
                      Jollof Quinoa
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-24 max-w-7xl mx-auto border-t border-slate-100">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="premium-card p-8 text-center md:text-left group cursor-default">
              <div className="h-14 w-14 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center text-primary mx-auto md:mx-0 mb-4 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300">
                <Layout size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-900">Flexible Planning</h3>
              <p className="text-slate-600 leading-relaxed">
                Whether you're Keto, Vegan, or just want to eat more Nigerian
                whole foods, our engine builds the perfect week for you.
              </p>
            </div>
            <div className="premium-card p-8 text-center md:text-left group cursor-default">
              <div className="h-14 w-14 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center text-primary mx-auto md:mx-0 mb-4 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300">
                <ShoppingCart size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-900">Auto-Groceries</h3>
              <p className="text-slate-600 leading-relaxed">
                BunziMeal converts your meal plan into an organized shopping list
                instantly. Stop buying things you already have.
              </p>
            </div>
            <div className="premium-card p-8 text-center md:text-left group cursor-default">
              <div className="h-14 w-14 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center text-primary mx-auto md:mx-0 mb-4 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300">
                <Clock size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-900">Prep Efficiently</h3>
              <p className="text-slate-600 leading-relaxed">
                Step-by-step prep instructions designed to save you hours in the
                kitchen every Sunday.
              </p>
            </div>
          </div>
        </section>

        <section className="px-4 py-24 bg-slate-50 overflow-hidden relative">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/20 rounded-full text-[11px] font-bold uppercase tracking-widest mb-6 text-primary">
                <Sparkles size={14} className="animate-spin-slow" />
                Live: Personalized Nutrition
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-slate-900">
                Meet your AI <br /> Nutritionist.
              </h2>
              <p className="text-slate-600 text-lg font-semibold mb-8 max-w-lg">
                Ask BunziMeal for ingredient swaps, nutritional breakdowns, or "What
                can I cook with these 3 items in my fridge?"
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200">
                  <p className="text-2xl font-bold text-primary">24/7</p>
                  <p className="text-[10px] uppercase font-semibold text-slate-500">
                    Advice
                  </p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200">
                  <p className="text-2xl font-bold text-primary">Local</p>
                  <p className="text-[10px] uppercase font-semibold text-slate-500">
                    Food Knowledge
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full" />
              <div className="relative bg-white border border-slate-200 text-slate-900 p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
                <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-4">
                  <div className="h-10 w-10 bg-primary rounded-full flex items-center justify-center text-white">
                    <Bot size={20} />
                  </div>
                  <span className="font-bold uppercase tracking-tight italic text-primary">
                    BunziMeal AI Assistant
                  </span>
                </div>
                <div className="space-y-6">
                  <div className="bg-slate-100 p-4 rounded-2xl rounded-bl-none ml-auto text-sm text-slate-700 max-w-[80%]">
                    "I want to lower the carbs in my dinner. Any ideas?"
                  </div>
                  <div className="bg-primary/5 border border-primary/10 p-4 rounded-2xl rounded-br-none text-sm text-slate-800 max-w-[80%] flex gap-3">
                    <MessageSquare size={16} className="shrink-0 mt-1 text-primary" />
                    <span>
                      Try replacing white rice with {" "}
                      <strong>Cauliflower Rice</strong> or {" "}
                      <strong>Grated Garden Egg</strong>. It keeps the texture
                      but cuts carbs by 70%!
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {plans && plans.length > 0 && (
          <section className="px-4 py-32 bg-white border-t border-slate-100">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 uppercase tracking-tighter italic text-primary">
                Pricing
              </h2>
              <p className="text-slate-600 text-lg">
                Full suite access. No hidden fees.
              </p>
            </div>

            <div className="max-w-5xl mx-auto grid sm:grid-cols-2 gap-8">
              {plans.map((p: any) => (
                <div
                  key={p.plan}
                  className={`relative p-10 rounded-[3rem] border transition-all duration-300 ${
                    p.plan === "annual"
                      ? "bg-primary text-white border-primary scale-105 z-10 shadow-[0_20px_50px_rgba(31,68,76,0.3)]"
                      : "premium-card"
                  }`}
                >
                  {p.plan === "annual" && (
                    <div className="absolute top-0 right-10 -translate-y-1/2 bg-accent text-primary text-[10px] font-bold px-4 py-1.5 rounded-full">
                      SAVE 20%
                    </div>
                  )}
                  <p className={`text-xs font-semibold uppercase tracking-[0.2em] mb-4 ${p.plan === "annual" ? "opacity-80" : "text-slate-500"}`}>
                    {p.plan} Access
                  </p>
                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-5xl font-bold tracking-tighter">
                      {new Intl.NumberFormat(undefined, {
                        style: "currency",
                        currency: p.currency || "NGN",
                        maximumFractionDigits: 0,
                      }).format(Number(p.price || p.price_cents / 100))}
                    </span>
                    <span className={`text-sm font-semibold ${p.plan === "annual" ? "opacity-80" : "text-slate-500"}`}>
                      /{p.plan === "monthly" ? "mo" : "yr"}
                    </span>
                  </div>
                  <ul className="space-y-4 mb-10">
                    {[
                      "Smart Pantry Sync",
                      "AI Chat Access",
                      "Interactive Grocery Lists",
                      "Calorie Tracking",
                    ].map((f) => (
                      <li
                        key={f}
                        className="flex items-center gap-3 text-sm font-semibold"
                      >
                        <CheckCircle2 size={18} className={p.plan === "annual" ? "text-accent" : "text-primary"} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/signup"
                    className={`block text-center py-4 rounded-2xl font-semibold transition-all duration-300 ${
                      p.plan === "annual"
                        ? "bg-white text-primary hover:bg-slate-100"
                        : "bg-primary text-white hover:bg-primary/90 hover:-translate-y-0.5"
                    }`}
                  >
                    Select Plan
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="px-4 py-24 bg-slate-50 border-t border-slate-100">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.4fr_auto] gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary uppercase tracking-[0.2em] font-bold text-xs">
                <Download size={14} />
                Android APK
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
                Download BunziMeal for Android
              </h2>
              <p className="text-slate-600 max-w-2xl leading-relaxed text-sm md:text-base">
                Install the app directly from your browser while we finalize Google Play.
                Open this page on your Android device, tap the button below, and allow installations from Chrome when prompted.
              </p>
            </div>

            <div className="premium-card p-8 text-center">
              <p className="text-[11px] uppercase tracking-[0.3em] font-bold text-slate-500 mb-4">
                One-click install
              </p>
              <a
                href="https://expo.dev/artifacts/eas/6aQjouA3B3EMkBaPXPWEnx.apk"
                download
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-full bg-primary text-white font-bold text-base shadow-[0_8px_30px_rgba(31,68,76,0.2)] hover:bg-primary/90 hover:-translate-y-0.5 transition-all duration-300"
              >
                Download APK
                <ArrowRight size={18} />
              </a>
              <p className="text-[12px] text-slate-600 mt-4">
                Works best on Android Chrome. You may need to permit installs from this browser.
              </p>
              <p className="text-[12px] text-slate-500 mt-2">
                iOS app coming soon — stay tuned for App Store availability.
              </p>
            </div>
          </div>
        </section>

        <section className="px-4 py-40 text-center relative overflow-hidden">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-10 uppercase italic text-primary">
              BunziMeal.
            </h2>
            <p className="text-slate-600 font-bold mb-10 uppercase tracking-widest">
              Eat Intelligently. Live Better.
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center gap-3 px-12 py-6 bg-primary text-white rounded-full font-bold text-2xl shadow-[0_8px_30px_rgba(31,68,76,0.25)] hover:bg-primary/90 hover:scale-105 transition-all duration-300"
            >
              Get Started Now <ChevronRight strokeWidth={4} />
            </Link>
          </div>
        </section>
      </main>

      <footer className="px-4 py-20 border-t border-slate-100 bg-slate-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-2 opacity-70">
            <div className="bg-primary/10 p-2 rounded-lg">
              <img
                src={logo}
                alt="logo"
                className="h-5 w-5"
              />
            </div>
            <span className="font-bold text-xl tracking-tighter uppercase text-primary">
              BunziMeal
            </span>
          </div>

          <div className="flex gap-8 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
            <Link
              to="/privacy-policy"
              className="hover:text-primary transition-colors duration-300"
            >
              Privacy
            </Link>
            <Link
              to="/terms-and-conditions"
              className="hover:text-primary transition-colors duration-300"
            >
              Terms
            </Link>
            <Link
              to="/refund-policy"
              className="hover:text-primary transition-colors duration-300"
            >
              Refunds
            </Link>
          </div>

          <p className="text-slate-500 text-[11px] font-semibold">
            © {year} BunziMeal Tech. All rights reserved.
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float { animation: float 5s ease-in-out infinite; }
        .animate-float-delayed { animation: float 6s ease-in-out 1s infinite; }
        .animate-spin-slow { animation: spin 8s linear infinite; }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
