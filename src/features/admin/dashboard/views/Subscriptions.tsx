import { useEffect, useState } from "react";
import type { BillingPlan } from "../adminSubsStore";
import { useAdminSubsStore } from "../adminSubsStore";
import { Spinner } from "../../../../components/Spinner";
import { SetPriceModal } from "../../../../components/SetPriceModal";

export default function AdminSubscriptions() {
  const { plans, loading, fetchAllPlans } = useAdminSubsStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<BillingPlan | null>(null);

  useEffect(() => {
    fetchAllPlans().catch(() => {});
  }, []);

  const openModal = (plan: BillingPlan) => {
    setSelectedPlan(plan);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedPlan(null);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">Billing Plans by Country</h2>

      {loading && (
        <div className="flex items-center gap-2 text-gray-600 mb-4">
          <Spinner size={16} /> Loading...
        </div>
      )}

      {!loading && plans.length === 0 && (
        <div className="text-gray-600">No billing plans found.</div>
      )}

      {!loading && plans.length > 0 && (
        <div className="overflow-x-auto rounded-lg border shadow-sm">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Country
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Currency
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                  Monthly
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                  Quarterly
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                  Biannual
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                  Annual
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {plans.map((plan) => (
                <tr key={plan.country_id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {plan.country_name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {plan.currency}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">
                    {(plan.price_monthly_cents / 100).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">
                    {(plan.price_quarterly_cents / 100).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">
                    {(plan.price_biannual_cents / 100).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">
                    {(plan.price_annual_cents / 100).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => openModal(plan)}
                      className="h-10 px-3 rounded bg-primary text-white text-xs font-medium hover:bg-primary/90 transition"
                    >
                      Set Price
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedPlan && (
        <SetPriceModal
          isOpen={modalOpen}
          onClose={closeModal}
          countryId={selectedPlan.country_id}
          countryName={selectedPlan.country_name}
          currency={selectedPlan.currency}
          initialPrice={selectedPlan.price}
        />
      )}
    </div>
  );
}
