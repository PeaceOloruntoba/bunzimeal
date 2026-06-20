import { create } from "zustand";
import { http } from "../../config/api";
import { handleError } from "../../utils/handleError";

type Message = {
  id: string;
  role: "user" | "assistant" | "system";
  text: string;
  timestamp: Date;
};

type AIState = {
  messages: Message[];
  streaming: boolean;
  loading: boolean;
  error: string | null;
  lastUsage: { totalTokens: number } | null;
  persona: "dietitian" | "clinical_nutritionist";
};

type AIActions = {
  ensureSession: () => Promise<void>;
  loadHistory: () => Promise<void>;
  sendMessage: (text: string, options?: { stream: boolean }) => Promise<void>;
  generatePlan: (payload: { prompt: string; budget?: string; max_prep_minutes?: number }) => Promise<void>;
  clearError: () => void;
  setPersona: (persona: "dietitian" | "clinical_nutritionist") => void;
};

export const useAIStore = create<AIState & AIActions>((set, get) => ({
  messages: [],
  streaming: false,
  loading: false,
  error: null,
  lastUsage: null,
  persona: "dietitian",

  ensureSession: async () => {
    try {
      await http.get(`/ai/session`);
    } catch (e: any) {
      // Ignore session errors
    }
  },

  loadHistory: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await http.get(`/ai/history`);
      const messages = (data?.messages || []).map((m: any) => ({
        ...m,
        timestamp: new Date(m.timestamp),
      }));
      set({ messages });
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: "Failed to load chat history" }) });
    } finally {
      set({ loading: false });
    }
  },

  sendMessage: async (text, options) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      text,
      timestamp: new Date(),
    };
    set({ messages: [...get().messages, userMessage], loading: true, streaming: !!options?.stream, error: null });

    try {
      const { data } = await http.post(`/ai/chat`, { message: text, persona: get().persona, stream: options?.stream });
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        text: data.content,
        timestamp: new Date(),
      };
      set({ messages: [...get().messages, assistantMessage], lastUsage: { totalTokens: data.totalTokens || 0 } });
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: "Failed to send message" }) });
    } finally {
      set({ loading: false, streaming: false });
    }
  },

  generatePlan: async (payload) => {
    set({ loading: true, error: null });
    try {
      await http.post(`/ai/plan`, payload);
      // Optionally refresh meals store here
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: "Failed to generate meal plan" }) });
      throw e;
    } finally {
      set({ loading: false });
    }
  },

  clearError: () => set({ error: null }),
  setPersona: (persona) => set({ persona }),
}));
