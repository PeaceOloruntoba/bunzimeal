import { useEffect, useState } from "react";
import { toast } from "../../../utils/toast";
import { Spinner } from "../../../components/Spinner";
import { useShoppingStore } from "../shoppingStore";
import {
  ShoppingBasket,
  Plus,
  Trash2,
  ShoppingCart,
  Tag,
  CheckCircle2,
  Printer,
  Hash,
} from "lucide-react";
import ConfirmDialog from "../../../components/ConfirmDialog";

export default function Shopping() {
  const {
    items,
    loading,
    fetch,
    create,
    remove: removeItem,
  } = useShoppingStore();
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [adding, setAdding] = useState(false);
  const [removingId, setRemovingId] = useState<string | number | null>(null);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const addItem = async () => {
    if (!name.trim()) return toast.error("Product name is required");
    setAdding(true);
    try {
      await create({ name, quantity } as any);
      setName("");
      setQuantity("");
      await fetch();
      toast.success("Added to list");
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
      toast.success("Item removed");
    } finally {
      setRemovingId(null);
      setPendingRemove({ id: null, name: undefined });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Architecture */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
            <ShoppingCart size={12} /> Logistics Core
          </div>
          <h1 className="text-5xl font-black text-primary italic tracking-tighter">
            Shopping <span className="text-accent2">Checklist</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg">
            Plan your grocery procurement with clinical precision.
          </p>
        </div>

        <div className="bg-white border border-slate-100 px-6 py-3 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-accent2/10 flex items-center justify-center">
            <ShoppingBasket className="text-accent2" size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
              Manifest
            </p>
            <span className="text-primary font-black text-lg leading-none">
              {items.length} <span className="text-xs">ITEMS</span>
            </span>
          </div>
        </div>
      </div>

      {/* Quick Entry Form */}
      <div className="bg-white border border-slate-100 p-8 rounded-[3rem] shadow-xl shadow-slate-200/40">
        <div className="grid gap-6 md:grid-cols-7 items-end">
          <div className="md:col-span-3 space-y-2.5">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-4 tracking-widest flex items-center gap-2">
              <Tag size={12} /> Commodity Name
            </label>
            <input
              className="w-full h-16 pl-6 pr-4 rounded-2xl bg-slate-50 border border-slate-100 text-primary font-bold placeholder:text-slate-300 focus:outline-none focus:border-accent2 focus:ring-4 focus:ring-accent2/5 transition-all"
              placeholder="e.g. Avocado Pear"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addItem()}
            />
          </div>

          <div className="md:col-span-2 space-y-2.5">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-4 tracking-widest flex items-center gap-2">
              <Hash size={12} /> Quantity
            </label>
            <input
              className="w-full h-16 px-6 rounded-2xl bg-slate-50 border border-slate-100 text-primary font-bold placeholder:text-slate-300 focus:outline-none focus:border-accent2 transition-all"
              placeholder="e.g. 2 Packs"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addItem()}
            />
          </div>

          <div className="md:col-span-2">
            <button
              className="w-full h-16 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-xs hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 active:scale-95 flex items-center justify-center gap-3"
              disabled={adding}
              onClick={addItem}
            >
              {adding ? (
                <Spinner size={20} color="#ffffff" />
              ) : (
                <>
                  <Plus size={20} strokeWidth={3} />
                  <span>Synthesize</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <Spinner size={48} color="#10b981" />
            <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">
              Syncing Ledger...
            </p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-28 rounded-[3.5rem] border-2 border-dashed border-slate-100 bg-slate-50/50">
            <div className="w-24 h-24 bg-white rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-center mx-auto mb-8 transition-transform hover:scale-110 duration-500">
              <ShoppingCart className="text-slate-200" size={48} />
            </div>
            <h3 className="text-primary font-black text-2xl uppercase italic tracking-tighter">
              The Bag is Null
            </h3>
            <p className="text-slate-400 font-medium mt-2">
              Populate your inventory from recipes or manual entry.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {items.map((it) => (
              <div
                key={it.id}
                className="group flex items-center justify-between p-3 pl-8 rounded-[2rem] bg-white border border-slate-100 hover:border-accent2/30 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-slate-200/50"
              >
                <div className="flex items-center gap-6 py-3">
                  <div className="w-8 h-8 rounded-full border-2 border-slate-100 flex items-center justify-center group-hover:border-accent2 group-hover:bg-accent2/5 transition-all duration-500">
                    <CheckCircle2
                      size={16}
                      className="text-accent2 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                  <div>
                    <h4 className="font-black text-xl text-primary leading-tight uppercase italic tracking-tighter group-hover:text-accent2 transition-colors">
                      {it.name}
                    </h4>
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-widest mt-1 border border-slate-100">
                      {it.quantity || "1 UNIT"}
                    </div>
                  </div>
                </div>

                <button
                  className="mr-3 w-14 h-14 rounded-2xl flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all"
                  disabled={removingId === it.id}
                  onClick={() => setPendingRemove({ id: it.id, name: it.name })}
                >
                  {removingId === it.id ? (
                    <Spinner size={20} color="#f43f5e" />
                  ) : (
                    <Trash2 size={22} />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Print & Summary Footer */}
      {items.length > 0 && !loading && (
        <div className="p-10 rounded-[3.5rem] bg-primary text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-primary/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />

          <div className="flex items-center gap-6 z-10">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/20">
              <CheckCircle2 size={32} className="text-white" />
            </div>
            <div>
              <p className="text-2xl font-black uppercase italic tracking-tighter">
                Inventory Primed
              </p>
              <p className="text-primary-foreground/80 font-medium">
                Cloud-synced manifest ready for physical acquisition.
              </p>
            </div>
          </div>

          <button
            className="w-full md:w-auto px-10 h-16 rounded-2xl bg-white text-primary font-black uppercase tracking-widest text-xs hover:bg-slate-50 transition-all active:scale-95 shadow-lg flex items-center justify-center gap-3 z-10"
            onClick={() => window.print()}
          >
            <Printer size={18} />
            Generate Physical Copy
          </button>
        </div>
      )}

      <ConfirmDialog
        open={!!pendingRemove.id}
        title="Purge Item"
        description={`Are you sure you want to remove "${pendingRemove.name}" from the ledger?`}
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
