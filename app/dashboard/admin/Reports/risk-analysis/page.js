"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "../../../../lib/apiClient";
import Card from "../../../../components/ui/Card";
import { Zap, AlertTriangle, DollarSign, Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default function RiskAnalysisPage() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [analysisBodyText, setAnalysisBodyText] = useState("{}");
  const [selectedKind, setSelectedKind] = useState("financial");
  const [editorMode, setEditorMode] = useState("form"); // 'form' or 'json'

  const [financialForm, setFinancialForm] = useState({
    statement: {
      revenue: 1250000.0,
      net_income: 150000.0,
      current_assets: 300000.0,
      current_liabilities: 120000.0,
      total_assets: 1500000.0,
      total_liabilities: 600000.0,
      equity: 900000.0,
    },
    history: [
      { period: "2021", revenue: 900000.0, net_income: 80000.0 },
      { period: "2022", revenue: 1100000.0, net_income: 120000.0 },
      { period: "2023", revenue: 1250000.0, net_income: 150000.0 },
    ],
    transaction: {
      Amount: 3500.0,
      Date: "15/03/2024 14:30:00",
      Note: "Vendor payment - invoice 1234",
      Mode: "ACH",
      Category: "Supplies",
      Subcategory: "Office Supplies",
      "Income/Expense": "Expense",
      Currency: "USD",
    },
  });

  const [ratiosForm, setRatiosForm] = useState({
    revenue: 1250000.0,
    net_income: 150000.0,
    current_assets: 300000.0,
    current_liabilities: 120000.0,
    total_assets: 1500000.0,
    total_liabilities: 600000.0,
    equity: 900000.0,
  });

  const [trendsForm, setTrendsForm] = useState({
    history: [
      { period: "2021", revenue: 900000.0, net_income: 80000.0 },
      { period: "2022", revenue: 1100000.0, net_income: 120000.0 },
      { period: "2023", revenue: 1250000.0, net_income: 150000.0 },
    ],
    field: "revenue",
  });

  // keep analysisBodyText in sync with form when in form mode
  useEffect(() => {
    if (editorMode === "form") {
      const payload = selectedKind === "financial" ? financialForm : selectedKind === "ratios" ? ratiosForm : trendsForm;
      setAnalysisBodyText(JSON.stringify(payload, null, 2));
    }
  }, [editorMode, selectedKind, financialForm, ratiosForm, trendsForm]);
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

  // fraud summary removed from Risk Analysis view

  const renderPanelValue = (value) => {
    if (value === undefined) return "(no response)";
    if (value === null) return "(no data)";
    if (typeof value === "string") return value.length ? value : "(empty response)";
    return JSON.stringify(value, null, 2);
  };

  const toLabel = (key) => {
    return key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const formatNumber = (n) => {
    if (n === null || n === undefined) return "(no data)";
    if (typeof n !== "number") return String(n);
    if (!Number.isFinite(n)) return String(n);
    return (Math.round(n * 100) / 100).toLocaleString();
  };

  const formatRatioValue = (key, v) => {
    if (typeof v !== "number") return String(v);
    const lower = key.toLowerCase();
    if ((lower.includes("margin") || lower.includes("ratio") || lower.includes("debt")) && Math.abs(v) <= 1) {
      return `${(v * 100).toFixed(2)}%`;
    }
    return formatNumber(v);
  };

  const renderAnalysisPanel = (kind, value) => {
    if (value === undefined) return <div className="text-sm text-gray-500">(no response)</div>;
    if (value === null) return <div className="text-sm text-gray-500">(no data)</div>;
    if (typeof value === "string") return <div className="text-sm font-mono text-xs">{value}</div>;

    if (typeof value === "object") {
      if (kind === "ratios") {
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {Object.entries(value).map(([k, v]) => (
              <div key={k} className="flex justify-between items-center p-3 bg-white border rounded shadow-sm">
                <div className="text-sm text-gray-600">{toLabel(k)}</div>
                <div className="text-sm font-semibold text-gray-900">{formatRatioValue(k, v)}</div>
              </div>
            ))}
          </div>
        );
      }

      if (kind === "financial") {
        const parts = [];

        if (value.ratios) {
          parts.push(
            <div key="financial-ratios" className="space-y-1">
              <div className="text-sm font-semibold text-gray-900">Ratios</div>
              {renderAnalysisPanel("ratios", value.ratios)}
            </div>
          );
        }

        if (value.trends) {
          parts.push(
            <div key="financial-trends" className="space-y-1">
              <div className="text-sm font-semibold text-gray-900">Trends</div>
              {renderAnalysisPanel("trends", value.trends)}
            </div>
          );
        }

        if (value.validation) {
          const v = value.validation;
          parts.push(
            <div key="financial-validation" className="p-3 bg-white border rounded shadow-sm">
              <div className="text-sm font-semibold text-gray-900">Validation</div>
              <div className="mt-2 text-sm text-gray-700">Status: <span className="font-medium">{v.is_valid ? "Valid" : "Invalid"}</span></div>
              <div className="text-sm text-gray-700">Issues: <span className="font-medium">{Array.isArray(v.issues) && v.issues.length ? v.issues.length : 0}</span></div>
              {v.ratios ? (
                <div className="mt-3">
                  <div className="text-sm text-gray-800 font-semibold">Validation Ratios</div>
                  {renderAnalysisPanel("ratios", v.ratios)}
                </div>
              ) : null}
            </div>
          );
        }

        if (value.ml_detection) {
          const m = value.ml_detection;
          parts.push(
            <div key="financial-ml" className="p-3 bg-white border rounded shadow-sm">
              <div className="text-sm font-semibold text-gray-900">ML Detection</div>
              <div className="mt-2 text-sm text-gray-700">Flagged: <span className="font-medium">{m.ml_flag ? "Yes" : "No"}</span></div>
              <div className="text-sm text-gray-700">Score: <span className="font-medium">{typeof m.ml_score === 'number' ? (m.ml_score.toFixed(4)) : String(m.ml_score ?? '-')}</span></div>
            </div>
          );
        }

        // fallback: render any remaining top-level keys as key/value rows
        const remaining = Object.entries(value).filter(([k]) => !["ratios", "trends", "validation", "ml_detection"].includes(k));
        if (remaining.length) {
          parts.push(
            <div key="financial-others" className="space-y-1">
              {remaining.map(([k, v]) => (
                <div key={k} className="flex justify-between items-center p-3 bg-white border rounded shadow-sm">
                  <div className="text-sm text-gray-600">{toLabel(k)}</div>
                  <div className="text-sm font-semibold text-gray-900">{typeof v === 'number' ? formatNumber(v) : String(v)}</div>
                </div>
              ))}
            </div>
          );
        }

        return <div className="space-y-3">{parts}</div>;
      }

      if (kind === "trends") {
        // handle either: { metric: {trend,growth_rate,average} } OR single metric {trend,growth_rate,average}
        const isSingleMetric = ["trend", "growth_rate", "average"].some((k) => k in value) || Object.values(value).every((v) => typeof v !== "object");
        if (isSingleMetric) {
          const obj = value;
          return (
            <div className="p-3 bg-white border rounded shadow-sm">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-gray-900">{toLabel(kind)}</div>
                <div className="text-sm text-gray-600">{obj?.trend ?? "-"}</div>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-gray-700">
                <div>Growth: <span className="font-medium">{typeof obj?.growth_rate === 'number' ? `${(obj.growth_rate * 100).toFixed(2)}%` : String(obj?.growth_rate ?? '-')}</span></div>
                <div>Average: <span className="font-medium">{typeof obj?.average === 'number' ? formatNumber(obj.average) : String(obj?.average ?? '-')}</span></div>
              </div>
            </div>
          );
        }

        return (
          <div className="space-y-2">
            {Object.entries(value).map(([metric, obj]) => (
              <div key={metric} className="p-3 bg-white border rounded shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-gray-900">{toLabel(metric)}</div>
                  <div className="text-sm text-gray-600">{obj?.trend ?? String(obj ?? '-')}</div>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-gray-700">
                  <div>Growth: <span className="font-medium">{typeof obj?.growth_rate === 'number' ? `${(obj.growth_rate * 100).toFixed(2)}%` : String(obj?.growth_rate ?? '-')}</span></div>
                  <div>Average: <span className="font-medium">{typeof obj?.average === 'number' ? formatNumber(obj.average) : String(obj?.average ?? '-')}</span></div>
                </div>
              </div>
            ))}
          </div>
        );
      }

      return (
        <pre className="p-3 rounded bg-white border border-gray-300 text-gray-900 text-xs overflow-auto shadow-sm">{JSON.stringify(value, null, 2)}</pre>
      );
    }

    return <div>{String(value)}</div>;
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

  // raw JSON view removed — cards display key metrics instead

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-4">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-gray-900">Risk Analysis</h1>
        {isLoading ? <div className="text-sm text-gray-500">Loading…</div> : null}
      </div>

      {error ? (
        <div className="p-3 rounded border border-red-300 bg-red-50 text-red-700 text-sm">{error}</div>
      ) : null}

      {/* Risk metric cards (avg/high/medium/low/total) - always render, show placeholders while loading */}
      {(() => {
        const d = data || {};
        const rawAvg = d.avg_risk_score ?? d.avgRiskScore ?? d.average_risk_score ?? d.averageRiskScore ?? null;
        const rawHigh = d.high_risk_transactions ?? d.highRiskTransactions ?? d.high_risk ?? d.highRisk ?? null;
        const rawMedium = d.medium_risk_transactions ?? d.mediumRiskTransactions ?? d.medium_risk ?? d.mediumRisk ?? null;
        const rawLow = d.low_risk_transactions ?? d.lowRiskTransactions ?? d.low_risk ?? d.lowRisk ?? null;
        const rawTotal = d.total_transactions ?? d.totalTransactions ?? d.total ?? null;

        const cards = [
          { title: "Avg Risk Score", raw: rawAvg, icon: Zap, color: "purple" },
          { title: "High Risk Transactions", raw: rawHigh, icon: AlertTriangle, color: "red" },
          { title: "Medium Risk Transactions", raw: rawMedium, icon: Users, color: "yellow" },
          { title: "Low Risk Transactions", raw: rawLow, icon: Users, color: "green" },
          { title: "Total Transactions", raw: rawTotal, icon: DollarSign, color: "blue" },
        ];

        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {cards.map((c, i) => {
              let value;
              if (isLoading) value = "...";
              else if (c.raw === null || c.raw === undefined) value = "(no data)";
              else if (typeof c.raw === "number") value = String(Number.isFinite(c.raw) ? (Math.round(c.raw * 100) / 100) : c.raw);
              else value = String(c.raw);

              return <Card key={i} title={c.title} value={value} icon={c.icon} color={c.color} />;
            })}
          </div>
        );
      })()}

      {isLoading ? <div className="text-sm text-gray-500">Loading...</div> : null}

      {/* Fraud Summary removed */}

      {/* raw JSON view removed */}

      <h2 className="text-xl font-semibold text-gray-900">Analysis</h2>

      {analysisError ? (
        <div className="p-3 rounded border border-red-300 bg-red-50 text-red-700 text-sm">{analysisError}</div>
      ) : null}

      <div className="bg-white border border-gray-300 rounded-xl p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-900">Request body (used for Financial / Ratios / Trends)</div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-white mr-1">Form</label>
            <select
              value={editorMode}
              onChange={(e) => setEditorMode(e.target.value)}
              className="text-xs border border-gray-700 rounded px-2 py-1 bg-gray-900 text-white"
            >
              <option value="form">Form</option>
              <option value="json">JSON</option>
            </select>
            <label className="text-xs text-white mr-1">Analysis</label>
            <select value={selectedKind} onChange={(e) => setSelectedKind(e.target.value)} className="text-xs border border-gray-700 rounded px-2 py-1 bg-gray-900 text-white">
              <option value="financial">Financial</option>
              <option value="ratios">Ratios</option>
              <option value="trends">Trends</option>
            </select>
          </div>
        </div>

        {editorMode === "json" ? (
          <textarea
            value={analysisBodyText}
            onChange={(e) => setAnalysisBodyText(e.target.value)}
            rows={10}
            className="w-full font-mono text-xs border border-gray-300 rounded-lg p-3 bg-gray-50 text-gray-900"
          />
        ) : (
          // Form editor
            <div className="w-full space-y-3 bg-black p-4 rounded-lg text-white">
            {selectedKind === "financial" && (
              <div className="space-y-3">
                <div className="text-sm font-semibold text-white">Statement</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {Object.entries(financialForm.statement).map(([k, v]) => (
                    <div key={k} className="flex flex-col">
                      <label className="text-xs text-gray-300">{toLabel(k)}</label>
                      <input
                        type="text"
                        value={String(v)}
                        onChange={(e) => setFinancialForm((s) => ({ ...s, statement: { ...s.statement, [k]: Number(e.target.value || 0) } }))}
                        className="text-sm border border-gray-700 rounded p-2 bg-gray-900 text-white placeholder-gray-400"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold">History</div>
                    <button
                      type="button"
                      onClick={() => setFinancialForm((s) => ({ ...s, history: [...s.history, { period: "", revenue: 0, net_income: 0 }] }))}
                      className="text-xs px-2 py-1 bg-black text-white rounded"
                    >
                      Add row
                    </button>
                  </div>
                  <div className="mt-2 overflow-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="bg-gray-800">
                          <th className="p-2 text-left text-white">Period</th>
                          <th className="p-2 text-left text-white">Revenue</th>
                          <th className="p-2 text-left text-white">Net Income</th>
                          <th className="p-2"> </th>
                        </tr>
                      </thead>
                      <tbody>
                        {financialForm.history.map((row, i) => (
                          <tr key={i} className="border-b">
                            <td className="p-2"><input className="text-sm border border-gray-700 rounded p-1 bg-gray-900 text-white placeholder-gray-400" value={row.period} onChange={(e) => setFinancialForm((s) => { const h = [...s.history]; h[i] = { ...h[i], period: e.target.value }; return { ...s, history: h }; })} /></td>
                            <td className="p-2"><input className="text-sm border border-gray-700 rounded p-1 bg-gray-900 text-white placeholder-gray-400" value={String(row.revenue)} onChange={(e) => setFinancialForm((s) => { const h = [...s.history]; h[i] = { ...h[i], revenue: Number(e.target.value || 0) }; return { ...s, history: h }; })} /></td>
                            <td className="p-2"><input className="text-sm border border-gray-700 rounded p-1 bg-gray-900 text-white placeholder-gray-400" value={String(row.net_income)} onChange={(e) => setFinancialForm((s) => { const h = [...s.history]; h[i] = { ...h[i], net_income: Number(e.target.value || 0) }; return { ...s, history: h }; })} /></td>
                            <td className="p-2 text-center"><button className="text-xs text-red-600" onClick={() => setFinancialForm((s) => ({ ...s, history: s.history.filter((_, idx) => idx !== i) }))}>Remove</button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-semibold text-white">Transaction</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                    {Object.entries(financialForm.transaction).map(([k, v]) => (
                      <div key={k} className="flex flex-col">
                        <label className="text-xs text-gray-300">{toLabel(k)}</label>
                        <input value={String(v)} onChange={(e) => setFinancialForm((s) => ({ ...s, transaction: { ...s.transaction, [k]: e.target.value } }))} className="text-sm border border-gray-700 rounded p-2 bg-gray-900 text-white placeholder-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {selectedKind === "ratios" && (
              <div>
                <div className="text-sm font-semibold text-white">Ratios</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {Object.entries(ratiosForm).map(([k, v]) => (
                    <div key={k} className="flex flex-col">
                      <label className="text-xs text-gray-300">{toLabel(k)}</label>
                      <input value={String(v)} onChange={(e) => setRatiosForm((s) => ({ ...s, [k]: Number(e.target.value || 0) }))} className="text-sm border border-gray-700 rounded p-2 bg-gray-900 text-white placeholder-gray-400" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedKind === "trends" && (
              <div>
                <div className="text-sm font-semibold text-white">Trends</div>
                <div className="mt-2">
                  <div className="text-xs text-gray-600">Field</div>
                  <input value={trendsForm.field} onChange={(e) => setTrendsForm((s) => ({ ...s, field: e.target.value }))} className="text-sm border border-gray-700 rounded p-2 w-full bg-gray-900 text-white placeholder-gray-400" />
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold">History</div>
                    <button type="button" onClick={() => setTrendsForm((s) => ({ ...s, history: [...s.history, { period: "", revenue: 0, net_income: 0 }] }))} className="text-xs px-2 py-1 bg-black text-white rounded">Add row</button>
                  </div>
                  <div className="mt-2 overflow-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="bg-gray-800">
                          <th className="p-2 text-left text-white">Period</th>
                          <th className="p-2 text-left text-white">Revenue</th>
                          <th className="p-2 text-left text-white">Net Income</th>
                          <th className="p-2"> </th>
                        </tr>
                      </thead>
                      <tbody>
                        {trendsForm.history.map((row, i) => (
                          <tr key={i} className="border-b">
                            <td className="p-2"><input className="text-sm border border-gray-700 rounded p-1 bg-gray-900 text-white placeholder-gray-400" value={row.period} onChange={(e) => setTrendsForm((s) => { const h = [...s.history]; h[i] = { ...h[i], period: e.target.value }; return { ...s, history: h }; })} /></td>
                            <td className="p-2"><input className="text-sm border border-gray-700 rounded p-1 bg-gray-900 text-white placeholder-gray-400" value={String(row.revenue)} onChange={(e) => setTrendsForm((s) => { const h = [...s.history]; h[i] = { ...h[i], revenue: Number(e.target.value || 0) }; return { ...s, history: h }; })} /></td>
                            <td className="p-2"><input className="text-sm border border-gray-700 rounded p-1 bg-gray-900 text-white placeholder-gray-400" value={String(row.net_income)} onChange={(e) => setTrendsForm((s) => { const h = [...s.history]; h[i] = { ...h[i], net_income: Number(e.target.value || 0) }; return { ...s, history: h }; })} /></td>
                            <td className="p-2 text-center"><button className="text-xs text-red-600" onClick={() => setTrendsForm((s) => ({ ...s, history: s.history.filter((_, idx) => idx !== i) }))}>Remove</button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-3">
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
          {renderAnalysisPanel("financial", analysisResults.financial)}
        </div>
        <div className="space-y-2">
          <div className="text-sm font-semibold text-gray-900">Ratios</div>
          {renderAnalysisPanel("ratios", analysisResults.ratios)}
        </div>
        <div className="space-y-2">
          <div className="text-sm font-semibold text-gray-900">Trends</div>
          {renderAnalysisPanel("trends", analysisResults.trends)}
        </div>
      </div>
    </div>
  );
}
