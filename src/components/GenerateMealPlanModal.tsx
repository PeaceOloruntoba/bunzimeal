import React, { useState, useEffect } from "react";
import { X, Sparkles, Wallet, Clock, MessageSquare, Zap, AlertCircle } from "lucide-react";
import { Spinner } from "./Spinner";

export default function GenerateMealPlanModal({
  isOpen,
  onClose,
  onGenerate,
  defaultPrompt,
}: {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (payload: {
    prompt: string;
    budget?: string;
    maxPrepMinutes?: number;
  }) => Promise<void>;
  defaultPrompt?: string;
}) {
  const [prompt, setPrompt] = useState(defaultPrompt || "");
  const [budget, setBudget] = useState("");
  const [maxPrep, setMaxPrep] = useState<number | undefined>(30);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (defaultPrompt) setPrompt(defaultPrompt);
  }, [defaultPrompt]);

  if (!isOpen) return null;

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    setError(null);
    const trimmed = (prompt || "").trim();
    if (!trimmed) {
      setError("Please provide some instructions for the AI.");
      return;
    }
    setSubmitting(true);
    try {
      await onGenerate({
        prompt: trimmed,
        budget: budget.trim() || undefined,
        maxPrepMinutes: maxPrep,
      });
      onClose();
    } catch (e: any) {
      setError(e?.message || "Generation failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/20 backdrop-blur-md animate-in fade-in duration-300">
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-2xl bg-white border border-slate-100 rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
      >
        <div className="h-2 w-full bg-gradient-to-r from-primary via-accent-2 to-accent" />

        <div className="p-8 md:p-12 space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent-2 text-white rounded-2xl shadow-lg shadow-accent-2/20">
                <Sparkles size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-primary uppercase italic tracking-tighter">
                  Plan <span className="text-accent-2">Architect</span>
                </h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                  AI-Powered Nutrition Strategy
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-300 hover:text-primary transition-colors bg-slate-50 rounded-full"
            >
              <X size={24} />
            </button>
          </div>

          <p className="text-sm font-medium text-slate-500 leading-relaxed">
            Specify your preferences below. Our AI will synthesize a 7-day
            nutritional schedule tailored to your budget and available prep
            time.
          </p>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest ml-1">
                <MessageSquare size={12} className="text-accent-2" />
                Instructions & Cravings
              </label>
              <textarea
                className="w-full h-32 rounded-2xl bg-slate-50 border border-slate-200 px-5 py-4 text-primary font-medium placeholder:text-slate-300 focus:outline-none focus:border-accent-2 focus:ring-4 focus:ring-accent-2/5 transition-all resize-none shadow-inner"
                placeholder="e.g., 7-day high-protein dinners, focused on local Nigerian ingredients..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={submitting}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  <Wallet size={12} className="text-accent-2" />
                  Weekly Budget
                </label>
                <input
                  className="w-full h-12 rounded-xl bg-white border border-slate-200 px-4 text-primary font-bold placeholder:text-slate-300 focus:outline-none focus:border-accent-2 focus:ring-4 focus:ring-accent-2/5 transition-all"
                  placeholder="e.g., ₦25,000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  disabled={submitting}
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  <Clock size={12} className="text-accent-2" />
                  Max Prep (Min)
                </label>
                <input
                  type="number"
                  min={5}
                  className="w-full h-12 rounded-xl bg-white border border-slate-200 px-4 text-primary font-bold focus:outline-none focus:border-accent-2 focus:ring-4 focus:ring-accent-2/5 transition-all"
                  placeholder="30"
                  value={maxPrep ?? ""}
                  onChange={(e) => setMaxPrep(e.target.value ? Number(e.target.value) : undefined)}
                  disabled={submitting}
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold animate-in slide-in-from-top-1">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-4 rounded-2xl bg-slate-50 text-slate-400 font-black uppercase tracking-widest text-xs hover:bg-slate-100 hover:text-slate-600 transition-all order-2 sm:order-1"
              >
                Go Back
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-[2] py-4 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-xs hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50 order-1 sm:order-2"
              >
                {submitting ? (
                  <Spinner size={20} color="white" />
                ) : (
                  <>
                    <Zap size={18} strokeWidth={2.5} />
                    <span>Initialize Architect</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
