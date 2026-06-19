import { create } from "zustand";
import { http, setAccessToken } from "../../config/api";
import { handleError } from "../../utils/handleError";

export type User = {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  country_id?: number;
  country?: { id: number; name: string; code: string; currency: string } | null;
};

export type Country = {
  id: number;
  name: string;
  code: string;
  currency: string;
};

type Plan = {
  plan: string;
  price_cents: number;
  currency: string;
  price?: number;
  price_monthly_cents?: number;
  price_quarterly_cents?: number;
  price_biannual_cents?: number;
  price_annual_cents?: number;
};

type State = {
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
  hydrated: boolean;
  plans: Plan[] | null;
  verifyEmail: string | null;
  resetEmail: string | null;
  countries: Country[];
};

type Actions = {
  bootstrap: () => Promise<void>;
  register: (payload: any) => Promise<any>;
  verifyOtp: (payload: { email: string; code: string }) => Promise<void>;
  login: (payload: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  forgot: (payload: { email: string }) => Promise<void>;
  reset: (payload: any) => Promise<void>;
  fetchMe: () => Promise<void>;
  fetchPublicPlans: () => Promise<void>;
  fetchCountries: () => Promise<void>;
  fetchGoalKeys: () => Promise<string[]>;
  setGoals: (goals: string[]) => Promise<boolean>;
  clearError: () => void;
  resendOtp: (payload: {
    email: string;
    purpose: "verify" | "password_reset";
  }) => Promise<void>;
  setVerifyEmail: (email: string | null) => void;
  setResetEmail: (email: string | null) => void;
};

export const useAuthStore = create<State & Actions>((set, get) => ({
  token:
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null,
  user: null,
  loading: false,
  error: null,
  hydrated: false,
  plans: null,
  verifyEmail: null,
  resetEmail: null,
  countries: [],

  bootstrap: async () => {
    const t = localStorage.getItem("access_token");

    try {
      if (t) {
        setAccessToken(t);
        // We call fetchMe directly to populate the user state
        const { data } = await http.get(`/users/me`);
        set({ token: t, user: data as User });
      }
      await get().fetchCountries();
    } catch (e) {
      // If fetchMe fails, api.ts handles clearing the token.
      // We just ensure the app doesn't crash here.
      setAccessToken(null);
      set({ token: null, user: null });
    } finally {
      set({ hydrated: true });
    }
  },

  login: async (payload) => {
    set({ loading: true, error: null });
    try {
      const { data } = await http.post(`/auth/login`, payload);
      const token = (data as any)?.token;
      if (!token) throw new Error("Authentication failed: No token received");

      setAccessToken(token);
      set({ token, user: data.user as User });
    } catch (e: any) {
      const msg = handleError(e, {
        fallbackMessage: "Login failed",
        silent: true,
      });
      set({ error: msg });
      throw e;
    } finally {
      set({ loading: false });
    }
  },

  register: async (payload) => {
    set({ loading: true, error: null });
    try {
      const { data } = await http.post(`/auth/register`, payload);
      return data;
    } catch (e: any) {
      set({
        error: handleError(e, { fallbackMessage: "Registration failed" }),
      });
      throw e;
    } finally {
      set({ loading: false });
    }
  },

  fetchMe: async () => {
    try {
      const { data } = await http.get(`/users/me`);
      set({ user: data as User });
    } catch (e) {
      set({ token: null, user: null });
      setAccessToken(null);
    }
  },

  logout: async () => {
    try {
      await http.post(`/auth/logout`);
    } finally {
      setAccessToken(null);
      set({ token: null, user: null });
    }
  },

  logoutAll: async () => {
    try {
      await http.post(`/auth/logout-all`);
    } finally {
      setAccessToken(null);
      set({ token: null, user: null });
    }
  },

  fetchCountries: async () => {
    try {
      const { data } = await http.get(`/countries`);
      set({ countries: data || [] });
    } catch (e) {}
  },

  fetchPublicPlans: async () => {
    set({ loading: true });
    try {
      const { data } = await http.get(`/billing/public/plans`);
      set({ plans: data.plans || data || [] });
    } finally {
      set({ loading: false });
    }
  },

  verifyOtp: async (payload) => {
    set({ loading: true });
    try {
      await http.post(`/auth/verify-otp`, payload);
    } catch (e) {
      set({ error: handleError(e) });
      throw e;
    } finally {
      set({ loading: false });
    }
  },

  forgot: async (payload) => {
    set({ loading: true });
    try {
      await http.post(`/auth/forgot-password`, payload);
    } finally {
      set({ loading: false });
    }
  },

  reset: async (payload) => {
    set({ loading: true });
    try {
      await http.post(`/auth/reset-password`, payload);
    } finally {
      set({ loading: false });
    }
  },

  resendOtp: async (payload) => {
    await http.post(`/auth/resend-otp`, payload);
  },

  fetchGoalKeys: async () => {
    const { data } = await http.get(`/goals/keys`);
    return data?.keys || [];
  },

  setGoals: async (goals) => {
    await http.put(`/goals`, { goals });
    return true;
  },

  clearError: () => set({ error: null }),
  setVerifyEmail: (email) => set({ verifyEmail: email }),
  setResetEmail: (email) => set({ resetEmail: email }),
}));
