import { useState } from "react";
import { useAuthStore } from "../authStore";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { toast } from "../../../utils/toast";
import { useNavigate } from "react-router";
import { Lock, Hash, Mail, ShieldCheck } from "lucide-react";

export default function Reset() {
  const { reset, loading, resetEmail } = useAuthStore();
  const [email, setEmail] = useState(resetEmail || "");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const onSubmit = async () => {
    try {
      await reset({ email, code, password });
      toast.success("Password updated. You can sign in now.");
      navigate("/login");
    } catch {}
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-primary tracking-tight">
          Create New Password
        </h1>
        <p className="text-slate-500 font-medium">
          Enter the code sent to your email and your new password.
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

        <Input
          leftIcon={<Hash size={18} />}
          placeholder="Reset Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <Input
          leftIcon={<Lock size={18} />}
          placeholder="New password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          loading={loading}
          disabled={!code || !password}
          onClick={onSubmit}
        >
          <ShieldCheck size={20} />
          <span>Update Password</span>
        </Button>
      </div>
    </div>
  );
}
