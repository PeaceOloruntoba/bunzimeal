import { useState } from "react";
import { http } from "../../../config/api";
// import { useAuthStore } from "../../auth/authStore";
import { Spinner } from "../../../components/Spinner";
import { CheckCircle } from "lucide-react";

export default function AffiliateApply() {
  // const { user } = useAuthStore();
  const [pitch, setPitch] = useState("");
  const [links, setLinks] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload: any = { pitch, social_links: links ? { links } : undefined };
      await http.post(`/referrals/request`, payload);
      setDone(true);
    } catch (e: any) {
      const msg = e?.response?.data?.error || e?.response?.data?.errorMessage || "Failed to submit request";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <h1 className="text-4xl font-black text-primary tracking-tighter italic uppercase">
          Affiliate <span className="text-accent2">Program</span>
        </h1>
        <p className="text-slate-500 font-medium">
          Apply to become an ambassador. Admin will review and approve.
        </p>
      </div>

      {done ? (
        <div className="rounded-3xl bg-green-50 border border-green-200 p-6 flex items-center gap-3">
          <CheckCircle className="text-green-600" size={20} />
          <div className="text-sm text-green-700 font-medium">
            Request submitted! You&apos;ll receive your unique referral code if approved.
          </div>
        </div>
      ) : (
        <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm space-y-6">
          {error ? <div className="text-sm text-rose-600">{error}</div> : null}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500">Pitch</label>
            <textarea
              value={pitch}
              onChange={(e) => setPitch(e.target.value)}
              className="w-full h-28 px-4 py-3 rounded-2xl border border-slate-200 focus:border-primary outline-none"
              placeholder="Tell us about your audience and why you&apos;d like to be an affiliate"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500">Links</label>
            <input
              value={links}
              onChange={(e) => setLinks(e.target.value)}
              className="w-full h-12 px-4 rounded-2xl border border-slate-200 focus:border-primary outline-none"
              placeholder="Social or website links"
            />
          </div>
          <button
            disabled={loading}
            onClick={submit}
            className="h-12 px-6 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-[10px] hover:bg-primary/90 transition disabled:opacity-50"
          >
            {loading ? <Spinner size={16} color="#ffffff" /> : "Submit Request"}
          </button>
        </div>
      )}
    </div>
  );
}
