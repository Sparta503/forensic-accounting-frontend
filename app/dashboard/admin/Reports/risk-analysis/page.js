"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "../../../../lib/apiClient";

export const dynamic = "force-dynamic";

export default function RiskAnalysisPage() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function load() {
      setIsLoading(true);
      setError("");
      try {
        const res = await apiRequest("/reports/risk-analysis");
        if (mounted) setData(res);
      } catch (e) {
        if (mounted) setError(e?.message || "Failed to load risk analysis");
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Risk Analysis</h1>

      {error ? (
        <div className="p-3 rounded border border-red-300 bg-red-50 text-red-700 text-sm">{error}</div>
      ) : null}

      {isLoading ? <div className="text-sm text-gray-500">Loading...</div> : null}

      <pre className="p-4 rounded bg-white border border-gray-200 text-xs overflow-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
