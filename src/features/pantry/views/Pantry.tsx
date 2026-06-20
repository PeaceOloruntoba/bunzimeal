import { useEffect, useState } from "react";
import { toast } from "../../../utils/toast";
import { Spinner } from "../../../components/Spinner";
import { usePantryStore } from "../pantryStore";
import { Plus, Package, Calendar, Trash2, Box } from "lucide-react";
import ConfirmDialog from "../../../components/ConfirmDialog";

export default function Pantry() {
  const {
    items,
    loading,
    fetch,
    create,
    remove: removeItem,
  } = usePantryStore();

  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [adding, setAdding] = useState(false);
  const [removingId, setRemovingId] = useState<string | number | null>(null);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const addItem = async () => {
    if (!name.trim()) return toast.error("Commodity name is required");
    setAdding(true);
    try {
      await create({
        name,
        quantity,
        unit,
        expires_at: expiresAt || undefined,
      } as any);
      setName("");
      setQuantity("");
      setUnit("");
      setExpiresAt("");
      await fetch();
      toast.success("Inventory updated");
    } finally {
      setAdding(false);
    }
  };

  const [pendingRemove, setPendingRemove] = useState<{
    id: string | number | null;
    name?: string;
  }>({ id: null, name: undefined });

  const performRemove = async (id: string | number) => {
    setRemovingId(id);
    try {
      await removeItem(id);
      await fetch();
      toast.success("Stock purged");
    } finally {
      setRemovingId(null);
      setPendingRemove({ id: null, name: undefined });
    }
  };

  const isExpiringSoon = (dateStr: string) => {
    const expiry = new Date(dateStr);
    const today = new Date();
    const diff = (expiry.getTime() - today.getTime()) / (1000 * 3600 * 24);
    return diff >= 0 && diff <= 3;
  };

  const isExpired = (dateStr: string) => {
    return (
      new Date(dateStr) < new Date() &&
      new Date(dateStr).toDateString() !== new Date().toDateString()
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Architecture */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent2/10 text-accent2 text-[10px] font-black uppercase tracking-widest">
          <Box size={12} /> Stock Management
        </div>
        <h1 className="text-5xl font-black text-primary italic tracking-tighter">
          My <span className="text-accent2">Pantry</span>
        </h1>
        <p className="text-slate-500 font-medium text-lg">
          Monitor your kitchen inventory and real-time freshness metrics.
        </p>
      </div>

      {/* Add Item Form Card */}
      <div className="bg-white border border-slate-100 p-8 md:p-10 rounded-[3rem] shadow-xl shadow-slate-200/40">
        <div className="flex items-center gap-3 text-primary mb-8">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Plus size={20} className="text-primary" strokeWidth={3} />
          </div>
          <h2 className="text-sm font-black uppercase tracking-widest italic">
            Acquire <span className="text-accent2">New Stock</span>
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-4 items-end">
          <div className="space-y-2.5">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-4 tracking-widest">
              Item Name
            </label>
            <input
              className="w-full h-14 px-6 rounded-2xl bg-slate-50 border border-slate-100 text-primary font-bold placeholder:text-slate-300 focus:outline-none focus:border-accent2 transition-all"
              placeholder="e.g. Quinoa"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2.5">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-4 tracking-widest">
                Qty
              </label>
              <input
                className="w-full h-14 px-6 rounded-2xl bg-slate-50 border border-slate-100 text-primary font-bold placeholder:text-slate-300 focus:outline-none focus:border-accent2 transition-all"
                placeholder="5"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div className="space-y-2.5">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-4 tracking-widest">
                Unit
              </label>
              <input
                className="w-full h-14 px-6 rounded-2xl bg-slate-50 border border-slate-100 text-primary font-bold placeholder:text-slate-300 focus:outline-none focus:border-accent2 transition-all"
                placeholder="kg"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2.5">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-4 tracking-widest">
              Expiry Date
            </label>
            <input
              type="date"
              className="w-full h-14 px-6 rounded-2xl bg-slate-50 border border-slate-100 text-primary font-bold focus:outline-none focus:border-accent2 transition-all"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
            />
          </div>
          <button
            className="h-14 w-full rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-xs hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 active:scale-95 flex items-center justify-center"
            disabled={adding}
            onClick={addItem}
          >
            {adding ? <Spinner size={20} color="#ffffff" /> : "Update Stock"}
          </button>
        </div>
      </div>

      {/* Pantry Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-6">
          <Spinner size={48} color="#10b981" />
          <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">
            Syncing Inventory Ledger...
          </p>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-28 rounded-[3.5rem] border-2 border-dashed border-slate-100 bg-slate-50/50">
          <div className="w-24 h-24 bg-white rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-center mx-auto mb-8">
            <Package className="text-slate-200" size={48} />
          </div>
          <h3 className="text-primary font-black text-2xl uppercase italic tracking-tighter">
            Inventory is Void
          </h3>
          <p className="text-slate-400 font-medium mt-2">
            Items added from your shopping list will manifest here.
          </p>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 pb-20">
          {items.map((it) => {
            const expired = it.expires_at ? isExpired(it.expires_at) : false;
            const soon = it.expires_at ? isExpiringSoon(it.expires_at) : false;

            return (
              <div
                key={it.id}
                className={`group p-8 rounded-[2.5rem] border transition-all duration-500 flex flex-col justify-between h-full bg-white shadow-sm hover:shadow-2xl hover:-translate-y-2 ${
                  expired
                    ? "border-rose-100 hover:border-rose-300 shadow-rose-100"
                    : soon
                    ? "border-orange-100 hover:border-orange-300 shadow-orange-100"
                    : "border-slate-100 hover:border-accent2/30 shadow-slate-200/40"
                }`}
              >
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div
                      className={`p-4 rounded-2xl transition-colors ${
                        expired
                          ? "bg-rose-50 text-rose-500"
                          : soon
                          ? "bg-orange-50 text-orange-500"
                          : "bg-slate-50 text-primary group-hover:bg-accent2/10 group-hover:text-accent2"
                      }`}
                    >
                      <Package size={28} />
                    </div>
                    <button
                      className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                      disabled={removingId === it.id}
                      onClick={() =>
                        setPendingRemove({ id: it.id, name: it.name })
                      }
                    >
                      {removingId === it.id ? (
                        <Spinner size={18} color="#f43f5e" />
                      ) : (
                        <Trash2 size={20} />
                      )}
                    </button>
                  </div>

                  <div>
                    <h3 className="text-primary font-black text-2xl leading-tight uppercase italic tracking-tighter">
                      {it.name}
                    </h3>
                    <div className="inline-flex items-center gap-2 mt-3 px-3 py-1 rounded-lg bg-slate-50 border border-slate-100 font-black text-xs text-slate-500 uppercase tracking-widest">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          expired
                            ? "bg-rose-500"
                            : soon
                            ? "bg-orange-500"
                            : "bg-accent2"
                        }`}
                      />
                      {it.quantity} {it.unit}
                    </div>
                  </div>
                </div>

                {it.expires_at && (
                  <div
                    className={`mt-8 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest p-4 rounded-2xl border ${
                      expired
                        ? "bg-rose-50 border-rose-100 text-rose-600 shadow-inner"
                        : soon
                        ? "bg-orange-50 border-orange-100 text-orange-600 animate-pulse"
                        : "bg-slate-50 border-slate-100 text-slate-400"
                    }`}
                  >
                    <Calendar size={16} />
                    <span>
                      {expired ? "Expired" : soon ? "Expiring Soon" : "Expires"}
                      : {new Date(it.expires_at).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={!!pendingRemove.id}
        title="Purge Inventory"
        description={`Are you certain you want to remove "${pendingRemove.name}"? This record will be permanently deleted.`}
        confirmLabel="Purge"
        cancelLabel="Abort"
        loading={!!removingId}
        onCancel={() => setPendingRemove({ id: null, name: undefined })}
        onConfirm={() =>
          pendingRemove.id !== null && performRemove(pendingRemove.id)
        }
      />
    </div>
  );
}
