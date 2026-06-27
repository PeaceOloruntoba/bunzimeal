import { useEffect } from "react";
import { useDashboardStore } from "../dashboardStore";
import { useAuthStore } from "../../auth/authStore";
import { Spinner } from "../../../components/Spinner";
import {
  Flame,
  Zap,
  Droplets,
  User,
  CalendarCheck,
  UtensilsCrossed,
  Plus,
  Calendar,
} from "lucide-react";
import { useNavigate } from "react-router";

export default function Dashboard() {
  const { totals, loading, error, fetchStreak, streak } = useDashboardStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  // const [period, setPeriod] = useState<"today" | "week" | "month">("today");

  useEffect(() => {
    fetchStreak();
  }, [fetchStreak]);

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent2/10 text-accent2 text-[10px] font-black uppercase tracking-widest">
            <CalendarCheck size={12} /> Your Nutrition Control Panel
          </div>
          <h1 className="text-5xl font-black text-primary italic tracking-tighter">
            Hey, <span className="text-accent2">{user?.first_name || "Chef"}</span>!
          </h1>
          <p className="text-slate-500 font-medium text-lg">
            Your daily nutrition overview and meal planning insights.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Streak Card */}
        <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/40 group hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-6">
            <div className="p-4 rounded-2xl bg-accent2/10 text-accent2">
              <Flame size={28} />
            </div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              STREAK
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-5xl font-black text-primary italic tracking-tighter">
              {streak || 0}
            </p>
            <p className="text-slate-500 font-medium">Days of consistency</p>
          </div>
        </div>

        {/* Calories Card */}
        <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/40 group hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-6">
            <div className="p-4 rounded-2xl bg-orange-50 text-orange-500">
              <Zap size={28} />
            </div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              CALORIES
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-5xl font-black text-primary italic tracking-tighter">
              {loading ? (
                <Spinner size={32} color="#1f444c" />
              ) : (
                totals?.calories || 0
              )}
            </p>
            <p className="text-slate-500 font-medium">Today's energy intake</p>
          </div>
        </div>

        {/* Protein Card */}
        <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/40 group hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-6">
            <div className="p-4 rounded-2xl bg-blue-50 text-blue-500">
              <Droplets size={28} />
            </div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              PROTEIN
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-5xl font-black text-primary italic tracking-tighter">
              {loading ? (
                <Spinner size={32} color="#1f444c" />
              ) : (
                totals?.protein_grams || 0
              )}
              <span className="text-2xl">g</span>
            </p>
            <p className="text-slate-500 font-medium">Muscle fuel</p>
          </div>
        </div>

        {/* Carbs Card */}
        <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/40 group hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-6">
            <div className="p-4 rounded-2xl bg-green-50 text-green-500">
              <UtensilsCrossed size={28} />
            </div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              CARBS
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-5xl font-black text-primary italic tracking-tighter">
              {loading ? (
                <Spinner size={32} color="#1f444c" />
              ) : (
                totals?.carbs_grams || 0
              )}
              <span className="text-2xl">g</span>
            </p>
            <p className="text-slate-500 font-medium">Energy source</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => navigate("/app/ai")}
          className="bg-primary text-white p-8 rounded-[2.5rem] shadow-xl shadow-primary/20 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group flex flex-col gap-4 text-left"
        >
          <div className="flex items-center justify-between">
            <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-md">
              <Calendar size={32} />
            </div>
            <Plus size={24} className="opacity-50 group-hover:opacity-100 transition-opacity" />
          </div>
          <div>
            <h3 className="text-xl font-black uppercase italic tracking-tighter">
              Generate Meal Plan
            </h3>
            <p className="text-white/80 font-medium mt-2">
              Create a custom nutrition plan with AI.
            </p>
          </div>
        </button>

        <button
          onClick={() => navigate("/app/recipes")}
          className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/40 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group flex flex-col gap-4 text-left"
        >
          <div className="flex items-center justify-between">
            <div className="p-4 rounded-2xl bg-accent2/10 text-accent2">
              <UtensilsCrossed size={32} />
            </div>
            <Plus size={24} className="text-slate-300 group-hover:text-accent2 transition-colors" />
          </div>
          <div>
            <h3 className="text-xl font-black text-primary uppercase italic tracking-tighter">
              Explore Recipes
            </h3>
            <p className="text-slate-500 font-medium mt-2">
              Discover delicious, nutritious meals.
            </p>
          </div>
        </button>

        <button
          onClick={() => navigate("/app/pantry")}
          className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/40 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group flex flex-col gap-4 text-left"
        >
          <div className="flex items-center justify-between">
            <div className="p-4 rounded-2xl bg-primary/10 text-primary">
              <User size={32} />
            </div>
            <Plus size={24} className="text-slate-300 group-hover:text-primary transition-colors" />
          </div>
          <div>
            <h3 className="text-xl font-black text-primary uppercase italic tracking-tighter">
              Manage Pantry
            </h3>
            <p className="text-slate-500 font-medium mt-2">
              Track your ingredients and inventory.
            </p>
          </div>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-5 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 font-bold flex items-center gap-4">
          <div className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
          {error}
        </div>
      )}
    </div>
  );
}
