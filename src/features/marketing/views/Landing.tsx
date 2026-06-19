import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { logo } from "../../../assets";
import { useAuthStore } from "../../auth/authStore";
import { useContentStore } from "../../content/contentStore";
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
  const { fetchPublicPlans, plans } = useAuthStore();
  const { fetchFaqs } = useContentStore();
  const { Helmet } = useSEO(PAGE_SEO.landing);

  const today = new Date();
  const year = today.getFullYear();

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % images.length), 4500);
    trackPageView("/", "BunziMeal - Landing Page");
    return () => clearInterval(t);
  }, [images.length]);

  return (
    <div className="min-h-screen bg-primary text-accent/50 font-sans">
      {Helmet}

      <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-primary/70 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg shadow-lg shadow-primary/20">
              <img
                src={logo}
                alt="BunziMeal logo"
                className="h-6 w-6 brightness-0 invert"
              />
            </div>
            <span className="font-black text-2xl tracking-tighter uppercase">
              BunziMeal
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-accent 300">
            <Link
              to="/login"
              className="hover:text-primary/70 transition-colors"
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className="bg-primary text-[#020617] px-6 py-2.5 rounded-full font-bold hover:bg-primary/70 transition-all active:scale-95 shadow-lg shadow-primary/20"
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
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-primary/10 blur-[120px] rounded-full -z-10 animate-pulse" />

          <div className="max-w-7xl mx-auto text-center lg:text-left grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[13px] font-bold text-accent tracking-wide uppercase">
                <Zap size={14} className="fill-current" />
                The Ultimate Nigerian Meal Engine
              </div>

              <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-[0.9] text-white">
                Master your <br />
                <span className="text-accent">Kitchen.</span>
              </h1>

              <p className="text-lg md:text-xl text-white/50 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                BunziMeal coordinates your pantry, shopping lists, and nutrition in
                one place. Enjoy tailored meal plans that respect your budget
                and Nigerian taste.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5">
                <Link
                  to="/signup"
                  className="group w-full sm:w-auto px-10 py-5 bg-primary text-neutral-900 rounded-[2rem] text-white text-xl shadow-2xl shadow-primary/30 hover:-translate-y-1.5 transition-all flex items-center justify-center gap-2"
                >
                  Start Planning <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <div className="hidden sm:flex flex-col items-start border-l border-white/10 pl-5">
                  <span className="text-xl font-bold text-white">500+</span>
                  <span className="text-[10px] font-black text-accent 500 uppercase tracking-widest">
                    Active Planners
                  </span>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-4 bg-primary/20 rounded-[3rem] blur-2xl opacity-50" />
              <div className="relative aspect-square rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl bg-accent2">
                {images.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="Healthy Meal"
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                      i === idx ? "opacity-60" : "opacity-0"
                    }`}
                  />
                ))}
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent" />

                <div className="absolute top-10 left-10 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center gap-3 animate-float">
                  <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center text-white">
                    <Refrigerator size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-primary/70 uppercase tracking-widest">
                      Pantry Status
                    </p>
                    <p className="text-sm font-bold text-white">
                      Plantains Low (2 left)
                    </p>
                  </div>
                </div>

                <div className="absolute bottom-10 right-10 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center gap-3 animate-float-delayed">
                  <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-white">
                    <Utensils size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-accent 400 uppercase tracking-widest">
                      Dinner Today
                    </p>
                    <p className="text-sm font-bold text-white">
                      Jollof Quinoa
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-24 max-w-7xl mx-auto border-t border-white/5">
          <div className="grid md:grid-cols-3 gap-12 text-center md:text-left">
            <div className="space-y-4 group">
              <div className="h-14 w-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-primary mx-auto md:mx-0 group-hover:bg-primary group-hover:text-white transition-all">
                <Layout size={28} />
              </div>
              <h3 className="text-2xl font-black">Flexible Planning</h3>
              <p className="text-accent 400 text-sm leading-relaxed">
                Whether you're Keto, Vegan, or just want to eat more Nigerian
                whole foods, our engine builds the perfect week for you.
              </p>
            </div>
            <div className="space-y-4 group">
              <div className="h-14 w-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-primary mx-auto md:mx-0 group-hover:bg-primary group-hover:text-white transition-all">
                <ShoppingCart size={28} />
              </div>
              <h3 className="text-2xl font-black">Auto-Groceries</h3>
              <p className="text-accent 400 text-sm leading-relaxed">
                BunziMeal converts your meal plan into an organized shopping list
                instantly. Stop buying things you already have.
              </p>
            </div>
            <div className="space-y-4 group">
              <div className="h-14 w-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-primary mx-auto md:mx-0 group-hover:bg-primary group-hover:text-white transition-all">
                <Clock size={28} />
              </div>
              <h3 className="text-2xl font-black">Prep Efficiently</h3>
              <p className="text-accent 400 text-sm leading-relaxed">
                Step-by-step prep instructions designed to save you hours in the
                kitchen every Sunday.
              </p>
            </div>
          </div>
        </section>

        <section className="px-4 py-24 bg-primary text-white overflow-hidden relative">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/10 rounded-full text-[11px] font-black uppercase tracking-widest mb-6">
                <Sparkles size={14} className="animate-spin-slow" />
                Live: Personalized Nutrition
              </div>
              <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
                Meet your AI <br /> Nutritionist.
              </h2>
              <p className="text-white/70 text-lg font-bold mb-8 max-w-lg">
                Ask BunziMeal for ingredient swaps, nutritional breakdowns, or "What
                can I cook with these 3 items in my fridge?"
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/5 p-4 rounded-2xl border border-black/10">
                  <p className="text-2xl font-black">24/7</p>
                  <p className="text-[10px] uppercase font-black opacity-60">
                    Advice
                  </p>
                </div>
                <div className="bg-black/5 p-4 rounded-2xl border border-black/10">
                  <p className="text-2xl font-black">Local</p>
                  <p className="text-[10px] uppercase font-black opacity-60">
                    Food Knowledge
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-white/10 blur-3xl rounded-full" />
              <div className="relative bg-white/10 border border-white/10 text-white p-8 rounded-[2.5rem] shadow-2xl">
                <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
                  <div className="h-10 w-10 bg-primary rounded-full flex items-center justify-center text-white">
                    <Bot size={20} />
                  </div>
                  <span className="font-black uppercase tracking-tight italic text-primary">
                    BunziMeal AI Assistant
                  </span>
                </div>
                <div className="space-y-6">
                  <div className="bg-white/5 p-4 rounded-2xl rounded-bl-none ml-auto text-sm text-accent 300 max-w-[80%]">
                    "I want to lower the carbs in my dinner. Any ideas?"
                  </div>
                  <div className="bg-primary/10 border border-primary/20 p-4 rounded-2xl rounded-br-none text-sm text-primary/50 max-w-[80%] flex gap-3">
                    <MessageSquare size={16} className="shrink-0 mt-1" />
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
          <section className="px-4 py-32 bg-accent/30">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-black mb-6 uppercase tracking-tighter italic">
                Pricing
              </h2>
              <p className="text-accent/40 text-lg">
                Full suite access. No hidden fees.
              </p>
            </div>

            <div className="max-w-5xl mx-auto grid sm:grid-cols-2 gap-8">
              {plans.map((p: any) => (
                <div
                  key={p.plan}
                  className={`relative p-10 rounded-[3rem] border transition-all ${
                    p.plan === "annual"
                      ? "bg-white border-primary/70 text-white scale-105 z-10 shadow-2xl shadow-primary/10"
                      : "bg-white/5 border-white/10 text-white"
                  }`}
                >
                  {p.plan === "annual" && (
                    <div className="absolute top-0 right-10 -translate-y-1/2 bg-primary text-white text-[10px] font-black px-4 py-1.5 rounded-full">
                      SAVE 20%
                    </div>
                  )}
                  <p className="text-xs font-black uppercase tracking-[0.2em] mb-4 opacity-50">
                    {p.plan} Access
                  </p>
                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-5xl font-black tracking-tighter">
                      {new Intl.NumberFormat(undefined, {
                        style: "currency",
                        currency: p.currency || "NGN",
                        maximumFractionDigits: 0,
                      }).format(Number(p.price || p.price_cents / 100))}
                    </span>
                    <span className="text-sm font-bold opacity-60">
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
                        className="flex items-center gap-3 text-sm font-bold"
                      >
                        <CheckCircle2 size={18} className="text-primary" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/signup"
                    className={`block text-center py-4 rounded-2xl font-black transition-all ${
                      p.plan === "annual"
                        ? "bg-black text-white hover:bg-primary"
                        : "bg-white text-white hover:bg-primary"
                    }`}
                  >
                    Select Plan
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="px-4 py-24 bg-white/5 border-t border-white/5">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.4fr_auto] gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary uppercase tracking-[0.2em] font-black text-xs">
                <Download size={14} />
                Android APK
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">
                Download BunziMeal for Android
              </h2>
              <p className="text-accent/70 max-w-2xl leading-relaxed text-sm md:text-base">
                Install the app directly from your browser while we finalize Google Play.
                Open this page on your Android device, tap the button below, and allow installations from Chrome when prompted.
              </p>
            </div>

            <div className="rounded-[2.5rem] bg-primary/10 border border-white/10 p-8 text-center shadow-2xl shadow-black/10">
              <p className="text-[11px] uppercase tracking-[0.3em] font-black text-accent/50 mb-4">
                One-click install
              </p>
              <a
                href="https://expo.dev/artifacts/eas/6aQjouA3B3EMkBaPXPWEnx.apk"
                download
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-full bg-primary text-[#020617] font-black text-base shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all"
              >
                Download APK
                <ArrowRight size={18} />
              </a>
              <p className="text-[12px] text-accent/60 mt-4">
                Works best on Android Chrome. You may need to permit installs from this browser.
              </p>
              <p className="text-[12px] text-accent/50 mt-2">
                iOS app coming soon — stay tuned for App Store availability.
              </p>
            </div>
          </div>
        </section>

        <section className="px-4 py-40 text-center relative overflow-hidden">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-6xl md:text-9xl font-black tracking-tighter mb-10 uppercase italic">
              BunziMeal.
            </h2>
            <p className="text-accent 500 font-bold mb-10 uppercase tracking-widest">
              Eat Intelligently. Live Better.
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center gap-3 px-12 py-6 bg-primary text-white rounded-full font-black text-2xl shadow-2xl shadow-primary/40 hover:scale-105 transition-transform"
            >
              Get Started Now <ChevronRight strokeWidth={4} />
            </Link>
          </div>
        </section>
      </main>

      <footer className="px-4 py-20 border-t border-white/5 bg-black/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-2 opacity-50">
            <div className="bg-white/20 p-2 rounded-lg">
              <img
                src={logo}
                alt="logo"
                className="h-5 w-5 grayscale brightness-0 invert"
              />
            </div>
            <span className="font-black text-xl tracking-tighter uppercase">
              BunziMeal
            </span>
          </div>

          <div className="flex gap-8 text-[11px] font-black uppercase tracking-widest text-accent 500">
            <Link
              to="/privacy-policy"
              className="hover:text-primary/70 transition-colors"
            >
              Privacy
            </Link>
            <Link
              to="/terms-and-conditions"
              className="hover:text-primary/70 transition-colors"
            >
              Terms
            </Link>
            <Link
              to="/refund-policy"
              className="hover:text-primary/70 transition-colors"
            >
              Refunds
            </Link>
          </div>

          <p className="text-accent 600 text-[11px] font-bold">
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
