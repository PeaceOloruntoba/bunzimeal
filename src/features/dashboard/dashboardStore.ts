import { create } from "zustand";
import { http } from "../../config/api";
import { handleError } from "../../utils/handleError";

type StatsState = {
  totals: { calories: number; protein_grams: number; carbs_grams: number; fat_grams: number } | null;
  loading: boolean;
  error: string | null;
  streak: number;
};

type StatsActions = {
  summary: (period: string) => Promise<void>;
  fetchStreak: () => Promise<void>;
  logAction: () => Promise<void>;
  clearError: () => void;
};

export const useDashboardStore = create<StatsState & StatsActions>((set, get) => ({
  totals: null,
  loading: false,
  error: null,
  streak: 0,

  summary: async (period) => {
    set({ loading: true, error: null });
    try {
      const { data } = await http.get(`/users/stats/summary?period=${period}`);
      set({ totals: (data as any).data });
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: "Failed to load stats" }) });
    } finally {
      set({ loading: false });
    }
  },

  fetchStreak: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await http.get(`/health/streak`);
      set({ streak: (data as any).data?.streak || 0 });
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: "Failed to load streak" }) });
    } finally {
      set({ loading: false });
    }
  },

  logAction: async () => {
    set({ loading: true, error: null });
    try {
      await http.post(`/stats/log`);
      await get().fetchStreak();
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: "Failed to log action" }) });
    } finally {
      set({ loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
