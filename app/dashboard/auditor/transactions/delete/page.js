"use client";

import { useState } from "react";
import { apiRequest } from "../../../../lib/apiClient";

export const dynamic = "force-dynamic";

export default function DeleteTransactionPage() {
  const [transactionId, setTransactionId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const onDelete = async () => {
    const id = transactionId.trim();
    if (!id) return;

    setIsLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await apiRequest(`/transactions/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      setResult(res || { deleted: true });
    } catch (e) {
      setError(e?.message || "Failed to delete transaction");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Delete Transaction</h1>

      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <input
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            placeholder="Transaction ID"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm"
          />
          <button
            type="button"
            onClick={onDelete}
            disabled={isLoading || !transactionId.trim()}
            className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm disabled:opacity-50"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>

        {error ? <div className="mt-3 text-sm text-red-700">{error}</div> : null}

        {result ? (
          <pre className="mt-3 p-3 rounded bg-gray-50 border border-gray-200 text-xs overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        ) : null}
      </div>
    </div>
  );
}
