import { useEffect, useState } from "react";
import { http } from "../../../../config/api";

export default function AIUsage() {
  const [summary, setSummary] = useState<Array<{ day: string; tokens: number }>>([]);
  const [topUsers, setTopUsers] = useState<Array<{ user_id: string; email: string; tokens: number }>>([]);
  const [recent, setRecent] = useState<Array<{ id: string; user_id: string; role: string; token_usage: number; created_at: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true); setError(null);
        const [{ data: s }, { data: t }, { data: r }] = await Promise.all([
          http.get(`/admin/ai/usage/summary`),
          http.get(`/admin/ai/usage/top-users`),
          http.get(`/admin/ai/usage/recent-messages`),
        ]);
        setSummary(s || []);
        setTopUsers(t || []);
        setRecent(r || []);
      } catch (e: any) {
        setError(e?.response?.data?.errorMessage || e?.message || 'Failed to load AI usage');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="text-xl md:text-2xl font-semibold mb-4">AI Usage</h1>
      {error && <div className="text-red-600 mb-3">{error}</div>}
      {loading && <div className="text-gray-500">Loading...</div>}

      <section className="mb-8">
        <h2 className="font-semibold mb-2">Daily Tokens (30d)</h2>
        <div className="overflow-x-auto border rounded">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left">Day</th>
                <th className="px-3 py-2 text-left">Tokens</th>
              </tr>
            </thead>
            <tbody>
              {summary.map((row) => (
                <tr key={row.day} className="border-t">
                  <td className="px-3 py-2">{row.day}</td>
                  <td className="px-3 py-2">{row.tokens}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="font-semibold mb-2">Top Users (30d)</h2>
        <div className="overflow-x-auto border rounded">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left">Email</th>
                <th className="px-3 py-2 text-left">Tokens</th>
              </tr>
            </thead>
            <tbody>
              {topUsers.map((u) => (
                <tr key={u.user_id} className="border-t">
                  <td className="px-3 py-2">{u.email}</td>
                  <td className="px-3 py-2">{u.tokens}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="font-semibold mb-2">Recent Messages</h2>
        <div className="overflow-x-auto border rounded">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left">Time</th>
                <th className="px-3 py-2 text-left">User</th>
                <th className="px-3 py-2 text-left">Role</th>
                <th className="px-3 py-2 text-left">Tokens</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((m) => (
                <tr key={m.id} className="border-t">
                  <td className="px-3 py-2">{new Date(m.created_at).toLocaleString()}</td>
                  <td className="px-3 py-2">{m.user_id}</td>
                  <td className="px-3 py-2">{m.role}</td>
                  <td className="px-3 py-2">{m.token_usage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
