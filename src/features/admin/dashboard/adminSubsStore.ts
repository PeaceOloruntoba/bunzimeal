import { create } from "zustand";
import { http } from "../../../config/api";
import { handleError } from "../../../utils/handleError";

export type BillingPlan = {
  id: number;
  country_id: number;
  currency: string;
  price: number;
  price_cents: number;
  price_monthly_cents: number;
  price_quarterly_cents: number;
  price_biannual_cents: number;
  price_annual_cents: number;
  country_name: string;
  country_code?: string;
};

type State = {
  plans: BillingPlan[];
  loading: boolean;
  error: string | null;
  settingPrice: boolean;
};

type Actions = {
  fetchAllPlans: () => Promise<void>;
  setCountryPrice: (countryId: number, price: number) => Promise<void>;
  clearError: () => void;
};

export const useAdminSubsStore = create<State & Actions>((set, get) => ({
  plans: [],
  loading: false,
  error: null,
  settingPrice: false,

  fetchAllPlans: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await http.get(`/admin/billing`);
      set({ plans: data as BillingPlan[] });
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: "Failed to load billing plans" }) });
    } finally {
      set({ loading: false });
    }
  },

  setCountryPrice: async (countryId: number, price: number) => {
    set({ settingPrice: true, error: null });
    try {
      const payload = { price };
      await http.post(`/admin/billing/${countryId}/price`, payload);
      await get().fetchAllPlans();
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: "Failed to set country price" }) });
      throw e;
    } finally {
      set({ settingPrice: false });
    }
  },

  clearError: () => set({ error: null }),
}));
