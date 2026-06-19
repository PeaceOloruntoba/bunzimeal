import { useEffect, useState } from "react";
import { useAuthStore } from "../features/auth/authStore";
import { GOAL_DEFINITIONS, GOAL_CATEGORIES } from "../config/goals";
import { Check, Sparkles } from "lucide-react";

export default function GoalSelector({
  value,
  onChange,
}: {
  value?: string[];
  onChange?: (g: string[]) => void;
}) {
  const fetchKeys = useAuthStore((s) => s.fetchGoalKeys);
  const [keys, setKeys] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>(value || []);

  useEffect(() => {
    (async () => {
      try {
        if (fetchKeys) {
          const k = await fetchKeys();
          if (Array.isArray(k)) setKeys(k as string[]);
        }
      } catch {
        setKeys(GOAL_DEFINITIONS.map((g) => g.key));
      }
    })();
  }, [fetchKeys]);

  useEffect(() => {
    if (onChange) onChange(selected);
  }, [selected, onChange]);

  function toggle(k: string) {
    setSelected((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]));
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2 px-1">
        <Sparkles size={16} className="text-primary" />
        <p className="text-xs font-bold text-primary uppercase tracking-widest">
          Personalization Engine
        </p>
      </div>

      {GOAL_CATEGORIES.map((cat) => {
        const keysInCat = keys.filter(
          (k) =>
            (GOAL_DEFINITIONS.find((g) => g.key === k)?.category || "Other") ===
            cat
        );
        if (!keysInCat.length) return null;

        return (
          <div key={cat} className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/80 px-1 border-l-2 border-primary/30 ml-1 pl-3">
              {cat}
            </h4>

            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {keysInCat.map((k) => {
                const def = GOAL_DEFINITIONS.find((g) => g.key === k);
                const isSelected = selected.includes(k);
                const label = def ? def.label : k.replace(/_/g, " ");

                return (
                  <button
                    key={k}
                    type="button"
                    onClick={() => toggle(k)}
                    className={`group relative flex flex-col p-4 rounded-2xl border transition-all duration-300 text-left ${
                      isSelected
                        ? "bg-primary/10 border-primary shadow-[0_0_20px_rgba(31,68,76,0.1)]"
                        : "bg-white/[0.03] border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <span
                        className={`font-black uppercase tracking-tight text-sm transition-colors ${
                          isSelected ? "text-primary" : "text-primary/60"
                        }`}
                      >
                        {label}
                      </span>
                      {isSelected && (
                        <div className="bg-primary rounded-full p-0.5">
                          <Check
                            size={12}
                            className="text-white"
                            strokeWidth={4}
                          />
                        </div>
                      )}
                    </div>

                    {def?.description && (
                      <p
                        className={`text-[11px] font-medium leading-snug transition-colors ${
                          isSelected ? "text-primary/70" : "text-slate-500"
                        }`}
                      >
                        {def.description}
                      </p>
                    )}

                    {/* Subtle inner glow on select */}
                    {isSelected && (
                      <div className="absolute inset-0 rounded-2xl bg-primary/5 pointer-events-none" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {selected.length === 0 && (
        <div className="p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            No goals selected. BunziMeal will use standard baseline targets.
          </p>
        </div>
      )}
    </div>
  );
}
