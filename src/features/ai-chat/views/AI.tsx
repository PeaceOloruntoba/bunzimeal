import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useAIStore } from "../aiStore";
import GenerateMealPlanModal from "../../../components/GenerateMealPlanModal";
import {
  Send,
  Sparkles,
  Calendar,
  ChevronRight,
  Trash2,
  Zap,
  Cpu,
} from "lucide-react";
import { Spinner } from "../../../components/Spinner";

export default function AI() {
  const {
    ensureSession,
    loadHistory,
    messages,
    sendMessage,
    generatePlan,
    streaming,
    loading,
    error,
    clearError,
    lastUsage,
  } = useAIStore();

  const [input, setInput] = useState("");
  const [stream, setStream] = useState(true);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  /**
   * Optimized Markdown Logic
   * Fixed for Overflow: Added break-all to code and handled whitespace
   */
  function renderMarkdown(md: string) {
    const html = md
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(
        /`([^`]+)`/g,
        '<code class="px-1.5 py-0.5 bg-primary/5 text-primary rounded-md font-mono text-xs border border-primary/10 break-all">$1</code>'
      )
      .replace(
        /\*\*([^*]+)\*\*/g,
        '<strong class="text-primary font-black uppercase tracking-tight">$1</strong>'
      )
      .replace(
        /(?<!\*)\*([^*]+)\*(?!\*)/g,
        '<em class="text-slate-500 italic font-medium">$1</em>'
      )
      .replace(/\n/g, "<br/>");
    return { __html: html };
  }

  useEffect(() => {
    (async () => {
      await ensureSession();
      await loadHistory();
    })();
  }, [ensureSession, loadHistory]);

  useEffect(() => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollTo({
        top: scrollerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, streaming]);

  async function onSend(e?: React.FormEvent) {
    e?.preventDefault();
    if (!input.trim() || loading || streaming) return;
    const msg = input.trim();
    setInput("");
    await sendMessage(msg, { stream });
  }

  return (
    <div className="mx-auto max-w-5xl h-[calc(100vh-8rem)] flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 overflow-hidden">
      {/* Header: Concierge Style */}
      <header className="bg-white border border-slate-100 rounded-[2rem] px-6 py-4 flex flex-wrap items-center justify-between gap-4 shadow-sm relative overflow-hidden shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Cpu size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-primary uppercase italic tracking-tighter">
              Bunzi <span className="text-accent2">Intelligence</span>
            </h1>
            <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
              <Zap size={10} className="text-accent2" />
              {lastUsage?.totalTokens
                ? `Session Weight: ${lastUsage.totalTokens} Tokens`
                : "Neural Core Ready"}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/app/dashboard")}
            className="hidden md:flex items-center gap-2 px-4 h-11 rounded-xl bg-slate-50 border border-slate-100 text-slate-500 font-black uppercase tracking-widest text-[10px] hover:bg-slate-100 transition-all"
          >
            <Calendar size={14} /> My Plan
          </button>
          <button
            onClick={() => setShowPlanModal(true)}
            className="flex items-center gap-2 px-6 h-11 rounded-xl bg-accent2 text-white font-black uppercase tracking-widest text-[10px] hover:bg-accent2/90 transition-all shadow-lg shadow-accent2/20"
          >
            <Sparkles size={14} /> New 7-Day Architecture
          </button>
        </div>
      </header>

      {/* Chat Space: Overflow handled with overflow-x-hidden */}
      <div
        ref={scrollerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden px-4 space-y-8 scrollbar-hide"
      >
        {messages.length === 0 && !loading && (
          <div className="max-w-2xl mx-auto mt-16 space-y-10 text-center">
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-primary uppercase italic tracking-tighter leading-tight">
                What shall we <span className="text-accent2">Cook</span> today?
              </h2>
              <p className="text-slate-500 font-medium max-w-sm mx-auto">
                Discuss meal optimizations, grocery logistics, or nutrition
                science with your AI chef.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {[
                "High-protein 30-min lunch ideas",
                "Optimized low-carb shopping list",
                "Post-workout recovery meals",
                "Explain Vitamin D importance",
              ].map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => setInput(prompt)}
                  className="p-5 rounded-[1.5rem] bg-white border border-slate-100 text-left hover:border-primary/30 hover:shadow-md transition-all group"
                >
                  <p className="text-[9px] font-black text-accent2 uppercase tracking-widest mb-1">
                    Quick Access
                  </p>
                  <div className="flex items-center justify-between text-primary font-bold text-sm uppercase tracking-tight">
                    {prompt}
                    <ChevronRight
                      size={16}
                      className="text-slate-300 group-hover:text-primary transition-colors"
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, idx) => {
          const mine = m.role === "user";
          return (
            <div
              key={idx}
              className={`flex w-full ${
                mine ? "justify-end" : "justify-start"
              } animate-in slide-in-from-bottom-2 duration-300`}
            >
              <div
                className={`relative max-w-[90%] md:max-w-[75%] px-7 py-5 rounded-[2.5rem] break-words ${
                  mine
                    ? "bg-primary text-white font-bold rounded-br-none shadow-xl shadow-primary/10"
                    : "bg-white border border-slate-100 text-slate-600 rounded-bl-none shadow-sm"
                }`}
              >
                {mine ? (
                  <p className="leading-relaxed uppercase tracking-tight font-black italic break-words">
                    {m.text}
                  </p>
                ) : (
                  <div
                    className="leading-relaxed text-sm font-medium break-words prose prose-slate prose-sm max-w-full"
                    dangerouslySetInnerHTML={renderMarkdown(m.text)}
                  />
                )}
              </div>
            </div>
          );
        })}

        {streaming && (
          <div className="flex justify-start">
            <div className="px-6 py-4 rounded-full bg-slate-50 border border-slate-100 text-primary font-black uppercase tracking-widest text-[9px] flex items-center gap-3">
              <Spinner size={14} color="#10b981" />
              Synthesizing...
            </div>
          </div>
        )}
      </div>

      {/* Action Tray & Input */}
      <div className="space-y-4 pb-4 shrink-0">
        {error && (
          <div className="p-4 px-6 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trash2 size={14} /> {error}
            </div>
            <button
              onClick={() => clearError()}
              className="uppercase tracking-widest font-black"
            >
              Dismiss
            </button>
          </div>
        )}

        <form onSubmit={onSend} className="relative group">
          <input
            className="w-full h-18 pl-8 pr-32 rounded-[2rem] bg-white border border-slate-200 text-primary font-medium placeholder:text-slate-300 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 shadow-lg shadow-slate-200/40 transition-all"
            placeholder="Describe your goals or ask a question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading || streaming}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-4">
            <label className="hidden md:flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-primary transition-colors">
              <input
                type="checkbox"
                checked={stream}
                onChange={(e) => setStream(e.target.checked)}
                className="accent-primary h-3 w-3 rounded-full"
              />
              Stream
            </label>
            <button
              type="submit"
              className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-all disabled:opacity-20 active:scale-90"
              disabled={loading || streaming || !input.trim()}
            >
              <Send size={20} strokeWidth={2.5} />
            </button>
          </div>
        </form>
      </div>

      <GenerateMealPlanModal
        isOpen={showPlanModal}
        onClose={() => setShowPlanModal(false)}
        defaultPrompt={input ? `Use these instructions: ${input}` : undefined}
        onGenerate={async ({ prompt, budget, maxPrepMinutes }) => {
          await generatePlan({
            prompt,
            budget,
            max_prep_minutes: maxPrepMinutes,
          });
        }}
      />
    </div>
  );
}
