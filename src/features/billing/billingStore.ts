import { create } from "zustand";
import { http } from "../../config/api";
import { handleError } from "../../utils/handleError";

export type Plan = {
  plan: "monthly" | "quarterly" | "biannual" | "annual";
  price_cents: number;
  currency?: string;
  display?: string;
  discounted?: boolean;
  discounted_price_cents?: number;
};

export type CountryPlan = {
  is_active: boolean;
  country: { id: number; currency: string };
  plans: Plan[];
};

export type BillingStatus = {
  status: "none" | "trialing" | "active" | "past_due" | "canceled" | "expired";
  plan?: Plan["plan"] | null;
  trial_end?: string | null;
  current_period_end?: string | null;
};

type State = {
  loading: boolean;
  error: string | null;
  status: BillingStatus | null;
  plans: Plan[];
  countryPlans: CountryPlan | null;
  referralCode: string | null;
};

type Actions = {
  fetchStatus: () => Promise<void>;
  fetchPlans: () => Promise<void>;
  checkout: (plan: Plan["plan"], options?: { convert?: boolean; source_currency?: string; source_amount?: number }) => Promise<void>;
  cancel: () => Promise<void>;
  clearError: () => void;
  setReferralCode: (code: string | null) => void;
};

export const useBillingStore = create<State & Actions>((set, get) => ({
  loading: false,
  error: null,
  status: null,
  plans: [],
  countryPlans: null,
  referralCode: null,

  fetchStatus: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await http.get(`/billing/status`);
      const payload: any = data;
      let mapped: BillingStatus = { status: 'none' };

      if (payload && payload.subscription) {
        const sub = payload.subscription;
        mapped = {
          status: sub?.status ?? 'none',
          plan: sub?.plan ?? null,
          trial_end: sub?.trial_end ?? null,
          current_period_end: sub?.current_period_end ?? null,
        };
      } else if (payload) {
        const derivedStatus = payload.is_trialing ? 'trialing' : (payload.is_active ? 'active' : 'none');
        mapped = {
          status: derivedStatus as any,
          plan: payload.subscription?.plan ?? null,
          trial_end: payload.subscription?.trial_end ?? payload.next_billing_date ?? null,
          current_period_end: payload.subscription?.current_period_end ?? payload.next_billing_date ?? null,
        };
      }

      set({ status: mapped });
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: "Failed to load billing status" }) });
      throw e;
    } finally {
      set({ loading: false });
    }
  },

  fetchPlans: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await http.get(`/billing/plans`);
      if (data?.plans && Array.isArray(data.plans)) {
        const plans = data.plans.map((p: any) => ({
          plan: p.plan,
          price_cents: p.price_cents,
          currency: p.currency,
          display: p.display || p.plan,
        }));
        set({ plans, countryPlans: data as CountryPlan });
      } else {
        set({ plans: (data as Plan[]) || [] });
      }
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: "Failed to load plans" }) });
      throw e;
    } finally {
      set({ loading: false });
    }
  },

  checkout: async (plan, options) => {
    set({ loading: true, error: null });
    try {
      const payload: any = { plan };
      if (options?.convert) {
        payload.convert = true;
        if (options.source_currency) payload.source_currency = options.source_currency;
        if (options.source_amount) payload.source_amount = options.source_amount;
      }
      if (get().referralCode) {
        payload.referral_code = get().referralCode;
      }
      const { data } = await http.post(`/billing/checkout`, payload);
      const url = (data as any)?.authorization_url || (data as any)?.auth_url || (data as any)?.url;
      if (url) {
        window.location.assign(url);
      } else {
        const ref = (data as any)?.reference;
        const trialApplied = (data as any)?.trial_applied;
        if (trialApplied) {
          await get().fetchStatus().catch(() => {});
          return;
        }
        if (ref) {
          let tries = 0;
          const timer = setInterval(async () => {
            tries++;
            try { await get().fetchStatus(); } catch {}
            const s = get().status?.status;
            if (s === 'active' || tries > 30) clearInterval(timer);
          }, 4000);
        }
      }
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: "Failed to start checkout" }) });
      throw e;
    } finally {
      set({ loading: false });
    }
  },

  cancel: async () => {
    set({ loading: true, error: null });
    try {
      await http.post(`/billing/cancel`);
      await get().fetchStatus();
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: "Failed to cancel" }) });
      throw e;
    } finally {
      set({ loading: false });
    }
  },

  clearError: () => set({ error: null }),
  setReferralCode: (code) => set({ referralCode: code }),
}));
