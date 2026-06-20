import { useEffect, useState } from "react";
import { useNutritionStore } from "../nutritionStore";
import { useRecipesStore } from "../../recipes/recipesStore";
import { Spinner } from "../../../components/Spinner";
import {
  Search,
  Activity,
  Flame,
  Beef,
  Wheat,
  Droplets,
  Filter,
} from "lucide-react";

export default function Nutrition() {
  const { items, loading, error, fetch } = useNutritionStore();
  const [recipeId, setRecipeId] = useState<string>("");
  const { items: recipes, fetch: fetchRecipes } = useRecipesStore();

  const load = async () => {
    const rid = recipeId ? Number(recipeId) : undefined;
    await Promise.all([
      fetch(rid),
      recipes.length ? Promise.resolve() : fetchRecipes(),
    ]);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-white tracking-tighter">
            Nutrition <span className="text-primary">Insights</span>
          </h1>
          <p className="text-light font-medium">
            Detailed breakdown of your meal macros and energy.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2 w-full md:max-w-md group">
          <div className="relative flex-1">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-dark group-focus-within:text-primary transition-colors"
              size={18}
            />
            <input
              className="w-full h-12 pl-11 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-dark focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-2xl"
              placeholder="Enter Recipe ID..."
              value={recipeId}
              onChange={(e) => setRecipeId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && load()}
            />
          </div>
          <button
            className="h-12 px-6 rounded-xl bg-primary text-[#020617] font-black uppercase tracking-widest text-xs hover:bg-primary transition-all shadow-lg shadow-primary/20 active:scale-95"
            onClick={load}
          >
            Filter
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 font-bold flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          {error}
        </div>
      )}

      {/* Grid Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Spinner size={40} color="#10b981" />
          <p className="text-dark font-black uppercase tracking-widest text-[10px]">
            Calculating Macros...
          </p>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 rounded-[2rem] border-2 border-dashed border-white/5 bg-white/[0.01]">
          <Activity className="mx-auto text-dark mb-4" size={48} />
          <h3 className="text-white font-bold text-xl">
            No nutrition data found
          </h3>
          <p className="text-dark">
            Try a different recipe ID or clear the filter.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const recipe = recipes.find((r) => r.id === item.recipe_id);
            return (
              <div
                key={item.id}
                className="group p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-primary/30 transition-all duration-300 shadow-xl"
              >
                <div className="flex gap-4 mb-6">
                  {recipe?.image_url ? (
                    <img
                      src={recipe.image_url}
                      alt={recipe.name}
                      className="w-16 h-16 object-cover rounded-2xl border border-white/10"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-dark rounded-2xl flex items-center justify-center text-dark">
                      <Filter size={24} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">
                      Recipe #{item.recipe_id}
                    </p>
                    <h3 className="text-white font-bold text-lg truncate leading-tight">
                      {recipe?.name ?? "Unknown Recipe"}
                    </h3>
                  </div>
                </div>

                {/* Energy Badge */}
                <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 text-orange-500 px-4 py-2 rounded-xl w-fit mb-6">
                  <Flame size={16} />
                  <span className="font-black text-sm">
                    {item.calories} KCAL
                  </span>
                </div>

                {/* Macro Progress Visualization */}
                <div className="space-y-4">
                  <MacroRow
                    label="Protein"
                    value={item.protein_grams}
                    color="text-primary"
                    bgColor="bg-primary/20"
                    icon={<Beef size={14} />}
                  />
                  <MacroRow
                    label="Carbs"
                    value={item.carbs_grams}
                    color="text-blue-400"
                    bgColor="bg-blue-400/20"
                    icon={<Wheat size={14} />}
                  />
                  <MacroRow
                    label="Fats"
                    value={item.fat_grams}
                    color="text-yellow-400"
                    bgColor="bg-yellow-400/20"
                    icon={<Droplets size={14} />}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Helper component for the macro bars
function MacroRow({ label, value, color, icon }: any) {
  // Logic: Scale the bar based on common macro targets (visual only)
  const width = Math.min((value / 100) * 100, 100);

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-tighter">
        <div className={`flex items-center gap-1.5 ${color}`}>
          {icon}
          <span>{label}</span>
        </div>
        <span className="text-white">{value}g</span>
      </div>
      <div className={`h-1.5 w-full rounded-full bg-white/5 overflow-hidden`}>
        <div
          className={`h-full rounded-full transition-all duration-1000 ${color.replace(
            "text",
            "bg"
          )}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}
