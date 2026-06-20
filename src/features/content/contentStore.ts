import { create } from 'zustand';
import { http } from '../../config/api';
import { handleError } from '../../utils/handleError';

type SiteContents = {
  privacy_policy?: string;
  terms_and_condition?: string;
  refund_policy?: string;
};

type FAQ = { id: string; question: string; answer: string; created_at?: string };

type State = {
  loading: boolean;
  error: string | null;
  contents: SiteContents | null;
  faqs: FAQ[];
};

type Actions = {
  fetchContents: () => Promise<void>;
  fetchFaqs: () => Promise<void>;
  adminFetchContents: () => Promise<void>;
  adminUpdateContents: (payload: SiteContents) => Promise<void>;
  adminCreateFaq: (q: string, a: string) => Promise<void>;
  adminUpdateFaq: (id: string, q: string, a: string) => Promise<void>;
  adminDeleteFaq: (id: string) => Promise<void>;
};

export const useContentStore = create<State & Actions>((set, get) => ({
  loading: false,
  error: null,
  contents: null,
  faqs: [],

  fetchContents: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await http.get('/content');
      set({ contents: (data as any).data || null });
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: 'Failed to load site contents' }) });
      throw e;
    } finally { set({ loading: false }); }
  },

  fetchFaqs: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await http.get('/content/faqs');
      set({ faqs: (data as any).data || [] });
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: 'Failed to load faqs' }) });
      throw e;
    } finally { set({ loading: false }); }
  },

  adminFetchContents: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await http.get('/admin/content/site-contents');
      set({ contents: (data as any).data || null });
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: 'Failed to load contents' }) });
      throw e;
    } finally { set({ loading: false }); }
  },

  adminUpdateContents: async (payload) => {
    set({ loading: true, error: null });
    try {
      const { data } = await http.patch('/admin/content/site-contents', payload);
      set({ contents: (data as any).data || null });
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: 'Failed to save contents' }) });
      throw e;
    } finally { set({ loading: false }); }
  },

  adminCreateFaq: async (q, a) => {
    set({ loading: true, error: null });
    try {
      await http.post('/admin/content/faqs', { question: q, answer: a });
      await get().adminFetchContents();
      await get().fetchFaqs();
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: 'Failed to create faq' }) });
      throw e;
    } finally { set({ loading: false }); }
  },

  adminUpdateFaq: async (id, q, a) => {
    set({ loading: true, error: null });
    try {
      await http.patch(`/admin/content/faqs/${id}`, { question: q, answer: a });
      await get().fetchFaqs();
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: 'Failed to update faq' }) });
      throw e;
    } finally { set({ loading: false }); }
  },

  adminDeleteFaq: async (id) => {
    set({ loading: true, error: null });
    try {
      await http.delete(`/admin/content/faqs/${id}`);
      await get().fetchFaqs();
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: 'Failed to delete faq' }) });
      throw e;
    } finally { set({ loading: false }); }
  },
}));

export default useContentStore;
