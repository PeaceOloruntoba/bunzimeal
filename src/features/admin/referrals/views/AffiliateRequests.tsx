import { useEffect } from "react";
import { useAdminAffiliateStore } from "../adminAffiliateStore";
import { Spinner } from "../../../../components/Spinner";

export default function AffiliateRequests() {
  const { requests, loading, saving, fetchRequests, approveRequest, rejectRequest } = useAdminAffiliateStore();

  useEffect(() => {
    fetchRequests().catch(() => {});
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h2 className="text-2xl font-bold mb-6">Affiliate Requests</h2>

      {loading && (
        <div className="flex items-center gap-2 text-gray-600 mb-6">
          <Spinner size={16} /> Loading...
        </div>
      )}

      {!loading && requests.length === 0 && (
        <div className="text-gray-600">No requests found.</div>
      )}

      {!loading && requests.length > 0 && (
        <div className="overflow-x-auto rounded-lg border shadow-sm">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Pitch</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {requests.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-sm text-gray-900">{r.email || r.user_id}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{r.status}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{r.pitch || "-"}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        disabled={saving || r.status !== "pending"}
                        onClick={() => approveRequest(r.id)}
                        className="h-8 px-3 rounded bg-green-600 text-white text-xs font-medium hover:bg-green-700 transition disabled:opacity-50"
                      >
                        Approve
                      </button>
                      <button
                        disabled={saving || r.status !== "pending"}
                        onClick={() => rejectRequest(r.id)}
                        className="h-8 px-3 rounded bg-red-600 text-white text-xs font-medium hover:bg-red-700 transition disabled:opacity-50"
                      >
                        Reject
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
