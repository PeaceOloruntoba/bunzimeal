import { useEffect, useMemo, useState } from "react";
import { useRecipesStore } from "../recipesStore";
import { Spinner } from "../../../components/Spinner";
import { useNavigate } from "react-router";
import {
  Search,
  Clock,
  Flame,
  Utensils,
  ChevronRight,
} from "lucide-react";

export default function Recipes() {
  const { items, loading, error, fetch } = useRecipesStore();
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch();
  }, [fetch]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return items;
    return items.filter((r) => r.name.toLowerCase().includes(term));
  }, [q, items]);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header & Search Architecture */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent2/10 text-accent2 text-[10px] font-black uppercase tracking-widest">
            <Utensils size={12} /> Culinary Library
          </div>
          <h1 className="text-5xl font-black text-primary italic tracking-tighter">
            Discover <span className="text-accent2">Recipes</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg">
            Curated nutritious Nigerian and continental masterpieces.
          </p>
        </div>

        <div className="relative w-full max-w-md group">
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-accent2 transition-colors"
            size={20}
          />
          <input
            type="text"
            placeholder="Search ingredients or meals..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full h-16 pl-14 pr-6 rounded-[2rem] bg-white border border-slate-200 text-primary placeholder:text-slate-300 focus:outline-none focus:border-accent2 focus:ring-4 focus:ring-accent2/5 transition-all shadow-lg shadow-slate-200/40"
          />
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* Error State */}
      {error && (
        <div className="p-5 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 font-bold flex items-center gap-4 animate-shake">
          <div className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
          {error}
        </div>
      )}

      {/* Content Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-6">
          <Spinner size={48} color="#10b981" />
          <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">
            Syncing Neural Cookbook...
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 rounded-[3rem] border-2 border-dashed border-slate-100 bg-slate-50/50">
          <div className="w-20 h-20 bg-white rounded-3xl shadow-sm border border-slate-100 flex items-center justify-center mx-auto mb-6">
            <Search className="text-slate-200" size={32} />
          </div>
          <h3 className="text-primary font-black text-2xl uppercase italic tracking-tighter">
            No Flavors Found
          </h3>
          <p className="text-slate-400 font-medium mt-2">
            Try searching for "Jollof", "Keto", or "Breakfast".
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
          {filtered.map((r) => (
            <div
              key={r.id}
              className="group relative rounded-[2.5rem] overflow-hidden bg-white border border-slate-100 hover:border-accent2/30 transition-all duration-500 hover:-translate-y-2 cursor-pointer shadow-sm hover:shadow-2xl hover:shadow-accent2/10"
              onClick={() => navigate(`/app/recipes/${r.id}`)}
            >
              {/* Image Container */}
              <div className="relative h-64 w-full overflow-hidden">
                {/* Soft gradient overlay for text readability on top */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent z-10 opacity-60" />

                {r.image_url ? (
                  <img
                    src={r.image_url}
                    alt={r.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                    <Utensils className="text-slate-200" size={48} />
                  </div>
                )}

                {/* Category Badge */}
                {r.category && (
                  <span className="absolute top-5 left-5 z-20 px-4 py-1.5 rounded-xl bg-white/90 backdrop-blur-md text-primary text-[10px] font-black uppercase tracking-widest shadow-sm">
                    {r.category}
                  </span>
                )}
              </div>

              {/* Details */}
              <div className="p-8 space-y-5">
                <div className="flex justify-between items-start gap-4">
                  <h3 className="font-black text-2xl text-primary leading-[1.1] group-hover:text-accent2 transition-colors uppercase italic tracking-tighter">
                    {r.name}
                  </h3>
                  <div className="shrink-0 w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-accent2 group-hover:text-white transition-all shadow-inner">
                    <ChevronRight
                      size={20}
                      className="text-slate-300 group-hover:text-white"
                    />
                  </div>
                </div>

                {/* Info Pills */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                    <Clock size={14} className="text-accent2" />
                    <span>25 MIN</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                    <Flame size={14} className="text-orange-400" />
                    <span>450 KCAL</span>
                  </div>
                </div>
              </div>

              {/* Bottom Decorative Edge */}
              <div className="h-1.5 w-0 group-hover:w-full bg-accent2 transition-all duration-500" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
