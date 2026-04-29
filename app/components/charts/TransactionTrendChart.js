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
}) {
  const [localCats, setLocalCats] = useState(categories ?? null);
  const [localSeries, setLocalSeries] = useState(series ?? null);
  const safeCategories = localCats ?? [];
  const safeSeries = localSeries ?? [];

  useEffect(() => {
    // If parent passed categories/series, respect them
    if (categories && series) return;

    // Only support monthly aggregation for now
    if (period !== "monthly") return;

    let mounted = true;

    async function loadAndAggregate() {
      try {
        const tx = await apiRequest("/transactions/");
        const items = Array.isArray(tx) ? tx : tx?.items || tx?.data || tx?.results || [];

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

        // Always show last 6 months for consistent axis
        const generateLastNMonths = (n) => {
          const out = [];
          const now = new Date();
          for (let i = n - 1; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            out.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
          }
          return out;
        };

        const finalKeys = generateLastNMonths(6);
        const monthLabels = finalKeys.map((k) => {
          const [y, m] = k.split("-");
          const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          return `${months[Number(m) - 1] || m} ${y}`;
        });

        const data = finalKeys.map((k) => monthCounts[k] || 0);

        if (mounted) {
          setLocalCats(labels);
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
  }, [categories, series, period]);

  const options = {
    chart: {
      toolbar: { show: false },
      background: "transparent",
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
        Monthly Transaction Trend
      </h2>

      <Chart options={options} series={safeSeries} type="bar" height={260} />

    </div>
  );
}