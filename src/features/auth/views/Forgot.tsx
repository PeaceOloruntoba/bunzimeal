import { useState } from "react";
import { useAuthStore } from "../authStore";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { toast } from "../../../utils/toast";
import { useNavigate, Link } from "react-router";
import { Mail, ArrowLeft, Send } from "lucide-react";

export default function Forgot() {
  const { forgot, loading } = useAuthStore();
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const onSubmit = async () => {
    try {
      await forgot({ email });
      toast.success("A reset code has been sent to your email.");
      useAuthStore.getState().setResetEmail(email);
      navigate("/reset-password");
    } catch {}
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary transition-colors mb-4"
        >
          <ArrowLeft size={16} /> Back to login
        </Link>
        <h1 className="text-3xl font-black text-primary tracking-tight">
          Reset Password
        </h1>
        <p className="text-slate-500 font-medium">
          Enter your email and we'll send you a recovery code.
        </p>
      </div>

      <div className="grid gap-4">
        <Input
          leftIcon={<Mail size={18} />}
          placeholder="Email address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button
          loading={loading}
          disabled={!email}
          onClick={onSubmit}
        >
          <Send size={18} />
          <span>Send Reset Code</span>
        </Button>
      </div>
    </div>
  );
}
