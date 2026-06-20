import { create } from "zustand";
import { http } from "../../config/api";
import { handleError } from "../../utils/handleError";

export type ProfileUser = { id: string; email: string; first_name?: string; last_name?: string; role?: string; country_id?: number; country?: { id: number; name: string; code: string; currency: string } | null };
export type ProfileData = Record<string, any> | null;

type State = {
  user: ProfileUser | null;
  profile: ProfileData;
  loading: boolean;
  saving: boolean;
  error: string | null;
};

type Actions = {
  getProfile: () => Promise<{ user: ProfileUser; profile: ProfileData } | null>;
  updateProfile: (payload: {
    first_name?: string;
    last_name?: string;
    country_id?: number;
    bio?: string | null;
    values?: Record<string, any>;
    avatarFile?: File | null;
  }) => Promise<{ user: ProfileUser; profile: ProfileData } | null>;
  updateCountry: (country_id: number | null) => Promise<ProfileUser | null>;
  clearError: () => void;
};

const numberFields = new Set(["age", "height_cm", "weight_kg", "meals_per_day"]);
const arrayFields = new Set([
  "health_goals",
  "food_allergies",
  "medical_dietary_restrictions",
  "macronutrient_focus",
  "favorite_flavors",
  "cuisine_preferences",
  "texture_preference",
  "foods_loved",
  "foods_disliked",
  "kitchen_equipment_available",
]);

function buildFormData(payload: { first_name?: string; last_name?: string; country_id?: number; bio?: string | null; values?: Record<string, any>; avatarFile?: File | null }) {
  const fd = new FormData();
  if (payload.first_name !== undefined) fd.append("first_name", payload.first_name ?? "");
  if (payload.last_name !== undefined) fd.append("last_name", payload.last_name ?? "");
  if (payload.country_id !== undefined) fd.append("country_id", String(payload.country_id));
  if (payload.bio !== undefined) fd.append("bio", payload.bio ?? "");
  if (payload.avatarFile) fd.append("avatar", payload.avatarFile);
  const values = payload.values || {};
  for (const [k, raw] of Object.entries(values)) {
    if (raw === undefined) continue;
    if (raw === null || raw === "") { fd.append(k, ""); continue; }
    if (arrayFields.has(k)) {
      fd.append(k, JSON.stringify(raw));
    } else if (numberFields.has(k)) {
      fd.append(k, String(raw));
    } else {
      fd.append(k, raw as any);
    }
  }
  return fd;
}

export const useProfileStore = create<State & Actions>((set) => ({
  user: null,
  profile: null,
  loading: false,
  saving: false,
  error: null,

  getProfile: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await http.get<{ user: ProfileUser; profile: ProfileData }>(`/users/profile`);
      set({ user: (data as any).data?.user || data.user, profile: (data as any).data?.profile || data.profile });
      return (data as any).data || data;
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: 'Failed to load profile' }) });
      return null;
    } finally {
      set({ loading: false });
    }
  },

  updateProfile: async (payload) => {
    set({ saving: true, error: null });
    try {
      const fd = buildFormData(payload);
      const { data } = await http.patch<{ user: ProfileUser; profile: ProfileData }>(`/users/profile`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      set({ user: (data as any).data?.user || data.user, profile: (data as any).data?.profile || data.profile });
      return (data as any).data || data;
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: 'Failed to save profile' }) });
      return null;
    } finally {
      set({ saving: false });
    }
  },

  clearError: () => set({ error: null }),

  updateCountry: async (country_id: number | null) => {
    set({ saving: true, error: null });
    try {
      const { data } = await http.patch<{ user: ProfileUser }>(`/users/profile`, { country_id });
      set({ user: (data as any).data?.user || data.user });
      return (data as any).data?.user || data.user;
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: 'Failed to update country' }) });
      return null;
    } finally {
      set({ saving: false });
    }
  },
}));
