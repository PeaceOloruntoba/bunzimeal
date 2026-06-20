import { useEffect, useRef, useState } from "react";
import { useBillingStore } from "../billingStore";
import { useNavigate, useSearchParams } from "react-router";
import {
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Clock,
} from "lucide-react";

export default function Processing() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const refFromQuery = params.get("reference") || undefined;
  const { fetchStatus, status } = useBillingStore();
  const [tries, setTries] = useState(0);
  const [done, setDone] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    fetchStatus().catch(() => {});
    timerRef.current = window.setInterval(async () => {
      setTries((t) => t + 1);
      try {
        await fetchStatus();
      } catch {}
    }, 4000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [fetchStatus]);

  useEffect(() => {
    if (!status) return;
    if (status.status === "active") {
      if (timerRef.current) clearInterval(timerRef.current);
      setDone(true);
      setTimeout(() => nav("/app/billing", { replace: true }), 2500);
    }
    // Timeout after ~3 minutes (45 tries * 4s)
    if (tries > 45 && !done) {
      if (timerRef.current) clearInterval(timerRef.current);
      setDone(true);
    }
  }, [status, tries, done, nav]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-700">
      <div className="w-full max-w-lg bg-white border border-slate-100 rounded-[4rem] p-12 md:p-16 shadow-2xl shadow-slate-200 relative overflow-hidden text-center">
        {/* Organic Background Textures */}
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-primary/5 blur-[100px] rounded-full" />
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-accent2/5 blur-[100px] rounded-full" />

        <div className="relative z-10 space-y-10">
          {/* Visual State Indicator */}
          <div className="flex justify-center">
            {!done ? (
              <div className="relative">
                {/* Harmonic Pulse Layer */}
                <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full animate-pulse scale-150" />
                <div className="relative w-28 h-28 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center shadow-inner">
                  <RefreshCw
                    size={36}
                    className="text-primary animate-spin-slow"
                  />
                </div>
              </div>
            ) : status?.status === "active" ? (
              <div className="w-28 h-28 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-emerald-200 animate-bounce">
                <ShieldCheck
                  size={48}
                  className="text-white"
                  strokeWidth={2.5}
                />
              </div>
            ) : (
              <div className="w-28 h-28 bg-amber-50 rounded-[2.5rem] border border-amber-100 flex items-center justify-center shadow-lg shadow-amber-100">
                <AlertCircle size={48} className="text-amber-500" />
              </div>
            )}
          </div>

          {/* Core Messaging */}
          <div className="space-y-4">
            <h1 className="text-4xl font-black text-primary uppercase italic tracking-tighter">
              {!done
                ? "Securing Access"
                : status?.status === "active"
                ? "Verification Clear"
                : "Manual Audit Required"}
            </h1>

            {!done ? (
              <div className="space-y-4">
                <p className="text-slate-500 font-medium text-lg leading-relaxed">
                  We are currently synchronizing your credentials with the
                  payment network.
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-100">
                  <Clock size={14} className="text-slate-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Cycle {tries} of 45
                  </span>
                </div>
              </div>
            ) : status?.status === "active" ? (
              <p className="text-emerald-600 font-black uppercase tracking-[0.2em] text-sm italic">
                Transaction Validated. Welcome to Premium.
              </p>
            ) : (
              <p className="text-slate-500 font-medium">
                The banking gateway is responding slower than usual. Your
                features will unlock automatically once the signal clears.
              </p>
            )}
          </div>

          {refFromQuery && (
            <div className="py-4 px-8 rounded-3xl bg-slate-50 border border-slate-100 inline-block mx-auto group hover:border-accent2/20 transition-colors">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] block mb-2">
                Network Reference Hash
              </span>
              <code className="text-[11px] text-primary font-mono bg-white px-3 py-1 rounded-lg border border-slate-100 shadow-sm break-all">
                {refFromQuery}
              </code>
            </div>
          )}

          {/* Action Architecture */}
          <div className="pt-6 space-y-4">
            <button
              className="w-full h-16 rounded-[1.5rem] bg-primary text-white font-black uppercase tracking-widest text-xs hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 active:scale-95 flex items-center justify-center gap-3"
              onClick={() => nav("/app/billing", { replace: true })}
            >
              <span>{done ? "Return to Dashboard" : "Exit to Billing"}</span>
              <ArrowRight
                size={20}
                strokeWidth={3}
                className={done ? "animate-bounce-x" : ""}
              />
            </button>

            {!done && (
              <div className="flex items-center justify-center gap-2 text-rose-400">
                <div className="w-1 h-1 rounded-full bg-rose-400 animate-ping" />
                <p className="text-[10px] font-black uppercase tracking-widest">
                  Maintain active connection — Do not refresh
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
