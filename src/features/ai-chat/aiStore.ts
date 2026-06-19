import { create } from "zustand";
import { http } from "../../config/api";
import { handleError } from "../../utils/handleError";

type Message = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
};

type State = {
  messages: Message[];
  loading: boolean;
  error: string | null;
  persona: "dietitian" | "clinical_nutritionist";
};

type Actions = {
  sendMessage: (content: string) => Promise<void>;
  setPersona: (persona: "dietitian" | "clinical_nutritionist") => void;
  clearChat: () => void;
  clearError: () => void;
  loadHistory: () => Promise<void>;
};

export const useAIStore = create<State & Actions>((set, get) => ({
  messages: [],
  loading: false,
  error: null,
  persona: "dietitian",

  setPersona: (persona) => set({ persona }),

  clearChat: () => set({ messages: [] }),

  clearError: () => set({ error: null }),

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

  sendMessage: async (content) => {
    set({ loading: true, error: null });
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };
    set({ messages: [...get().messages, userMessage] });

    try {
      const { data } = await http.post(`/ai/chat`, {
        message: content,
        persona: get().persona,
      });
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.content,
        timestamp: new Date(),
      };
      set({ messages: [...get().messages, assistantMessage] });
    } catch (e: any) {
      set({ error: handleError(e, { fallbackMessage: "Failed to send message" }) });
      throw e;
    } finally {
      set({ loading: false });
    }
  },
}));
