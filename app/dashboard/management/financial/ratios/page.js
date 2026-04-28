"use client";

import { useState } from "react";
import { apiRequest } from "../../../../lib/apiClient";

export const dynamic = "force-dynamic";

export default function FinancialRatiosPage() {
  const [bodyText, setBodyText] = useState("{}");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const run = async () => {
    setIsLoading(true);
    setError("");
    setResult(null);

    try {
      const payload = JSON.parse(bodyText || "{}");
      const res = await apiRequest("/financial/ratios", { method: "POST", body: payload });
      setResult(res);
    } catch (e) {
      setError(e?.message || "Failed to get ratios");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Financial Ratios</h1>

      <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
        <textarea
          value={bodyText}
          onChange={(e) => setBodyText(e.target.value)}
          rows={12}
          className="w-full font-mono text-xs border border-gray-300 rounded-lg p-3"
        />

        <button
          type="button"
          onClick={run}
          disabled={isLoading}
          className="px-4 py-2 rounded-lg bg-black text-white text-sm disabled:opacity-50"
        >
          {isLoading ? "Running..." : "Run"}
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
