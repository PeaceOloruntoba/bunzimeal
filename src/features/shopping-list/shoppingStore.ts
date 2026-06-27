import { create } from "zustand";
import { http } from "../../config/api";
import { handleError } from "../../utils/handleError";

type State = {
  items: any[];
  loading: boolean;
  error: string | null;
};

type Actions = {
  fetch: () => Promise<void>;
  create: (payload: any) => Promise<void>;
  update: (id: string | number, payload: any) => Promise<void>;
  remove: (id: string | number) => Promise<void>;
  clearError: () => void;
  togglePurchased: (id: string | number) => Promise<void>;
};

export const useShoppingStore = create<State & Actions>((set, get) => ({
  items: [],
  loading: false,
  error: null,

  fetch: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await http.get(`/shopping-list`);
      set({ items: data.data });
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: "Failed to fetch shopping list" }) });
    } finally {
      set({ loading: false });
    }
  },

  create: async (payload) => {
    set({ loading: true, error: null });
    try {
      const { data } = await http.post(`/shopping-list`, payload);
      set({ items: [data.data, ...get().items] });
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: "Failed to add shopping item" }) });
    } finally {
      set({ loading: false });
    }
  },

  update: async (id, payload) => {
    set({ loading: true, error: null });
    try {
      const { data } = await http.put(`/shopping-list/${id}`, payload);
      set({ items: get().items.map((x: any) => (x.id === id ? { ...x, ...data.data } : x)) });
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: "Failed to update shopping item" }) });
    } finally {
      set({ loading: false });
    }
  },

  remove: async (id) => {
    set({ loading: true, error: null });
    try {
      await http.delete(`/shopping-list/${id}`);
      set({ items: get().items.filter((x: any) => x.id !== id) });
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: "Failed to delete shopping item" }) });
    } finally {
      set({ loading: false });
    }
  },

  clearError: () => set({ error: null }),

  togglePurchased: async (id) => {
    set({ loading: true, error: null });
    try {
      const { data } = await http.post(`/shopping-list/${id}/toggle`);
      set({ items: get().items.map((x: any) => (x.id === id ? { ...x, ...data.data } : x)) });
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: "Failed to toggle purchased" }) });
    } finally {
      set({ loading: false });
    }
  },
}));
