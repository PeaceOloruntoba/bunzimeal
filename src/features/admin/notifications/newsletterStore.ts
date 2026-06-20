import { create } from "zustand";
import { http } from "../../../config/api";
import { handleError } from "../../../utils/handleError";

type State = {
  title: string;
  body_html: string;
  exclude_user_ids: string[]; // selected users to exclude from send
  loading: boolean;
  error: string | null;
  preview_html: string | null;
  preview_loading: boolean;
  preview_user_id: string | null;
};

type Actions = {
  setTitle: (v: string) => void;
  setBody: (v: string) => void;
  toggleExcluded: (id: string) => void;
  clearSelection: () => void;
  clearError: () => void;
  send: () => Promise<{ id: string; recipients: number; sent: number } | null>;
  setPreviewUserId: (id: string | null) => void;
  preview: () => Promise<string | null>;
  clearPreview: () => void;
};

export const useNewsletterStore = create<State & Actions>((set, get) => ({
  title: "",
  body_html: "",
  exclude_user_ids: [],
  loading: false,
  error: null,
  preview_html: null,
  preview_loading: false,
  preview_user_id: null,

  setTitle: (v) => set({ title: v }),
  setBody: (v) => set({ body_html: v }),
  toggleExcluded: (id) => {
    const cur = get().exclude_user_ids;
    if (cur.includes(id)) set({ exclude_user_ids: cur.filter((x) => x !== id) });
    else set({ exclude_user_ids: [...cur, id] });
  },
  clearSelection: () => set({ exclude_user_ids: [] }),
  clearError: () => set({ error: null }),

  send: async () => {
    const { title, body_html, exclude_user_ids } = get();
    set({ loading: true, error: null });
    try {
      const { data } = await http.post(`/admin/newsletters`, {
        title,
        body_html,
        // backend supports user_id as exclusion input as well, but send both for clarity
        user_id: exclude_user_ids,
        exclude_user_ids,
      });
      return data;
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: "Failed to send newsletter" }) });
      return null;
    } finally {
      set({ loading: false });
    }
  },

  setPreviewUserId: (id) => set({ preview_user_id: id }),
  clearPreview: () => set({ preview_html: null }),
  preview: async () => {
    const { body_html, preview_user_id } = get();
    set({ preview_loading: true });
    try {
      const { data } = await http.post(`/admin/newsletters/preview`, {
        body_html,
        user_id: preview_user_id || undefined,
      });
      set({ preview_html: (data?.html as string) || null });
      return (data?.html as string) || null;
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: "Failed to render preview" }) });
      return null;
    } finally {
      set({ preview_loading: false });
    }
  },
}));
