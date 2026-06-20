import { useEffect, useRef, useState } from "react";
import { useBillingStore } from "../billingStore";
import { Spinner } from "../../../components/Spinner";
import { toast } from "../../../utils/toast";
import { ConfirmCheckoutModal } from "../../../components/ConfirmCheckoutModal";
import {
  CreditCard,
  CheckCircle2,
  Zap,
  Calendar,
  ArrowRight,
  ShieldCheck,
  Lock,
} from "lucide-react";

export default function Billing() {
  const { loading, status, plans, fetchStatus, fetchPlans, cancel } =
    useBillingStore();
  const setReferralCode = useBillingStore((s) => s.setReferralCode);
  const didInit = useRef(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<number>(0);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("NGN");
  const [referral, setReferral] = useState("");

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    fetchStatus().catch(() => {});
    fetchPlans().catch(() => {});
    const reason = localStorage.getItem("paywall_reason");
    if (reason) {
      toast.info(reason);
      localStorage.removeItem("paywall_reason");
    }
  }, [fetchStatus, fetchPlans]);

  const onCancelRenew = async () => {
    try {
      await cancel();
      toast.success("Auto-renew cancelled successfully");
    } catch (e) {
      toast.error("Failed to cancel renewal");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header Architecture */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
          <CreditCard size={12} /> Financial Core
        </div>
        <h1 className="text-5xl font-black text-primary italic tracking-tighter">
          Account <span className="text-accent2">Billing</span>
        </h1>
        <p className="text-slate-500 font-medium text-lg">
          Manage your subscription tier and unlock premium culinary
          intelligence.
        </p>
      </div>

      {loading && !status && (
        <div className="flex items-center gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100 text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">
          <Spinner size={20} color="#10b981" />
          Synchronizing Ledger...
        </div>
      )}

      {/* Current Subscription Hero */}
      {status && (
        <div className="relative overflow-hidden rounded-[3.5rem] bg-white border border-slate-100 p-10 md:p-14 shadow-2xl shadow-slate-200/50">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
            <div className="space-y-6">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-primary rounded-[1.5rem] text-white flex items-center justify-center shadow-xl shadow-primary/20">
                  <ShieldCheck size={32} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] leading-none mb-2">
                    Current Active Tier
                  </p>
                  <h2 className="text-3xl font-black text-primary uppercase italic tracking-tighter">
                    {status.plan || "Free Member"}
                  </h2>
                </div>
              </div>

              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-600 text-sm font-bold">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Status:{" "}
                  <span className="text-primary uppercase ml-1">
                    {status.status}
                  </span>
                </div>
                {status.current_period_end && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-600 text-sm font-bold">
                    <Calendar size={16} className="text-accent2" />
                    Renewal:{" "}
                    <span className="text-primary ml-1">
                      {new Date(status.current_period_end).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {(status.status === "active" || status.status === "trialing") && (
              <button
                className="group px-8 h-14 rounded-2xl border-2 border-slate-100 text-slate-400 font-black uppercase tracking-widest text-[10px] hover:border-rose-200 hover:text-rose-500 hover:bg-rose-50 transition-all duration-300 active:scale-95"
                onClick={onCancelRenew}
              >
                Cancel Auto-Renew
              </button>
            )}
          </div>

          {/* Decorative Gradient Flare */}
          <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-accent2/5 blur-[100px] rounded-full pointer-events-none" />
        </div>
      )}

      {/* Available Plans Grid */}
      <div className="space-y-8">
        <div className="flex items-center gap-4 text-primary">
          <div className="w-12 h-12 bg-accent2/10 rounded-2xl flex items-center justify-center text-accent2">
            <Zap size={24} />
          </div>
          <h2 className="text-2xl font-black uppercase italic tracking-tighter">
            Upgrade your{" "}
            <span className="text-accent2">Kitchen Intelligence</span>
          </h2>
        </div>

        {/* Referral code input */}
        <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm">
          <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
            Referral Code (optional)
          </label>
          <input
            type="text"
            value={referral}
            onChange={(e) => setReferral(e.target.value)}
            onBlur={() => setReferralCode(referral.trim() || null)}
            placeholder="Enter code from your influencer"
            className="w-full h-12 px-4 rounded-2xl border border-slate-200 focus:border-primary outline-none"
          />
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-2">
            First 100 redemptions may unlock benefits on first bill or trial.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {plans?.map((p) => {
            const amount = (p.price_cents ?? 0) / 100;
            const currency = p.currency || "NGN";
            const nf = new Intl.NumberFormat(undefined, {
              style: "currency",
              currency,
              minimumFractionDigits: 0,
            });

            const isDiscounted = p.discounted;
            const finalPrice = isDiscounted
              ? p.discounted_price_cents! / 100
              : amount;

            return (
              <div
                key={p.plan}
                className="group relative flex flex-col p-10 rounded-[3rem] bg-white border border-slate-100 hover:border-accent2/30 transition-all duration-500 hover:-translate-y-3 shadow-sm hover:shadow-2xl hover:shadow-slate-200"
              >
                {isDiscounted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full bg-accent2 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-accent2/30 whitespace-nowrap">
                    Best Value Optimization
                  </div>
                )}

                <div className="mb-10">
                  <h3 className="text-xl font-black text-primary uppercase italic mb-2 tracking-tighter">
                    {p.display || p.plan}
                  </h3>
                  <div className="flex items-center gap-2 mb-4">
                    {(p.plan === "quarterly") && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-accent2/10 text-accent2 text-[10px] font-black uppercase tracking-widest">
                        Quarterly Discount
                      </span>
                    )}
                    {(p.plan === "biannual") && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-accent2/10 text-accent2 text-[10px] font-black uppercase tracking-widest">
                        Biannual Discount
                      </span>
                    )}
                    {(p.plan === "annual") && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
                        Best Value
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-primary tracking-tighter">
                      {nf.format(finalPrice)}
                    </span>
                    <span className="text-slate-400 font-black text-[10px] uppercase tracking-widest">
                      / Period
                    </span>
                  </div>
                  {isDiscounted && (
                    <div className="mt-2 inline-block px-2 py-1 rounded bg-rose-50 text-rose-500 text-[10px] font-black line-through">
                      Was {nf.format(amount)}
                    </div>
                  )}
                </div>

                <ul className="space-y-5 mb-12 flex-1">
                  {[
                    "AI Chat Assistant",
                    "Dietician Guidance",
                    "Nutritionist Insights",
                    "AI Meal Planner",
                  ].map((feat) => (
                    <li
                      key={feat}
                      className="flex items-start gap-3 text-slate-500 text-sm font-semibold leading-tight"
                    >
                      <CheckCircle2
                        size={18}
                        className="text-accent2 flex-shrink-0 mt-0.5"
                      />
                      {feat}
                    </li>
                  ))}
                </ul>

                <button
                  className="w-full h-16 rounded-[1.5rem] bg-primary text-white font-black uppercase tracking-widest text-xs hover:bg-primary/90 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-primary/20 active:scale-95"
                  onClick={() => {
                    setReferralCode(referral.trim() || null);
                    setSelectedPlan(p.plan);
                    setSelectedPrice(finalPrice);
                    setSelectedCurrency(currency);
                    setModalOpen(true);
                  }}
                >
                  Subscribe
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Security Footer */}
      <div className="flex flex-col items-center justify-center py-16 border-t border-slate-100 space-y-6">
        <div className="flex items-center gap-6 text-slate-300">
          <div className="flex items-center gap-2">
            <Lock size={16} />
            <p className="text-[10px] font-black uppercase tracking-[0.3em]">
              SSL Encrypted
            </p>
          </div>
          <div className="w-1 h-1 rounded-full bg-slate-200" />
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} />
            <p className="text-[10px] font-black uppercase tracking-[0.3em]">
              PCI Compliant
            </p>
          </div>
        </div>
        <p className="text-xs max-w-lg text-center text-slate-400 leading-relaxed font-medium">
          Culinary premium access is processed via encrypted gateways. All
          subscriptions are self-managed; you maintain full sovereignty over
          your billing cycle and can terminate renewal at any moment.
        </p>
      </div>

      <ConfirmCheckoutModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        plan={selectedPlan || "monthly"}
        priceMajor={selectedPrice}
        currency={selectedCurrency}
      />
    </div>
  );
}
