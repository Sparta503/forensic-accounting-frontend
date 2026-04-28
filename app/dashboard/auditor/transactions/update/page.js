"use client";

import { useState } from "react";
import { apiRequest } from "../../../../lib/apiClient";

export const dynamic = "force-dynamic";

export default function UpdateTransactionPage() {
  const [transactionId, setTransactionId] = useState("");
  const [bodyText, setBodyText] = useState("{}");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const onUpdate = async () => {
    const id = transactionId.trim();
    if (!id) return;

    setIsLoading(true);
    setError("");
    setResult(null);

    try {
      const payload = JSON.parse(bodyText || "{}");
      const res = await apiRequest(`/transactions/${encodeURIComponent(id)}`, {
        method: "PUT",
        body: payload,
      });
      setResult(res);
    } catch (e) {
      setError(e?.message || "Failed to update transaction");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Update Transaction</h1>

      <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
        <input
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value)}
          placeholder="Transaction ID"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm"
        />

        <textarea
          value={bodyText}
          onChange={(e) => setBodyText(e.target.value)}
          rows={12}
          className="w-full font-mono text-xs border border-gray-300 rounded-lg p-3"
        />

        <button
          type="button"
          onClick={onUpdate}
          disabled={isLoading || !transactionId.trim()}
          className="px-4 py-2 rounded-lg bg-black text-white text-sm disabled:opacity-50"
        >
          {isLoading ? "Updating..." : "Update"}
        </button>

        {error ? <div className="text-sm text-red-700">{error}</div> : null}

        {result ? (
          <pre className="p-3 rounded bg-gray-50 border border-gray-200 text-xs overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        ) : null}
      </div>
    </div>
  );
}
