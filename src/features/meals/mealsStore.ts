import { create } from "zustand";
import { http } from "../../config/api";
import { handleError } from "../../utils/handleError";
import { toast } from "../../utils/toast";

type State = {
  plan: any | null;
  loading: boolean;
  error: string | null;
  violations: any[] | null;
};

type Actions = {
  fetchPlan: () => Promise<void>;
  setPlan: (plan: any) => Promise<void>;
  clearPlan: () => Promise<void>;
  clearError: () => void;
  clearViolations: () => void;
  generatePlan: (payload: { prompt: string; budget?: string; maxPrepMinutes?: number }) => Promise<void>;
};

export const useMealsStore = create<State & Actions>((set, _get) => ({
  plan: null,
  loading: false,
  error: null,
  violations: null,

  fetchPlan: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await http.get(`/meals/plan`);
      set({ plan: data });

      try {
        const { data: v } = await http.post(`/meals/plan/validate`, { plan: data });
        if (v && Array.isArray(v.violations) && v.violations.length) {
          set({ violations: v.violations });
          for (const viol of v.violations) {
            const msg = `${viol.reason}${viol.recipe_title ? ` — ${viol.recipe_title}` : ''}`;
            if ((String(viol.severity || '').toLowerCase()) === 'critical') toast.error(msg);
            else toast.info(msg);
          }
        } else {
          set({ violations: null });
        }
      } catch (e) {}
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: "Failed to fetch meal plan" }) });
    } finally {
      set({ loading: false });
    }
  },

  setPlan: async (plan) => {
    set({ loading: true, error: null });
    try {
      const { data } = await http.put(`/meals/plan`, plan);
      set({ plan: data });

      try {
        const { data: v } = await http.post(`/meals/plan/validate`, { plan: data });
        if (v && Array.isArray(v.violations) && v.violations.length) set({ violations: v.violations });
        else set({ violations: null });
      } catch (e) {}
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: "Failed to save meal plan" }) });
    } finally {
      set({ loading: false });
    }
  },

  clearPlan: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await http.post(`/meals/plan/clear`);
      set({ plan: data, violations: null });
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: "Failed to clear meal plan" }) });
    } finally {
      set({ loading: false });
    }
  },

  clearError: () => set({ error: null }),
  clearViolations: () => set({ violations: null }),

  generatePlan: async (payload) => {
    set({ loading: true, error: null });
    try {
      const { data } = await http.post(`/meals/plan/generate`, payload);
      set({ plan: data });
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: "Failed to generate meal plan" }) });
      throw e;
    } finally {
      set({ loading: false });
    }
  },
}));
