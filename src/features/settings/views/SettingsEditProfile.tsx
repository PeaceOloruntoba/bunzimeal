import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import GoalSelector from "../../../components/GoalSelector";
import { useAuthStore } from "../../auth/authStore";
import { toast } from "../../../utils/toast";
import { Spinner } from "../../../components/Spinner";
import { Globe, Target, Save, X, ArrowLeft } from "lucide-react";
import { useProfileStore } from "../../profile/profileStore";

export default function SettingsEditProfile() {
  const navigate = useNavigate();
  const { user, setGoals, countries, fetchCountries } = useAuthStore();
  const { updateCountry } = useProfileStore();

  const [saving, setSaving] = useState(false);
  const [goals, setLocalGoals] = useState<string[]>([]);
  const [countryId, setCountryId] = useState<number | string>("");

  useEffect(() => {
    (async () => {
      try {
        await Promise.all([
          useAuthStore
            .getState()
            .fetchGoalKeys()
            .catch(() => []),
          useAuthStore.getState().fetchMe(),
          fetchCountries(),
        ]);

        const current = useAuthStore.getState().user;
        const profile = (current as any)?.profile || {};
        const maybeGoals =
          profile?.health_goals || profile?.preferences?.goals || [];

        if (Array.isArray(maybeGoals)) setLocalGoals(maybeGoals);
        if (current?.country_id) setCountryId(current.country_id);
      } catch (e) {
        // ignore
      }
    })();
  }, [fetchCountries]);

  useEffect(() => {
    if (!user) navigate("/app/settings", { replace: true });
  }, [navigate, user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (!countryId) {
        toast.error("Please select a country");
        setSaving(false);
        return;
      }

      const numericCountryId =
        typeof countryId === "string" ? Number(countryId) : countryId;

      await Promise.all([setGoals(goals), updateCountry(numericCountryId)]);

      await useAuthStore.getState().fetchMe();
      toast.success("Profile updated successfully");
      navigate("/app/settings");
    } catch (e) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/app/settings")}
          className="flex items-center gap-2 text-slate-400 hover:text-primary font-black uppercase tracking-widest text-[10px] transition-all group"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to Overview
        </button>
      </div>

      <div className="space-y-3">
        <h1 className="text-5xl font-black text-primary tracking-tighter uppercase italic">
          Edit <span className="text-accent2">Profile</span>
        </h1>
        <p className="text-slate-500 font-medium text-lg">
          Adjust your regional parameters and optimization objectives.
        </p>
      </div>

      {/* Main Configuration Interface */}
      <div className="space-y-8">
        {/* Location Settings Card */}
        <div className="bg-white border border-slate-100 rounded-[3.5rem] p-10 shadow-2xl shadow-slate-200/50">
          <div className="flex items-center gap-4 text-primary mb-8">
            <div className="p-3 bg-primary/5 rounded-2xl">
              <Globe size={24} />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tighter italic">
              Regional <span className="text-accent2">Settings</span>
            </h3>
          </div>

          <div className="space-y-3 max-w-md">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-[0.2em]">
              Primary Territory
            </label>
            <div className="relative">
              <select
                value={countryId}
                onChange={(e) =>
                  setCountryId(e.target.value ? Number(e.target.value) : "")
                }
                className="w-full h-16 px-6 rounded-2xl bg-slate-50 border border-slate-100 text-primary font-bold focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all appearance-none cursor-pointer"
              >
                <option value="" disabled className="text-slate-400">
                  Select your country
                </option>
                {countries.map((c: any) => (
                  <option
                    key={c.id}
                    value={c.id}
                    className="text-primary font-medium"
                  >
                    {c.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <Globe size={18} />
              </div>
            </div>
          </div>
        </div>

        {/* Goals & Objectives Card */}
        <div className="bg-white border border-slate-100 rounded-[3.5rem] p-10 shadow-2xl shadow-slate-200/50">
          <div className="flex items-center gap-4 text-primary mb-8">
            <div className="p-3 bg-accent2/5 rounded-2xl text-accent2">
              <Target size={24} />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tighter italic">
              Health <span className="text-accent2">Objectives</span>
            </h3>
          </div>

          <div className="p-4 bg-slate-50 rounded-[2.5rem] border border-slate-100 shadow-inner">
            <GoalSelector value={goals} onChange={setLocalGoals} />
          </div>

          <div className="mt-6 flex items-start gap-3 px-2">
            <div className="w-1.5 h-1.5 rounded-full bg-accent2 mt-1.5 animate-pulse" />
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Precision Goal Mapping allows BunziMeal AI to calibrate your daily
              caloric ceiling and macro-nutrient distribution with 98% accuracy.
            </p>
          </div>
        </div>

        {/* Action Orchestration */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <button
            className="flex-[2] h-16 rounded-[1.5rem] bg-primary text-white font-black uppercase tracking-widest text-xs hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 active:scale-95 flex items-center justify-center gap-3"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <Spinner size={20} color="#ffffff" />
            ) : (
              <>
                <Save size={20} strokeWidth={2.5} />
                <span>Save Configuration</span>
              </>
            )}
          </button>

          <button
            className="flex-1 h-16 rounded-[1.5rem] bg-white border border-slate-200 text-slate-400 font-black uppercase tracking-widest text-[10px] hover:bg-slate-50 hover:text-rose-500 hover:border-rose-100 transition-all flex items-center justify-center gap-2 active:scale-95"
            onClick={() => navigate("/app/settings")}
          >
            <X size={18} />
            Discard
          </button>
        </div>
      </div>
    </div>
  );
}
