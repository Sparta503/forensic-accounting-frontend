"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { apiRequest } from "../../lib/apiClient";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function TransactionTrendChart({
  categories,
  series,
  // period can be 'monthly' (default) or other in future
  period = "monthly",
  metric = "count",
  title,
}) {
  const [localCats, setLocalCats] = useState(categories ?? null);
  const [localSeries, setLocalSeries] = useState(series ?? null);
  const safeCategories = localCats ?? [];
  const safeSeries = localSeries ?? [];

  useEffect(() => {
    // If parent passed categories/series, respect them
    if (categories && series) return;

    // Only support monthly/daily aggregation for now
    if (period !== "monthly" && period !== "daily") return;

    let mounted = true;

    async function loadAndAggregate() {
      try {
        const tx = await apiRequest("/transactions/");
        const items = Array.isArray(tx) ? tx : tx?.items || tx?.data || tx?.results || [];

        const extractAnomalyZ = (t) => {
          try {
            const reasons =
              t?.fraud_reasons ??
              t?.fraudReasons ??
              t?.reasons ??
              t?.reason ??
              t?.notes ??
              t?.Note;

            const text = Array.isArray(reasons) ? reasons.join(" | ") : String(reasons ?? "");
            // Matches: "Z-score anomaly (57.72)" or "Z score anomaly (57.72)"
            const m = text.match(/z[-\s]?score\s*anomaly\s*\(([-+]?\d*\.?\d+)\)/i);
            if (!m) return null;
            const n = Number(m[1]);
            return Number.isFinite(n) ? n : null;
          } catch (e) {
            return null;
          }
        };

        const toDateKey = (ts) => {
          try {
            if (!ts) return null;
            const s = String(ts).trim();

            const d = new Date(s);
            if (!isNaN(d)) {
              return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
            }

            // Try YYYY-MM-DD or YYYY/MM/DD
            let m = s.match(/(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})/);
            if (m) {
              return `${m[1]}-${String(m[2]).padStart(2, "0")}-${String(m[3]).padStart(2, "0")}`;
            }

            // Try DD/MM/YYYY or D/M/YYYY
            m = s.match(/(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})/);
            if (m) {
              return `${m[3]}-${String(m[2]).padStart(2, "0")}-${String(m[1]).padStart(2, "0")}`;
            }

            return null;
          } catch (e) {
            return null;
          }
        };

        // Plot actual per-transaction anomaly z-score values over time (daily buckets)
        if (metric === "zscore_anomaly") {
          const dayMax = {};

          items.forEach((t) => {
            const z = extractAnomalyZ(t);
            if (z === null) return;

            const key = toDateKey(
              t?.timestamp ?? t?.Date ?? t?.date ?? t?.transaction_date ?? t?.transactionDate ?? t?.createdAt ?? t?.created_at
            );
            if (!key) return;
            dayMax[key] = Math.max(dayMax[key] ?? -Infinity, z);
          });

          const toKey = (d) =>
            `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
          const parseKey = (k) => {
            const m = String(k).match(/^(\d{4})-(\d{2})-(\d{2})$/);
            if (!m) return null;
            return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
          };
          const generateLastNDays = (n) => {
            const out = [];
            const now = new Date();
            for (let i = n - 1; i >= 0; i--) {
              const d = new Date(now);
              d.setDate(now.getDate() - i);
              out.push(toKey(d));
            }
            return out;
          };
          const generateDayRange = (startDate, endDate) => {
            const out = [];
            if (!startDate || !endDate) return out;
            const d = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
            const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
            while (d <= end) {
              out.push(toKey(d));
              d.setDate(d.getDate() + 1);
              if (out.length > 90) break; // safety cap
            }
            return out;
          };

          const presentKeys = Object.keys(dayMax).sort();
          const now = new Date();
          const last30Start = new Date(now);
          last30Start.setDate(now.getDate() - 29);
          const last30End = new Date(now);

          let finalKeys = generateLastNDays(30);
          if (presentKeys.length > 0) {
            const first = parseKey(presentKeys[0]);
            const last = parseKey(presentKeys[presentKeys.length - 1]);
            const start = first && first < last30Start ? first : last30Start;
            const end = last && last > last30End ? last : last30End;
            const range = generateDayRange(start, end);
            finalKeys = range.length > 0 ? range : finalKeys;
          }

          const labels = finalKeys.map((k) => {
            const d = parseKey(k);
            if (!d) return k;
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            return `${months[d.getMonth()]} ${String(d.getDate()).padStart(2, "0")}`;
          });
          const data = finalKeys.map((k) => {
            const v = dayMax[k];
            return typeof v === "number" && Number.isFinite(v) ? Math.round(v * 100) / 100 : 0;
          });

          if (mounted) {
            setLocalCats(labels);
            setLocalSeries([{ name: "Z-Score Anomaly", data }]);
          }
          return;
        }

        const monthCounts = {};
        const toMonthKey = (ts) => {
          try {
            if (!ts) return null;
            const s = String(ts).trim();

            // Try native Date parse first
            const d = new Date(s);
            if (!isNaN(d)) return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

            // Try YYYY-MM-DD or YYYY/MM/DD
            let m = s.match(/(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})/);
            if (m) return `${m[1]}-${String(m[2]).padStart(2, "0")}`;

            // Try DD/MM/YYYY or D/M/YYYY
            m = s.match(/(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})/);
            if (m) return `${m[3]}-${String(m[2]).padStart(2, "0")}`;

            return null;
          } catch (e) {
            return null;
          }
        };

        items.forEach((t) => {
          const k = toMonthKey(
            t?.timestamp ?? t?.Date ?? t?.date ?? t?.transaction_date ?? t?.transactionDate ?? t?.createdAt ?? t?.created_at
          );
          if (!k) return;
          monthCounts[k] = (monthCounts[k] || 0) + 1;
        });

        // Build a continuous month range so the chart always has multiple points
        // (even if backend data only exists for a single month).
        const toKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        const parseKey = (k) => {
          const m = String(k).match(/^(\d{4})-(\d{2})$/);
          if (!m) return null;
          return new Date(Number(m[1]), Number(m[2]) - 1, 1);
        };
        const generateLastNMonths = (n) => {
          const out = [];
          const now = new Date();
          for (let i = n - 1; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            out.push(toKey(d));
          }
          return out;
        };
        const generateMonthRange = (startDate, endDate) => {
          const out = [];
          if (!startDate || !endDate) return out;
          const d = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
          const end = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
          while (d <= end) {
            out.push(toKey(d));
            d.setMonth(d.getMonth() + 1);
            if (out.length > 24) break; // safety cap
          }
          return out;
        };

        const presentKeys = Object.keys(monthCounts).sort();
        const now = new Date();
        const last12Start = new Date(now.getFullYear(), now.getMonth() - 11, 1);
        const last12End = new Date(now.getFullYear(), now.getMonth(), 1);

        if (presentKeys.length > 0) {
          const first = parseKey(presentKeys[0]);
          const last = parseKey(presentKeys[presentKeys.length - 1]);
          const start = first && first < last12Start ? first : last12Start;
          const end = last && last > last12End ? last : last12End;
          const rangeKeys = generateMonthRange(start, end);
          const finalKeys = rangeKeys.length > 0 ? rangeKeys : generateLastNMonths(12);

          const monthLabels = finalKeys.map((k) => {
            const [y, m] = k.split("-");
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            return `${months[Number(m) - 1] || m} ${y}`;
          });

          const data = finalKeys.map((k) => monthCounts[k] || 0);

          if (metric === "zscore") {
            const mean = data.reduce((s, v) => s + v, 0) / (data.length || 1);
            const variance = data.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / (data.length || 1);
            const std = Math.sqrt(variance);
            const z = data.map((v) => (std > 0 ? (v - mean) / std : 0));

            if (mounted) {
              setLocalCats(monthLabels);
              setLocalSeries([{ name: "Z-Score", data: z.map((n) => Math.round(n * 100) / 100) }]);
            }
            return;
          }

          if (mounted) {
            setLocalCats(monthLabels);
            setLocalSeries([{ name: "Transactions", data }]);
          }
          return;
        }

        // No usable months detected — fall back
        const finalKeys = generateLastNMonths(12);
        const monthLabels = finalKeys.map((k) => {
          const [y, m] = k.split("-");
          const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          return `${months[Number(m) - 1] || m} ${y}`;
        });

        const data = finalKeys.map((k) => monthCounts[k] || 0);

        if (metric === "zscore") {
          const mean = data.reduce((s, v) => s + v, 0) / (data.length || 1);
          const variance = data.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / (data.length || 1);
          const std = Math.sqrt(variance);
          const z = data.map((v) => (std > 0 ? (v - mean) / std : 0));

          if (mounted) {
            setLocalCats(monthLabels);
            setLocalSeries([{ name: "Z-Score", data: z.map((n) => Math.round(n * 100) / 100) }]);
          }
          return;
        }

        if (mounted) {
          setLocalCats(monthLabels);
          setLocalSeries([{ name: "Transactions", data }]);
        }
      } catch (e) {
        // ignore — chart will render empty
      }
    }

    loadAndAggregate();

    return () => {
      mounted = false;
    };
  }, [categories, series, period, metric]);

  const options = {
    chart: {
      toolbar: { show: false },
      background: "transparent",
    },

    stroke: {
      curve: "smooth",
      width: metric === "zscore" || metric === "zscore_anomaly" ? 3 : 0,
    },

    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: "50%",
      },
    },

    dataLabels: {
      enabled: false,
    },

    xaxis: {
      categories: safeCategories,
      labels: {
        style: { colors: "#9ca3af" },
      },
    },

    yaxis: {
      labels: {
        style: { colors: "#9ca3af" },
      },
    },

    grid: {
      borderColor: "rgba(255,255,255,0.08)",
    },

    colors: ["#f3f4f6"],

    tooltip: {
      theme: "dark",
    },
  };

  return (
    <div className="bg-black p-6 rounded-2xl shadow-lg border border-gray-800 transition-all duration-300 cursor-pointer group hover:shadow-2xl hover:scale-[1.03] hover:border-gray-500">

      <h2 className="text-white font-semibold mb-4 transition-colors duration-300 group-hover:text-gray-300">
        {title || (metric === "zscore" || metric === "zscore_anomaly" ? "Z-Score Anomaly Trend" : "Monthly Transaction Trend")}
      </h2>

      <Chart
        options={options}
        series={safeSeries}
        type={metric === "zscore" || metric === "zscore_anomaly" ? "line" : "bar"}
        height={260}
      />

    </div>
  );
}