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
  consumeIngredient: (id: string | number, amount: number) => Promise<void>;
};

export const usePantryStore = create<State & Actions>((set, get) => ({
  items: [],
  loading: false,
  error: null,

  fetch: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await http.get(`/pantry`);
      set({ items: data });
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: "Failed to fetch pantry" }) });
    } finally {
      set({ loading: false });
    }
  },

  create: async (payload) => {
    set({ loading: true, error: null });
    try {
      const { data } = await http.post(`/pantry`, payload);
      set({ items: [data, ...get().items] });
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: "Failed to add pantry item" }) });
    } finally {
      set({ loading: false });
    }
  },

  update: async (id, payload) => {
    set({ loading: true, error: null });
    try {
      const { data } = await http.put(`/pantry/${id}`, payload);
      set({ items: get().items.map((x: any) => (x.id === id ? { ...x, ...data } : x)) });
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: "Failed to update pantry item" }) });
    } finally {
      set({ loading: false });
    }
  },

  remove: async (id) => {
    set({ loading: true, error: null });
    try {
      await http.delete(`/pantry/${id}`);
      set({ items: get().items.filter((x: any) => x.id !== id) });
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: "Failed to delete pantry item" }) });
    } finally {
      set({ loading: false });
    }
  },

  clearError: () => set({ error: null }),

  consumeIngredient: async (id, amount) => {
    set({ loading: true, error: null });
    try {
      const { data } = await http.post(`/pantry/${id}/consume`, { amount });
      set({ items: get().items.map((x: any) => (x.id === id ? { ...x, ...data } : x)) });
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: "Failed to consume ingredient" }) });
      throw e;
    } finally {
      set({ loading: false });
    }
  },
}));
