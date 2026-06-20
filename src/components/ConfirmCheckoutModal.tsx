import { useEffect, useState } from "react";
import { Spinner } from "./Spinner";
import { useBillingStore } from "../features/billing/billingStore";
import { useExchangeStore } from "../features/billing/exchangeStore";
import {
  ShieldCheck,
  X,
  ArrowRightLeft,
  CreditCard,
  Info,
  ChevronRight,
} from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  plan: string;
  priceMajor: number;
  currency: string;
};

export function ConfirmCheckoutModal({
  isOpen,
  onClose,
  plan,
  priceMajor,
  currency,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [rateInfo, setRateInfo] = useState<{
    rate?: number;
    converted_major?: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkout = useBillingStore((s) => s.checkout);
  const storeLoading = useBillingStore((s) => s.loading);
  const getConversion = useExchangeStore((s) => s.getConversion);

  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const d = await getConversion(currency, priceMajor);
        setRateInfo({
          rate: d.rate || undefined,
          converted_major: d.converted_major || undefined,
        });
      } catch (e: any) {
        setError("Synchronizing market rates failed. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, [isOpen, currency, priceMajor, getConversion]);

  if (!isOpen) return null;

  const nf = (amt: number, curr: string) =>
    new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: curr,
    }).format(amt);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#020617]/90 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-[#0f172a] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header Decoration */}
        <div className="h-1.5 w-full bg-gradient-to-r from-primary/0 via-primary to-primary/0 opacity-50" />

        <div className="p-8 md:p-10 space-y-6">
          {/* Close & Title */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl border border-primary/20">
                <ShieldCheck className="text-primary" size={20} />
              </div>
              <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">
                Final <span className="text-primary">Authorization</span>
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-dark hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <p className="text-sm font-medium text-light">
            Confirming subscription to the{" "}
            <span className="text-white font-black uppercase italic tracking-tight">
              {plan} Plan
            </span>
            .
          </p>

          {/* Ledger / Conversion Card */}
          <div className="relative rounded-3xl bg-white/[0.02] border border-white/5 p-6 overflow-hidden">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-8 gap-4">
                <Spinner size={24} color="#10b981" />
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                  Syncing Ledger...
                </p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-4 text-rose-500 gap-2">
                <Info size={24} />
                <p className="text-xs font-bold text-center leading-relaxed">
                  {error}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-2 text-[10px] font-black uppercase underline tracking-widest"
                >
                  Retry Connection
                </button>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in duration-500">
                {/* Visual Flow */}
                <div className="flex items-center justify-between px-2">
                  <div className="text-center">
                    <p className="text-[10px] font-black text-dark uppercase tracking-widest mb-1">
                      Source
                    </p>
                    <div className="text-lg font-black text-white">
                      {nf(priceMajor, currency)}
                    </div>
                  </div>
                  <div className="h-px flex-1 mx-4 bg-white/10 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0f172a] p-1 border border-white/10 rounded-full">
                      <ArrowRightLeft size={12} className="text-primary" />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">
                      Total Due
                    </p>
                    <div className="text-lg font-black text-primary">
                      {rateInfo?.converted_major
                        ? nf(rateInfo.converted_major, "NGN")
                        : "—"}
                    </div>
                  </div>
                </div>

                {/* Meta Data */}
                <div className="pt-4 border-t border-white/5 space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <span className="text-dark">Live FX Rate</span>
                    <span className="text-white">
                      1 {currency} = {rateInfo?.rate ?? "—"} NGN
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <span className="text-dark">Gateway</span>
                    <span className="text-white">Secure Card Payment</span>
                  </div>
                </div>
              </div>
            )}
            {/* Background Texture */}
            <div className="absolute -bottom-4 -right-4 opacity-5 pointer-events-none">
              <CreditCard size={80} />
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10">
            <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
            <p className="text-[10px] text-light font-medium leading-relaxed">
              BunziMeal processes all local payments in{" "}
              <span className="text-white font-bold">Nigerian Naira (NGN)</span>{" "}
              using mid-market exchange rates. No hidden gateway fees apply.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              className="flex-1 h-14 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all"
              onClick={onClose}
            >
              Cancel Request
            </button>
            <button
              className="flex-[2] h-14 rounded-2xl bg-primary text-[#020617] font-black uppercase tracking-widest text-[10px] hover:bg-primary/10 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              onClick={async () => {
                if (loading || submitting || storeLoading) return;
                setSubmitting(true);
                try {
                  await checkout(plan as any, {
                    convert: true,
                    source_currency: currency,
                    source_amount: priceMajor,
                  });
                } catch (e) {
                  // Error handled by store
                } finally {
                  setSubmitting(false);
                }
              }}
              disabled={loading || submitting || storeLoading || !!error}
            >
              {submitting || storeLoading ? (
                <Spinner size={18} color="#020617" />
              ) : (
                <>
                  <span>Confirm & Authorize</span>
                  <ChevronRight size={16} strokeWidth={3} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
