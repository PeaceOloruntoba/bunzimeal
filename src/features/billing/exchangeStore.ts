import { create } from "zustand";
import { http } from "../../config/api";

type CacheEntry = {
  rate?: number | null;
  converted_major?: number | null;
  expiresAt: number;
  raw?: any;
};

type State = {
  cache: Record<string, CacheEntry>;
  fetching: boolean;
  error: string | null;
};

type Actions = {
  getConversion: (from: string, amount: number) => Promise<{ rate?: number | null; converted_major?: number | null; raw?: any }>;
  clearCache: () => void;
};

const TTL = 1000 * 60 * 60;

export const useExchangeStore = create<State & Actions>((set, get) => ({
  cache: {},
  fetching: false,
  error: null,

  clearCache: () => set({ cache: {} }),

  getConversion: async (from, amount) => {
    const key = `${from.toUpperCase()}`;
    const now = Date.now();
    const cached = get().cache[key];
    if (cached && cached.expiresAt > now) {
      return { rate: cached.rate, converted_major: cached.converted_major, raw: cached.raw };
    }

    set({ fetching: true, error: null });
    try {
      const { data } = await http.get(`/billing/convert?from=${encodeURIComponent(from)}&amount=${encodeURIComponent(String(amount))}`);
      const entry: CacheEntry = {
        rate: data.rate ?? null,
        converted_major: data.converted_major ?? null,
        raw: data.raw ?? null,
        expiresAt: Date.now() + TTL,
      };
      set((s) => ({ cache: { ...s.cache, [key]: entry } }));
      return { rate: entry.rate, converted_major: entry.converted_major, raw: entry.raw };
    } catch (e: any) {
      set({ error: (e && e.message) || 'Failed to fetch rate' });
      throw e;
    } finally {
      set({ fetching: false });
    }
  },
}));

export default useExchangeStore;
