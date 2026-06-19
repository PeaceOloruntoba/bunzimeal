import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router";
import { toast } from "../../../utils/toast";
import { useAuthStore } from "../authStore";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Mail, CheckCircle2, RefreshCw, UserPlus } from "lucide-react";

export default function Verify() {
  const nav = useNavigate();
  const { verifyEmail, verifyOtp, resendOtp, loading } = useAuthStore();
  const [email, setEmail] = useState(verifyEmail || "");
  const [code, setCode] = useState("");
  const [cooldown, setCooldown] = useState<number>(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (verifyEmail && !email) setEmail(verifyEmail);
  }, [verifyEmail, email]);

  const onVerify = async () => {
    if (!email || !code) return toast.error("Enter email and code");
    try {
      await verifyOtp({ email, code });
      toast.success("Account verified. You can sign in now.");
      nav("/login");
    } catch (e: any) {
      toast.error(e?.message || "Verification failed");
    }
  };

  const onResend = async () => {
    if (!email) return toast.error("Enter your email");
    try {
      await resendOtp({ email, purpose: "verify" });
      useAuthStore.getState().setVerifyEmail(email);
      toast.success("Verification code sent");
      setCooldown(60);
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = window.setInterval(() => {
        setCooldown((c) => {
          if (c <= 1) {
            if (timerRef.current) {
              window.clearInterval(timerRef.current);
              timerRef.current = null;
            }
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    } catch (e: any) {
      toast.error(e?.message || "Failed to resend code");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <h1 className="text-4xl font-black text-primary tracking-tighter italic uppercase">
          Verify Email
        </h1>
        <p className="text-slate-500 font-medium leading-relaxed">
          We've sent a 6-digit code to your inbox to keep your kitchen secure.
        </p>
      </div>

      <div className="grid gap-5">
        <Input
          label="Email Address"
          leftIcon={<Mail size={18} />}
          placeholder="Email address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
            Verification Code
          </label>
          <input
            className="w-full h-20 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/30 px-4 text-center text-4xl font-black tracking-[0.4em] text-primary placeholder:text-slate-200 focus:border-primary focus:border-solid focus:bg-white outline-none transition-all"
            placeholder="000000"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>

        <Button
          loading={loading}
          disabled={!code}
          onClick={onVerify}
        >
          <CheckCircle2 size={20} strokeWidth={3} />
          <span>Verify Account</span>
        </Button>

        <Button
          variant="secondary"
          disabled={loading || cooldown > 0}
          onClick={onResend}
        >
          <RefreshCw size={14} className={cooldown > 0 ? "animate-spin" : ""} />
          {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
        </Button>
      </div>

      {/* Footer Links */}
      <div className="flex flex-col gap-6 pt-6 border-t border-slate-100">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-black uppercase tracking-widest">
          <Link
            to="/signup"
            className="flex items-center gap-2 text-accent-2 hover:text-accent transition-colors"
          >
            <UserPlus size={14} /> New Account?
          </Link>
          <Link
            to="/login"
            className="text-slate-400 hover:text-primary transition-colors underline decoration-slate-200 underline-offset-4"
          >
            Back to Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
