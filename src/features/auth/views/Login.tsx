import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import { toast } from "../../../utils/toast";
import { useAuthStore } from "../authStore";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { ArrowRight, Lock, Mail } from "lucide-react";

export default function Login() {
  const nav = useNavigate();
  const {
    login,
    error,
    clearError,
    token,
    hydrated,
    bootstrap,
    loading,
    user,
  } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!hydrated) bootstrap();
  }, [hydrated]);

  useEffect(() => {
    if (token && hydrated) {
      if (user?.role === "admin") nav("/admin/dashboard", { replace: true });
      else nav("/app/dashboard", { replace: true });
    }
  }, [token, hydrated, user?.role, nav]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error]);

  const handleLogin = async (e?: React.FormEvent) => {
    e?.preventDefault();
    clearError();
    try {
      await login({ email, password });
      toast.success("Logged in successfully");
    } catch (e: any) {
      const status = e?.response?.status;
      const msg = e?.response?.data?.errorMessage || e?.response?.data?.error;
      if (status === 403 && /verify/i.test(String(msg || ""))) {
        try {
          await useAuthStore.getState().resendOtp({ email, purpose: "verify" });
        } catch {}
        useAuthStore.getState().setVerifyEmail(email);
        toast.info("Please verify your email.");
        nav("/verify-otp");
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <h1 className="text-4xl font-black text-primary tracking-tighter italic uppercase">
          Welcome back
        </h1>
        <p className="text-slate-500 font-medium">
          Log in to manage your kitchen architecture.
        </p>
      </div>

      <form onSubmit={handleLogin} className="grid gap-4">
        <Input
          label="Email Address"
          leftIcon={<Mail size={16} />}
          placeholder="Email address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          label="Password"
          leftIcon={<Lock size={16} />}
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          type="submit"
          loading={loading}
          disabled={!email || !password}
          className="mt-2"
        >
          <span>Sign in</span>
          <ArrowRight size={20} strokeWidth={3} />
        </Button>
      </form>

      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
          <Link
            to="/signup"
            className="text-accent-2 hover:text-accent transition-colors"
          >
            Create account
          </Link>
          <Link
            to="/forgot-password"
            className="text-slate-400 hover:text-primary transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <div className="pt-8 border-t border-slate-100 grid grid-cols-3 gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400 text-center">
          <Link
            to="/privacy-policy"
            className="hover:text-primary transition-colors"
          >
            Privacy
          </Link>
          <Link
            to="/terms-and-conditions"
            className="hover:text-primary transition-colors"
          >
            Terms
          </Link>
          <Link
            to="/refund-policy"
            className="hover:text-primary transition-colors"
          >
            Refunds
          </Link>
        </div>
      </div>
    </div>
  );
}
