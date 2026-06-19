import { create } from "zustand";
import { http } from "../../../config/api";
import { handleError } from "../../../utils/handleError";

export type Affiliate = {
  id: string;
  name: string;
  code: string;
  benefit: "percent_discount" | "trial_days";
  benefit_value: number;
  cap: number;
  active: boolean;
  starts_at?: string | null;
  ends_at?: string | null;
  owner_user_id?: string | null;
};

export type AffiliateRequest = {
  id: string;
  user_id: string;
  status: "pending" | "approved" | "rejected";
  pitch?: string | null;
  social_links?: any;
  email?: string;
  created_at?: string;
};

type State = {
  loading: boolean;
  error: string | null;
  affiliates: Affiliate[];
  requests: AffiliateRequest[];
  saving: boolean;
};

type Actions = {
  fetchAffiliates: () => Promise<void>;
  fetchRequests: () => Promise<void>;
  toggleActive: (id: string, active: boolean) => Promise<void>;
  removeAffiliate: (id: string) => Promise<void>;
  approveRequest: (id: string) => Promise<void>;
  rejectRequest: (id: string) => Promise<void>;
  clearError: () => void;
};

export const useAdminAffiliateStore = create<State & Actions>((set, get) => ({
  loading: false,
  error: null,
  affiliates: [],
  requests: [],
  saving: false,

  fetchAffiliates: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await http.get(`/admin/affiliates`);
      set({ affiliates: data as Affiliate[] });
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: "Failed to load affiliates" }) });
    } finally {
      set({ loading: false });
    }
  },

  fetchRequests: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await http.get(`/admin/affiliate-requests`);
      set({ requests: data as AffiliateRequest[] });
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: "Failed to load requests" }) });
    } finally {
      set({ loading: false });
    }
  },

  toggleActive: async (id, active) => {
    set({ saving: true, error: null });
    try {
      await http.put(`/admin/affiliates/${id}`, { active });
      await get().fetchAffiliates();
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: "Failed to update affiliate" }) });
      throw e;
    } finally {
      set({ saving: false });
    }
  },

  removeAffiliate: async (id) => {
    set({ saving: true, error: null });
    try {
      await http.delete(`/admin/affiliates/${id}`);
      await get().fetchAffiliates();
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: "Failed to remove affiliate" }) });
      throw e;
    } finally {
      set({ saving: false });
    }
  },

  approveRequest: async (id) => {
    set({ saving: true, error: null });
    try {
      await http.post(`/admin/affiliate-requests/${id}/approve`, {});
      await Promise.all([get().fetchRequests(), get().fetchAffiliates()]);
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: "Failed to approve request" }) });
      throw e;
    } finally {
      set({ saving: false });
    }
  },

  rejectRequest: async (id) => {
    set({ saving: true, error: null });
    try {
      await http.post(`/admin/affiliate-requests/${id}/reject`, {});
      await get().fetchRequests();
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: "Failed to reject request" }) });
      throw e;
    } finally {
      set({ saving: false });
    }
  },

  clearError: () => set({ error: null }),
}));
