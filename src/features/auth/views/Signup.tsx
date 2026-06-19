import { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router";
import { toast } from "../../../utils/toast";
import { useAuthStore } from "../authStore";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import GoalSelector from "../../../components/GoalSelector";
import {
  User,
  Mail,
  Lock,
  Globe,
  ArrowRight,
  Sparkles,
  ChevronDown,
} from "lucide-react";

export default function Signup() {
  const nav = useNavigate();
  const location = useLocation();
  const { register, countries, token, hydrated, bootstrap } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [countryId, setCountryId] = useState<number | null>(null);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [referral, setReferral] = useState("");
  const [registering, setRegistering] = useState(false);

  // Initialize hydration if not done
  useEffect(() => {
    if (!hydrated) bootstrap();
  }, [hydrated]);

  // Redirect if already logged in
  useEffect(() => {
    if (token && hydrated) {
      nav("/app/dashboard", { replace: true });
    }
  }, [token, hydrated, nav]);

  // Prefill referral from URL ?referralId=CODE
  useEffect(() => {
    try {
      const params = new URLSearchParams(location.search);
      const ref = params.get("referralId") || params.get("ref") || "";
      if (ref) setReferral(ref);
    } catch {}
  }, [location.search]);

  const onRegister = async () => {
    if (!countryId) {
      toast.error("Please select your country");
      return;
    }
    setRegistering(true);
    try {
      const res = await register({
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        country_id: countryId,
        referral_code: referral.trim() || undefined,
      });

      if (selectedGoals?.length) {
        await useAuthStore
          .getState()
          .setGoals(selectedGoals)
          .catch(() => {});
      }

      toast.success("Account created! Check your email for an OTP.");
      if (res?.otp) toast.info(`OTP (Dev): ${res.otp}`);

      useAuthStore.getState().setVerifyEmail(email);
      nav("/verify-otp");
    } catch (err) {
      // Handled by store
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <h1 className="text-4xl font-black text-primary tracking-tighter italic uppercase flex items-center gap-2">
          Start Fresh <Sparkles className="text-accent-2" size={28} />
        </h1>
        <p className="text-slate-500 font-medium leading-relaxed">
          Create your BunziMeal account and personalize your nutrition journey.
        </p>
      </div>

      <div className="grid gap-5 max-h-[65vh] overflow-y-auto pr-3 custom-scrollbar px-1">
        {/* Names Row */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            leftIcon={<User size={16} />}
            placeholder="Kunle"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <Input
            label="Last Name"
            placeholder="Afolayan"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        {/* Email */}
        <Input
          label="Email Address"
          leftIcon={<Mail size={16} />}
          placeholder="you@example.com"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Referral Code (optional) */}
        <Input
          label="Referral Code (optional)"
          placeholder="ABC1234"
          value={referral}
          onChange={(e) => setReferral(e.target.value)}
        />

        {/* Password */}
        <Input
          label="Security"
          leftIcon={<Lock size={16} />}
          placeholder="Create a strong password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Country Select */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
            Location
          </label>
          <div className="relative group">
            <Globe
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-accent-2 transition-colors"
              size={16}
            />
            <select
              className="w-full h-14 rounded-2xl border border-slate-200 bg-slate-50/50 px-11 text-sm text-primary font-bold appearance-none outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all cursor-pointer"
              value={countryId || ""}
              onChange={(e) =>
                setCountryId(e.target.value ? Number(e.target.value) : null)
              }
            >
              <option value="">Select Country</option>
              {countries.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300"
              size={16}
            />
          </div>
        </div>

        {/* Goal Selector */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-accent-2 ml-1">
            What are your goals?
          </label>
          <div className="bg-slate-50 rounded-2xl p-4 border-2 border-dashed border-slate-200">
            <GoalSelector value={selectedGoals} onChange={setSelectedGoals} />
          </div>
        </div>
      </div>

      <div className="pt-2">
        <Button
          loading={registering}
          disabled={!email || !password || !firstName || !countryId}
          onClick={onRegister}
        >
          <span>Create Account</span>
          <ArrowRight size={20} strokeWidth={3} />
        </Button>
      </div>

      <div className="text-center pb-4">
        <p className="text-sm font-bold text-slate-400">
          Already a member?{" "}
          <Link
            to="/login"
            className="text-accent-2 hover:text-accent transition-colors underline decoration-accent-2/20 underline-offset-4"
          >
            Sign in
          </Link>
        </p>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: #e2e8f0; 
          border-radius: 20px; 
        }
      `}</style>
    </div>
  );
}
