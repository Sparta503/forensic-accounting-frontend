"use client";

import { Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LineChart } from "recharts";
import { useMemo, useState } from "react";
import { useDashboardStore } from "../../store/dashboardStore";

export default function RiskTrendInline({ role = "management", defaultHeight = 260, expandedHeight = 420, metric = "risk" }) {
  const chartForRole = useDashboardStore((s) => (s.chartData && s.chartData[role]) ? s.chartData[role] : null);
  const backendData = useDashboardStore((s) => s.backendData);
  const [expanded, setExpanded] = useState(false);

  const chartData = useMemo(() => {
    const tx = Array.isArray(backendData?.transactions) ? backendData.transactions : [];
    if (metric === "zscore_anomaly") {
      // extract anomaly z-scores from transaction text fields (fraud reasons)
      const extractAnomalyZ = (t) => {
        try {
          const reasons =
            t?.fraud_reasons ?? t?.fraudReasons ?? t?.reasons ?? t?.reason ?? t?.notes ?? t?.Note;
          const text = Array.isArray(reasons) ? reasons.join(" | ") : String(reasons ?? "");
          const m = text.match(/z[-\s]?score\s*anomaly\s*\(([-+]?\d*\.?\d+)\)/i);
          if (!m) return null;
          const n = Number(m[1]);
          return Number.isFinite(n) ? n : null;
        } catch (e) {
          return null;
        }
      };

      const points = tx
        .map((t, index) => {
          const z = extractAnomalyZ(t);
          if (z === null) return null;
          const label = t?.Date || t?.date || t?.transaction_date || t?.transactionDate || t?._id || t?.id || `Tx ${index + 1}`;
          return { name: String(label), risk: Math.round(z * 100) / 100 };
        })
        .filter(Boolean);

      return points.slice(-60);
    }

    if (tx.length > 1) {
      const points = tx
        .slice(0, 20)
        .map((t, index) => {
          const score =
            t?.risk_score ?? t?.riskScore ?? t?.risk ?? t?.risk_level ?? t?.riskLevel;
          const numeric = typeof score === "number" ? score : Number(String(score || "").match(/\d+/)?.[0] || 0);
          const label = t?.Date || t?.date || t?.transaction_date || t?.transactionDate || t?._id || t?.id || `Tx ${index + 1}`;
          return { name: String(label), risk: Number.isFinite(numeric) ? numeric : 0 };
        })
        .filter((p) => p && typeof p.risk === "number");

      return points;
    }

    const categories = chartForRole?.bar?.categories || [];
    const series = chartForRole?.bar?.series?.[0]?.data || [];
    const points = categories.map((name, i) => ({ name, risk: typeof series[i] === "number" ? series[i] : 0 }));
    return points;
  }, [backendData, chartForRole]);

  if (!chartData || chartData.length === 0) return null;

  const height = expanded ? expandedHeight : defaultHeight;

  const renderDot = (props) => {
    const { cx, cy, payload } = props;
    const val = payload?.risk;
    if (!Number.isFinite(val) || val === 0) return null;
    return <circle cx={cx} cy={cy} r={4} fill="#10b981" stroke="#065f46" strokeWidth={1} />;
  };

  return (
    <div className="bg-black p-6 rounded-2xl shadow-lg border border-gray-800 transition-all duration-300 group hover:shadow-2xl hover:scale-[1.03] hover:border-gray-500">
      <div className="flex items-start justify-between mb-3">
        <div className="text-white text-sm font-medium opacity-80">Risk Score Trend</div>
        <button
          onClick={() => setExpanded((s) => !s)}
          className="text-yellow-400 bg-black/20 px-3 py-1 rounded-full text-xs hover:bg-black/30"
        >
          {expanded ? "Collapse" : "Expand"}
        </button>
      </div>

      <div style={{ width: "100%", height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="name" tick={{ fill: "#9ca3af" }} />
            <YAxis tick={{ fill: "#9ca3af" }} />
            <Tooltip wrapperStyle={{ zIndex: 9999 }} />

            <Line type="monotone" dataKey="risk" stroke="#ef4444" strokeWidth={2} dot={renderDot} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
