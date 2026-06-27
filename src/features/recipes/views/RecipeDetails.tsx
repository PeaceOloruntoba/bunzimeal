import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useRecipesStore } from "../recipesStore";
import { Spinner } from "../../../components/Spinner";
import {
  ArrowLeft,
  Clock,
  Flame,
  ChefHat,
  ListChecks,
  Beef,
  Wheat,
  Droplets,
  Bookmark,
  Share2,
} from "lucide-react";

export default function RecipeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    current,
    loading: recipeLoading,
    error: recipeError,
    get,
  } = useRecipesStore();

  useEffect(() => {
    if (id) {
      get(id);
    }
  }, [id, get]);

  const nutrition = current?.full_nutrition;
  const isLoading = recipeLoading;

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <Spinner size={48} color="#10b981" />
        <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">
          Reviewing Culinary Instructions...
        </p>
      </div>
    );

  if (recipeError || !current)
    return (
      <div className="max-w-2xl mx-auto mt-20 text-center py-24 rounded-[3rem] border-2 border-dashed border-slate-100 bg-slate-50/50">
        <h3 className="text-primary font-black text-2xl uppercase italic tracking-tighter">
          {recipeError || "Recipe logic not found"}
        </h3>
        <button
          onClick={() => navigate(-1)}
          className="mt-6 px-8 py-3 bg-primary text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
        >
          Return to Library
        </button>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Navigation & Actions */}
      <div className="flex items-center justify-between">
        <button
          className="flex items-center gap-3 text-slate-400 hover:text-primary font-black uppercase tracking-widest text-[10px] transition-all group"
          onClick={() => navigate(-1)}
        >
          <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
            <ArrowLeft size={16} />
          </div>
          Back to Recipes
        </button>
        <div className="flex gap-2">
          <button className="p-3 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-accent2 transition-all shadow-sm">
            <Bookmark size={20} />
          </button>
          <button className="p-3 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-accent2 transition-all shadow-sm">
            <Share2 size={20} />
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Main Content Card */}
        <div className="lg:col-span-8 space-y-10">
          <div className="relative rounded-[3.5rem] overflow-hidden bg-white border border-slate-100 shadow-2xl shadow-slate-200/50">
            <div className="h-[450px] relative">
              {current.image_url ? (
                <img
                  src={current.image_url}
                  alt={current.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                  <ChefHat className="text-slate-200" size={80} />
                </div>
              )}
              {/* Refined gradient for light text overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute bottom-10 left-10 right-10">
                <span className="px-4 py-1.5 rounded-xl bg-accent2 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-accent2/20">
                  {current.category || "Gourmet"}
                </span>
                <h1 className="text-6xl font-black text-white tracking-tighter mt-6 uppercase italic leading-[0.9]">
                  {current.name}
                </h1>
              </div>
            </div>

            <div className="p-10 md:p-14 space-y-12">
              {current.description && (
                <div className="relative">
                  <div className="absolute -left-6 top-0 bottom-0 w-1.5 bg-accent2/20 rounded-full" />
                  <p className="text-slate-500 text-2xl leading-relaxed italic font-medium">
                    "{current.description}"
                  </p>
                </div>
              )}

              <div className="space-y-6">
                <div className="flex items-center gap-3 text-primary">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <ChefHat size={24} className="text-primary" />
                  </div>
                  <h2 className="text-2xl font-black uppercase tracking-tighter italic">
                    Cooking <span className="text-accent2">Process</span>
                  </h2>
                </div>

                <div
                  className="text-slate-600 prose prose-slate prose-lg max-w-none prose-p:leading-relaxed prose-li:font-medium prose-strong:text-primary prose-strong:font-black"
                  dangerouslySetInnerHTML={{
                    __html: current.details as string,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: Stats & Nutrition */}
        <div className="lg:col-span-4 space-y-8">
          {/* Meal Stats Card */}
          <div className="bg-white border border-slate-100 p-10 rounded-[3rem] shadow-xl shadow-slate-200/40 space-y-10">
            <div className="flex items-center justify-between border-b border-slate-50 pb-6">
              <h3 className="text-primary font-black uppercase tracking-widest text-[11px]">
                Meal Analysis
              </h3>
              <div className="w-2 h-2 rounded-full bg-accent2 animate-pulse" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100 transition-colors hover:bg-white hover:border-accent2/20">
                <Clock className="text-accent2 mb-3" size={24} />
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  Duration
                </p>
                <p className="text-primary font-black text-lg">
                  {current.time_taken ?? "25 MIN"}
                </p>
              </div>
              <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100 transition-colors hover:bg-white hover:border-accent2/20">
                <Flame className="text-orange-500 mb-3" size={24} />
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  Energy
                </p>
                <p className="text-primary font-black text-lg">
                  {nutrition?.calories ?? "450"}{" "}
                  <span className="text-[10px]">KCAL</span>
                </p>
              </div>
            </div>

            {/* Nutrition Macro Profile */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-slate-100" />
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                  Macro Profile
                </p>
                <div className="h-px flex-1 bg-slate-100" />
              </div>

              <div className="space-y-6">
                <MacroBar
                  label="Protein"
                  value={nutrition?.protein_grams}
                  color="bg-primary"
                  icon={<Beef size={14} />}
                />
                <MacroBar
                  label="Carbohydrates"
                  value={nutrition?.carbs_grams}
                  color="bg-accent"
                  icon={<Wheat size={14} />}
                />
                <MacroBar
                  label="Essential Fats"
                  value={nutrition?.fat_grams}
                  color="bg-orange-400"
                  icon={<Droplets size={14} />}
                />
              </div>
            </div>
          </div>

          {/* Grocery Sync Card */}
          <div className="bg-primary text-white p-10 rounded-[3rem] shadow-xl shadow-primary/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-white/20 transition-all" />

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
                <ListChecks size={22} className="text-white" />
              </div>
              <h2 className="text-sm font-black uppercase tracking-widest">
                Pantry Sync
              </h2>
            </div>
            <p className="text-primary-foreground/80 text-sm font-medium leading-relaxed">
              All required ingredients are automatically synthesized into your
              digital shopping list when this meal is added to your active
              schedule.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MacroBar({ label, value, color, icon }: any) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
        <div className="flex items-center gap-2 text-slate-400">
          <span className="text-slate-300">{icon}</span>
          {label}
        </div>
        <span className="text-primary">{value ?? 0}g</span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
        <div
          className={`h-full transition-all duration-1000 ease-out rounded-full ${color}`}
          style={{ width: `${Math.min((value || 0) * 1.5, 100)}%` }}
        />
      </div>
    </div>
  );
}
