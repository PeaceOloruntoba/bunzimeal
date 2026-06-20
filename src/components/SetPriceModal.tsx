import { useState } from "react";
import { useAdminSubsStore } from "../features/admin/dashboard/adminSubsStore";
import { toast } from "../utils/toast";
import { Spinner } from "./Spinner";

interface SetPriceModalProps {
  isOpen: boolean;
  onClose: () => void;
  countryId: number;
  countryName: string;
  currency: string;
  initialPrice?: number;
}

export function SetPriceModal({
  isOpen,
  onClose,
  countryId,
  countryName,
  currency,
  initialPrice,
}: SetPriceModalProps) {
  const { setCountryPrice, settingPrice } = useAdminSubsStore();
  const [price, setPrice] = useState(initialPrice || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setCountryPrice(countryId, price);
      toast.success(`Prices updated for ${countryName}`);
      onClose();
    } catch (error) {
      // Error already handled by store
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Set Base Price for {countryName}</h2>
        <p className="text-sm text-gray-600 mb-4">Currency: {currency}</p>
        <p className="text-xs text-gray-500 mb-4">
          System will auto-calculate: monthly, quarterly (2.5x), biannual (5x), annual (10x)
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="grid gap-1">
            <span className="text-sm font-medium">Base Price ({currency})</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="h-10 rounded border px-3"
              disabled={settingPrice}
              placeholder="Enter price (e.g., 99.99)"
            />
          </label>

          {price > 0 && (
            <div className="bg-blue-50 p-3 rounded text-xs text-gray-700 space-y-1">
              <p className="font-semibold">Preview (before store multipliers):</p>
              <p>Monthly: {currency} {price.toFixed(2)}</p>
              <p>Quarterly: {currency} {(price * 2.5).toFixed(2)}</p>
              <p>Biannual: {currency} {(price * 5).toFixed(2)}</p>
              <p>Annual: {currency} {(price * 10).toFixed(2)}</p>
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={settingPrice}
              className="flex-1 h-10 rounded border border-gray-300 text-gray-700 font-medium disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={settingPrice}
              className="flex-1 h-10 rounded bg-blue-600 text-white font-medium disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {settingPrice && <Spinner size={16} color="#fff" />}
              {settingPrice ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
