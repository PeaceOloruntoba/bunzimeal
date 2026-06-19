import { AlertTriangle } from "lucide-react";

type Props = {
  open: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  open,
  title = "Are you sure?",
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  loading = false,
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
        onClick={onCancel}
      />

      <div className="relative bg-white rounded-[2.5rem] p-8 md:p-10 w-full max-w-md z-10 shadow-2xl shadow-black/20 border border-slate-100 scale-in-center animate-in zoom-in-95 duration-300">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-rose-50 flex items-center justify-center text-rose-500 mb-2">
            <AlertTriangle size={32} />
          </div>

          <h3 className="text-2xl font-black text-primary uppercase italic tracking-tighter">
            {title}
          </h3>

          {description && (
            <p className="text-slate-500 font-medium leading-relaxed">
              {description}
            </p>
          )}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-3">
          <button
            className="flex-1 order-2 sm:order-1 px-6 h-14 rounded-2xl bg-slate-50 text-slate-400 font-black uppercase tracking-widest text-xs hover:bg-slate-100 transition-all active:scale-95 disabled:opacity-50"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelLabel}
          </button>

          <button
            className="flex-[1.5] order-1 sm:order-2 px-6 h-14 rounded-2xl bg-rose-500 text-white font-black uppercase tracking-widest text-xs hover:bg-rose-600 shadow-lg shadow-rose-200 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Processing</span>
              </div>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
