"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { apiRequest } from "../../lib/apiClient";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function FraudTrendChart({ title = "Per-transaction Z-Scores" }) {
  const [cats, setCats] = useState([]);
  const [series, setSeries] = useState([]);

  useEffect(() => {
    let mounted = true;

    async function load() {
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
            const m = text.match(/z[-\s]?score\s*anomaly\s*\(([-+]?\d*\.?\d+)\)/i);
            if (!m) return null;
            const n = Number(m[1]);
            return Number.isFinite(n) ? n : null;
          } catch (e) {
            return null;
          }
        };

        const extractId = (t) => {
          if (!t) return null;
          return (
            t?.transaction_id ?? t?.transactionId ?? t?.txid ?? t?.id ?? t?._id ?? t?.id_str ?? t?.reference ?? null
          );
        };

        // Plot per-transaction z-scores (use last 200 transactions with zscore)
        const out = [];
        for (let i = items.length - 1; i >= 0 && out.length < 200; i--) {
          const t = items[i];
          const z = extractAnomalyZ(t);
          if (z === null) continue;
          const id = extractId(t) || (t?.timestamp ?? t?.Date ?? t?.date ?? String(i));
          out.unshift({ id: String(id), z: Math.round(z * 100) / 100 });
        }

        const labels = out.map((o) => o.id);
        const data = out.map((o) => o.z);
        if (mounted) {
          setCats(labels);
          setSeries([{ name: "Z-Score", data }]);
        }
      } catch (e) {
        // ignore
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const options = {
    chart: { toolbar: { show: false }, background: "transparent" },
    stroke: { curve: "smooth", width: 3 },
    dataLabels: { enabled: false },
    xaxis: { categories: cats, labels: { style: { colors: "#9ca3af" } } },
    yaxis: { labels: { style: { colors: "#9ca3af" } } },
    grid: { borderColor: "rgba(255,255,255,0.04)" },
    colors: ["#f97316"],
    tooltip: { theme: "dark" },
    markers: { size: 6 },
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      <div className="mt-3 bg-white/5 p-4 rounded-2xl">
        <Chart options={options} series={series} type="line" height={260} />
      </div>
    </div>
  );
}
