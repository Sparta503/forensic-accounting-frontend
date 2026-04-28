"use client";

import { useState } from "react";
import { apiRequest } from "../../../../lib/apiClient";

export const dynamic = "force-dynamic";

export default function CreateTransactionPage() {
  const [bodyText, setBodyText] = useState(
    JSON.stringify(
      {
        Date: "",
        Mode: "",
        Category: "",
        Subcategory: "",
        Note: "",
        Amount: 0,
        "Income/Expense": "",
        Currency: "",
      },
      null,
      2
    )
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const onSubmit = async () => {
    setIsLoading(true);
    setError("");
    setResult(null);

    try {
      const payload = JSON.parse(bodyText);
      const res = await apiRequest("/transactions/", { method: "POST", body: payload });
      setResult(res);
    } catch (e) {
      setError(e?.message || "Failed to create transaction");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Create Transaction</h1>

      <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
        <textarea
          value={bodyText}
          onChange={(e) => setBodyText(e.target.value)}
          rows={14}
          className="w-full font-mono text-xs border border-gray-300 rounded-lg p-3"
        />

        <button
          type="button"
          onClick={onSubmit}
          disabled={isLoading}
          className="px-4 py-2 rounded-lg bg-black text-white text-sm disabled:opacity-50"
        >
          {isLoading ? "Creating..." : "Create"}
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
