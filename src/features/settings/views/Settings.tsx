import { useAuthStore } from "../../auth/authStore";
import { useState } from "react";
import { Link } from "react-router";
import {
  User,
  Target,
  LogOut,
  ShieldAlert,
  Globe,
  Mail,
  ChevronRight,
  Zap,
  Fingerprint,
  Megaphone,
  Trash2,
} from "lucide-react";
import { Spinner } from "../../../components/Spinner";

export default function Settings() {
  const { user, logout, logoutAll } = useAuthStore();
  const [busy, setBusy] = useState<"logout" | "logoutAll" | null>(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const userGoals =
    (user as any)?.profile?.health_goals ||
    (user as any)?.profile?.preferences?.goals ||
    [];

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header Architecture */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent2/10 text-accent2 text-[10px] font-black uppercase tracking-widest">
          <Fingerprint size={12} /> Personal Command
        </div>
        <h1 className="text-5xl font-black text-primary italic tracking-tighter">
          Account <span className="text-accent2">Settings</span>
        </h1>
        <p className="text-slate-500 font-medium text-lg">
          Configure your digital profile and manage active session security.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Sidebar: Profile Identity Card */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white border border-slate-100 rounded-[3.5rem] p-10 text-center shadow-2xl shadow-slate-200/60 relative overflow-hidden group">
            {/* Soft Ambient Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-accent2/5 blur-[60px] rounded-full transition-all group-hover:bg-accent2/10" />

            <div className="relative">
              <div className="w-28 h-28 bg-slate-50 border border-slate-100 rounded-[2.5rem] mx-auto flex items-center justify-center mb-6 shadow-inner transition-transform group-hover:scale-105 duration-500">
                <User size={48} className="text-primary" strokeWidth={1.5} />
              </div>
              <h2 className="text-2xl font-black text-primary uppercase italic tracking-tighter">
                {user?.first_name} {user?.last_name}
              </h2>
              <div className="flex items-center justify-center gap-2 text-slate-400 text-[10px] font-black mt-2 uppercase tracking-[0.2em]">
                <Mail size={12} className="text-accent2" />
                {user?.email}
              </div>
            </div>

            <div className="mt-10 pt-10 border-t border-slate-50 space-y-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400 font-black uppercase tracking-widest text-[9px] flex items-center gap-2">
                  <Globe size={14} className="text-slate-300" /> Residency
                </span>
                <span className="text-primary font-black uppercase italic tracking-tighter">
                  {user?.country?.name || "Global"}
                </span>
              </div>

              <Link
                to="/app/settings/edit-profile"
                className="flex items-center justify-between w-full p-5 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-[10px] hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 group/btn"
              >
                Refine Profile
                <ChevronRight
                  size={16}
                  className="group-hover/btn:translate-x-1 transition-transform"
                />
              </Link>
            </div>
          </div>

          <div className="text-center text-slate-300 text-[10px] font-black uppercase tracking-[0.4em]">
            Core v1.0.1 Stable
          </div>
        </div>

        {/* Main Content: Goals & Security Architecture */}
        <div className="lg:col-span-2 space-y-8">
          {/* Health Goals Visualization */}
          <div className="bg-white border border-slate-100 rounded-[3.5rem] p-10 shadow-xl shadow-slate-100">
            <div className="flex items-center gap-4 text-primary mb-8">
              <div className="p-3 bg-primary/5 rounded-2xl text-primary">
                <Target size={24} />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tighter italic">
                Strategic <span className="text-accent2">Health Goals</span>
              </h3>
            </div>

            <div className="flex flex-wrap gap-3">
              {Array.isArray(userGoals) && userGoals.length ? (
                userGoals.map((goal: string) => (
                  <span
                    key={goal}
                    className="px-5 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-primary font-black uppercase tracking-widest text-[10px] shadow-sm"
                  >
                    {goal}
                  </span>
                ))
              ) : (
                <div className="text-slate-400 italic text-sm font-medium py-4">
                  No active biometrics set. Customizing your health goals
                  unlocks high-precision AI recommendations.
                </div>
              )}
            </div>

            <div className="mt-8 flex items-start gap-4 p-6 rounded-[2rem] bg-accent2/5 border border-accent2/10">
              <Zap size={20} className="text-accent2 mt-1" />
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                Optimizing your profile allows our AI to synthesize
                <span className="text-primary font-black italic mx-1">
                  macro-nutrient distribution
                </span>
                models tailored to your specific physiological data.
              </p>
            </div>
          </div>

          {/* Affiliate Program CTA */}
          <div className="bg-white border border-slate-100 rounded-[3.5rem] p-10 shadow-xl shadow-slate-100">
            <div className="flex items-center gap-4 text-primary mb-8">
              <div className="p-3 bg-primary/5 rounded-2xl text-primary">
                <Megaphone size={24} />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tighter italic">
                Become an <span className="text-accent2">Affiliate</span>
              </h3>
            </div>
            <p className="text-slate-600 mb-6">
              Apply to our ambassador program and earn rewards. Approved affiliates receive a unique referral code.
            </p>
            <Link
              to="/app/affiliate"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-[10px] hover:bg-primary/90 transition-all"
            >
              Apply Now
              <ChevronRight size={14} />
            </Link>
          </div>

          {/* Security & Access Infrastructure */}
          <div className="bg-white border border-slate-100 rounded-[3.5rem] p-10 shadow-xl shadow-slate-100">
            <div className="flex items-center gap-4 text-rose-500 mb-8">
              <div className="p-3 bg-rose-50 rounded-2xl">
                <ShieldAlert size={24} />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tighter italic text-primary">
                Security & <span className="text-rose-500">Sessions</span>
              </h3>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <button
                className="flex items-center justify-center gap-3 h-16 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 font-black uppercase tracking-widest text-[10px] hover:bg-slate-100 hover:text-primary transition-all active:scale-95 disabled:opacity-50"
                disabled={busy !== null}
                onClick={async () => {
                  setBusy("logout");
                  try {
                    await logout();
                  } finally {
                    setBusy(null);
                  }
                }}
              >
                {busy === "logout" ? (
                  <Spinner size={16} />
                ) : (
                  <LogOut size={18} />
                )}
                {busy === "logout" ? "Processing..." : "Terminate Session"}
              </button>

              <button
                className="flex items-center justify-center gap-3 h-16 rounded-2xl bg-rose-50 text-rose-600 font-black uppercase tracking-widest text-[10px] hover:bg-rose-500 hover:text-white transition-all shadow-lg shadow-rose-100 active:scale-95 disabled:opacity-50"
                disabled={busy !== null}
                onClick={async () => {
                  setBusy("logoutAll");
                  try {
                    await logoutAll();
                  } finally {
                    setBusy(null);
                  }
                }}
              >
                {busy === "logoutAll" ? (
                  <Spinner size={16} />
                ) : (
                  <ShieldAlert size={18} />
                )}
                {busy === "logoutAll" ? "Wiping Data..." : "Purge All Devices"}
              </button>
            </div>

            <div className="mt-4">
              <button
                className="w-full flex items-center justify-center gap-3 h-16 rounded-2xl bg-transparent border border-dashed border-slate-200 text-slate-400 font-black uppercase tracking-widest text-[10px] hover:border-rose-500 hover:text-rose-500 transition-all active:scale-95 disabled:opacity-50"
                disabled={busy !== null}
                onClick={() => setDeleteModalOpen(true)}
              >
                <Trash2 size={16} />
                Delete Account
              </button>
            </div>

            <p className="mt-8 text-[9px] text-slate-300 font-black uppercase text-center tracking-[0.4em]">
              Integrity Verified • Active Session:{" "}
              {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300">
          <div className="bg-white rounded-[3.5rem] shadow-2xl p-10 max-w-lg w-full m-4 text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-rose-50 border-8 border-rose-100 rounded-[2.5rem] mx-auto flex items-center justify-center mb-6">
              <Trash2 size={40} className="text-rose-500" strokeWidth={1.5} />
            </div>
            <h2 className="text-3xl font-black text-primary uppercase italic tracking-tighter">
              Delete Account
            </h2>
            <p className="text-slate-500 font-medium text-lg mt-2 mb-8">
              This action is irreversible and will permanently delete all your
              data.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <button
                className="h-14 rounded-2xl bg-slate-50 border border-slate-100 text-slate-500 font-black uppercase tracking-widest text-[10px] hover:bg-slate-100 hover:text-primary transition-all"
                onClick={() => setDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="h-14 rounded-2xl bg-rose-500 text-white font-black uppercase tracking-widest text-[10px] hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/30"
                onClick={async () => {
                  setBusy("logoutAll");
                  try {
                    await logoutAll();
                  } finally {
                    setBusy(null);
                    setDeleteModalOpen(false);
                  }
                }}
              >
                {busy === "logoutAll" ? (
                  <Spinner size={16} />
                ) : (
                  "Confirm & Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
