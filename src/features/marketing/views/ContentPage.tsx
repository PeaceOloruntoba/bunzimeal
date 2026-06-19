import { useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { useContentStore } from "../../content/contentStore";
import { Spinner } from "../../../components/Spinner";
import {
  ArrowLeft,
  ShieldCheck,
  FileText,
  CreditCard,
  Mail,
} from "lucide-react";

type ContentType = "privacy" | "terms" | "refund";

const SectionHeader = ({ title, icon: Icon }: { title: string; icon: any }) => (
  <div className="flex items-center gap-2 mt-8 mb-4 border-l-4 border-primary pl-4">
    <Icon className="text-primary" size={20} />
    <h3 className="text-xl font-black text-white uppercase tracking-tight">
      {title}
    </h3>
  </div>
);

const PrivacyPolicy = () => (
  <article className="prose prose-invert max-w-none">
    <div className="mb-10">
      <h2 className="text-4xl font-black text-white mb-2">Privacy Policy</h2>
      <p className="text-primary font-bold">
        Last Updated: January 10, 2026
      </p>
    </div>

    <p className="text-light leading-relaxed text-lg">
      This Privacy Policy explains how {" "}
      <span className="text-white font-bold">BunziMeal</span>, operated by BunziMeal Tech,
      collects, uses, and protects your personal information.
    </p>

    <SectionHeader title="1. Information We Collect" icon={ShieldCheck} />
    <div className="grid md:grid-cols-2 gap-6 mt-4">
      <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
        <h4 className="font-black text-primary mb-3 uppercase text-xs tracking-widest">
          Personal Data
        </h4>
        <ul className="space-y-2 text-light text-sm">
          <li>• Name & Contact Details</li>
          <li>• Email address</li>
          <li>• Phone number</li>
          <li>• Age Verification (13+)</li>
        </ul>
      </div>
      <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
        <h4 className="font-black text-primary mb-3 uppercase text-xs tracking-widest">
          App Usage
        </h4>
        <ul className="space-y-2 text-light text-sm">
          <li>• Meal selections & Preferences</li>
          <li>• Allergies & Health Goals</li>
          <li>• Macro-nutrient tracking data</li>
          <li>• Recipe interaction history</li>
        </ul>
      </div>
    </div>

    <SectionHeader title="2. How We Use Data" icon={FileText} />
    <ul className="grid gap-3 text-light italic">
      <li className="flex gap-2">
        <span>→</span> Provide personalized Nigerian meal recommendations
      </li>
      <li className="flex gap-2">
        <span>→</span> Optimize shopping list generation
      </li>
      <li className="flex gap-2">
        <span>→</span> Manage secure subscriptions via Paystack
      </li>
    </ul>
  </article>
);

const TermsAndConditions = () => (
  <article className="prose prose-invert max-w-none">
    <div className="mb-10">
      <h2 className="text-4xl font-black text-white mb-2">Terms of Service</h2>
      <p className="text-primary font-bold">
        Last Updated: January 10, 2026
      </p>
    </div>

    <SectionHeader title="1. Agreement" icon={ShieldCheck} />
    <p className="text-light">
      By accessing <span className="text-white">BunziMeal</span>, you agree to be
      bound by these high-performance standards of use.
    </p>

    <SectionHeader title="2. Health Disclaimer" icon={ShieldCheck} />
    <div className="bg-primary/10 border-l-4 border-primary p-4 my-6">
      <p className="text-primary font-bold text-sm">
        IMPORTANT: BunziMeal provides general nutritional guidance. We are not
        medical professionals. Always consult your doctor for specific dietary
        restrictions or medical conditions.
      </p>
    </div>
  </article>
);

const RefundPolicy = () => (
  <article className="prose prose-invert max-w-none">
    <div className="mb-10">
      <h2 className="text-4xl font-black text-white mb-2">Refund Policy</h2>
      <p className="text-primary font-bold">
        Last Updated: January 10, 2026
      </p>
    </div>

    <SectionHeader title="1. Final Sale" icon={CreditCard} />
    <p className="text-light mb-6">
      To maintain our high-quality meal planning services, all subscription
      payments are {" "}
      <span className="text-white font-bold">final and non-refundable</span>.
    </p>

    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
      <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
        <h4 className="text-white font-bold mb-4">Valid Exceptions:</h4>
        <ul className="space-y-3 text-sm text-light">
          <li className="flex items-center gap-2">
            <div className="h-1 w-1 bg-primary rounded-full" /> Duplicate
            charges verified by Paystack
          </li>
          <li className="flex items-center gap-2">
            <div className="h-1 w-1 bg-primary rounded-full" /> Documented
            technical billing failure
          </li>
        </ul>
      </div>
    </div>
  </article>
);

export default function ContentPage({
  contentType,
}: {
  contentType?: ContentType;
}) {
  const type = contentType as ContentType;
  const { fetchContents, loading } = useContentStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchContents().catch(() => {});
  }, []);

  const content =
    type === "privacy" ? (
      <PrivacyPolicy />
    ) : type === "terms" ? (
      <TermsAndConditions />
    ) : (
      <RefundPolicy />
    );

  return (
    <div className="min-h-screen bg-[#020617] text-light flex flex-col">
      <header className="sticky top-0 z-50 bg-[#020617]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-primary hover:text-primary transition-colors"
          >
            <ArrowLeft size={18} strokeWidth={3} />
            Back
          </button>
          <div className="flex items-center gap-2">
            <span className="font-black text-xl tracking-tighter text-white uppercase">
              BunziMeal
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-6 py-16 w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <Spinner size={40} color="#10b981" />
            <span className="text-dark font-black animate-pulse uppercase tracking-widest text-[10px]">
              Syncing Legal Docs...
            </span>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {content}
          </div>
        )}
      </main>

      <footer className="bg-white/5 border-t border-white/5 py-12 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="flex justify-center gap-8 text-[10px] font-black uppercase tracking-widest text-dark">
            <Link to="/privacy-policy" className="hover:text-primary">
              Privacy
            </Link>
            <Link to="/terms-and-conditions" className="hover:text-primary">
              Terms
            </Link>
            <Link to="/refund-policy" className="hover:text-primary">
              Refunds
            </Link>
          </div>
          <p className="text-xs text-dark font-medium">
            &copy; 2026 BunziMeal Tech. All rights reserved.
          </p>
          <a
            href="mailto:hello@BunziMeal.app"
            className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full text-xs font-bold text-white transition-all border border-white/10"
          >
            <Mail size={14} className="text-primary" />
            Support: hello@BunziMeal.app
          </a>
        </div>
      </footer>
    </div>
  );
}
