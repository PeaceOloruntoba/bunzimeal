import { create } from "zustand";
import { http } from "../../config/api";
import { handleError } from "../../utils/handleError";

type State = {
  streak: number;
  loading: boolean;
  error: string | null;
};

type Actions = {
  fetchStreak: () => Promise<void>;
  logAction: () => Promise<void>;
  clearError: () => void;
};

export const useDashboardStore = create<State & Actions>((set, get) => ({
  streak: 0,
  loading: false,
  error: null,

  fetchStreak: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await http.get(`/stats/streak`);
      set({ streak: data?.streak || 0 });
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: "Failed to fetch streak" }) });
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
