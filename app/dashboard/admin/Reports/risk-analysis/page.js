"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "../../../../lib/apiClient";

export const dynamic = "force-dynamic";

export default function RiskAnalysisPage() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [analysisBodyText, setAnalysisBodyText] = useState("{}");
  const [analysisLoading, setAnalysisLoading] = useState("");
  const [analysisError, setAnalysisError] = useState("");
  const [analysisResults, setAnalysisResults] = useState({
    financial: null,
    ratios: null,
    trends: null,
  });

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

  const renderPanelValue = (value) => {
    if (value === undefined) return "(no response)";
    if (value === null) return "(no data)";
    if (typeof value === "string") return value.length ? value : "(empty response)";
    return JSON.stringify(value, null, 2);
  };

  const runAnalysis = async (kind) => {
    setAnalysisError("");
    setAnalysisLoading(kind);

    try {
      const payload = JSON.parse(analysisBodyText || "{}");

      const path =
        kind === "financial"
          ? "/analysis/financial"
          : kind === "ratios"
            ? "/analysis/ratios"
            : "/analysis/trends";

      const res = await apiRequest(path, { method: "POST", body: payload });

      setAnalysisResults((prev) => ({
        ...prev,
        [kind]: res,
      }));
    } catch (e) {
      setAnalysisError(e?.message || "Failed to run analysis");
    } finally {
      setAnalysisLoading("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Risk Analysis</h1>

      {error ? (
        <div className="p-3 rounded border border-red-300 bg-red-50 text-red-700 text-sm">{error}</div>
      ) : null}

      {isLoading ? <div className="text-sm text-gray-500">Loading...</div> : null}

      <pre className="p-4 rounded bg-white border border-gray-300 text-gray-900 text-xs overflow-auto shadow-sm">
        {JSON.stringify(data, null, 2)}
      </pre>

      <h2 className="text-xl font-semibold text-gray-900">Analysis</h2>

      {analysisError ? (
        <div className="p-3 rounded border border-red-300 bg-red-50 text-red-700 text-sm">{analysisError}</div>
      ) : null}

      <div className="bg-white border border-gray-300 rounded-xl p-4 space-y-3 shadow-sm">
        <div className="text-sm text-gray-900">Request body (used for Financial / Ratios / Trends)</div>
        <textarea
          value={analysisBodyText}
          onChange={(e) => setAnalysisBodyText(e.target.value)}
          rows={10}
          className="w-full font-mono text-xs border border-gray-300 rounded-lg p-3 bg-gray-50 text-gray-900"
        />

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => runAnalysis("financial")}
            disabled={analysisLoading !== ""}
            className="px-4 py-2 rounded-lg bg-black text-white text-sm disabled:opacity-50"
          >
            {analysisLoading === "financial" ? "Running..." : "Run Financial"}
          </button>
          <button
            type="button"
            onClick={() => runAnalysis("ratios")}
            disabled={analysisLoading !== ""}
            className="px-4 py-2 rounded-lg bg-black text-white text-sm disabled:opacity-50"
          >
            {analysisLoading === "ratios" ? "Running..." : "Run Ratios"}
          </button>
          <button
            type="button"
            onClick={() => runAnalysis("trends")}
            disabled={analysisLoading !== ""}
            className="px-4 py-2 rounded-lg bg-black text-white text-sm disabled:opacity-50"
          >
            {analysisLoading === "trends" ? "Running..." : "Run Trends"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <div className="text-sm font-semibold text-gray-900">Financial</div>
          <pre className="p-4 rounded bg-white border border-gray-300 text-gray-900 text-xs overflow-auto shadow-sm">
            {renderPanelValue(analysisResults.financial)}
          </pre>
        </div>
        <div className="space-y-2">
          <div className="text-sm font-semibold text-gray-900">Ratios</div>
          <pre className="p-4 rounded bg-white border border-gray-300 text-gray-900 text-xs overflow-auto shadow-sm">
            {renderPanelValue(analysisResults.ratios)}
          </pre>
        </div>
        <div className="space-y-2">
          <div className="text-sm font-semibold text-gray-900">Trends</div>
          <pre className="p-4 rounded bg-white border border-gray-300 text-gray-900 text-xs overflow-auto shadow-sm">
            {renderPanelValue(analysisResults.trends)}
          </pre>
        </div>
      </div>
    </div>
  );
}
