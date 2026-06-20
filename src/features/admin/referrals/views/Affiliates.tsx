import { useEffect } from "react";
import { useAdminAffiliateStore } from "../adminAffiliateStore";
import { Spinner } from "../../../../components/Spinner";

export default function Affiliates() {
  const { affiliates, loading, saving, fetchAffiliates, toggleActive, removeAffiliate } = useAdminAffiliateStore();

  useEffect(() => {
    fetchAffiliates().catch(() => {});
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h2 className="text-2xl font-bold mb-6">Affiliates</h2>

      {loading && (
        <div className="flex items-center gap-2 text-gray-600 mb-6">
          <Spinner size={16} /> Loading...
        </div>
      )}

      {!loading && affiliates.length === 0 && (
        <div className="text-gray-600">No affiliates found.</div>
      )}

      {!loading && affiliates.length > 0 && (
        <div className="overflow-x-auto rounded-lg border shadow-sm">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Code</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Benefit</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Cap</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Active</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {affiliates.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-sm text-gray-900">{a.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-mono">{a.code}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {a.benefit === "percent_discount" ? `${a.benefit_value}% off` : `${a.benefit_value} trial days`}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">{a.cap}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-center">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${a.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                      {a.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        disabled={saving}
                        onClick={() => toggleActive(a.id, !a.active)}
                        className={`h-8 px-3 rounded text-white text-xs font-medium transition ${a.active ? "bg-yellow-600 hover:bg-yellow-700" : "bg-green-600 hover:bg-green-700"}`}
                      >
                        {a.active ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        disabled={saving}
                        onClick={() => removeAffiliate(a.id)}
                        className="h-8 px-3 rounded bg-red-600 text-white text-xs font-medium hover:bg-red-700 transition"
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
