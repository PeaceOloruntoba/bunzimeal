import { useMemo, useState } from "react";
import {
  MessageCircle,
  X,
  Clock,
  Send,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { useAuthStore } from "../features/auth/authStore";

export default function SupportContact() {
  const { user } = useAuthStore();
  const [open, setOpen] = useState(false);

  const text = useMemo(() => {
    const email = user?.email || "";
    const base = `Good day, my Bunzi email is: ${email} - `;
    const tail = `[Describe your issue here]`;
    return encodeURIComponent(`${base}${tail}`);
  }, [user?.email]);

  const waHref = `https://wa.me/+2348166846226?text=${text}`;

  return (
    <>
      {/* Floating Action Button */}
      <button
        aria-label="Contact Support"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-2xl bg-primary text-white shadow-xl shadow-primary/20 hover:scale-110 active:scale-95 transition-all flex items-center justify-center group"
      >
        <MessageCircle
          size={28}
          strokeWidth={2}
          className="group-hover:rotate-12 transition-transform"
        />
        {/* Active Indicator */}
        <div className="absolute top-0 right-0 w-4 h-4 bg-accent border-4 border-white rounded-full" />
      </button>

      {/* Modal Overlay */}
      <div
        className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-primary/20 backdrop-blur-md"
          onClick={() => setOpen(false)}
        />

        {/* Support Card */}
        <div
          className={`relative w-full max-w-md bg-white border border-slate-100 rounded-[2.5rem] shadow-2xl overflow-hidden transition-all duration-300 ${
            open ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
          }`}
          role="dialog"
        >
          {/* Brand Accent Header */}
          <div className="h-2 w-full bg-gradient-to-r from-primary via-accent-2 to-accent" />

          <div className="p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                  <ShieldCheck className="text-accent-2" size={20} />
                </div>
                <h2 className="text-xl font-black text-primary uppercase italic tracking-tighter">
                  Bunzi <span className="text-accent-2">Concierge</span>
                </h2>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-2 text-slate-300 hover:text-primary transition-colors hover:bg-slate-50 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5">
              <p className="text-sm font-medium text-slate-500 leading-relaxed">
                Need help with your meal plan or account? Our support team is
                standing by to ensure your experience is seamless.
              </p>

              {/* Response Time Badge */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="bg-white p-2 rounded-lg shadow-sm">
                  <Clock className="text-accent-2" size={18} />
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest">
                  <span className="text-slate-400 block mb-0.5">
                    Typical Response
                  </span>
                  <span className="text-primary text-xs">Under 6 Hours</span>
                </div>
              </div>

              {/* Message Preview */}
              <div className="space-y-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Drafting your request
                </span>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 font-medium text-[11px] text-slate-600 break-words leading-relaxed italic">
                  "Good day, my email is{" "}
                  <span className="text-primary font-bold">
                    {user?.email || "user@example.com"}
                  </span>{" "}
                  — I need help with..."
                </div>
              </div>

              {/* Action Button */}
              <a
                href={waHref}
                target="_blank"
                rel="noreferrer"
                className="w-full h-14 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-xs hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-3 group"
              >
                <Send size={16} strokeWidth={2.5} />
                Open WhatsApp Chat
                <ExternalLink
                  size={12}
                  className="opacity-50 group-hover:translate-x-1 transition-transform"
                />
              </a>

              <p className="text-center text-[9px] text-slate-300 font-black uppercase tracking-[0.2em]">
                Verified Support Line
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
