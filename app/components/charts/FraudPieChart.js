"use client";

import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function FraudTrendChart({ categories, series }) {
  const options = {
    chart: { toolbar: { show: false } },
    stroke: { curve: "smooth", width: 3 },

    xaxis: {
      categories,
      labels: { style: { colors: "#cbd5f5" } },
    },

    yaxis: {
      labels: { style: { colors: "#cbd5f5" } },
    },

    colors: ["#22c55e", "#ef4444"],
    tooltip: { theme: "dark" },
  };

  return (
    <div className="bg-gradient-to-br from-blue-700 to-blue-900 p-6 rounded-2xl shadow-xl">
      <h2 className="text-white mb-4 font-semibold">
        Trend Analysis
      </h2>

      <Chart options={options} series={series} type="line" height={260} />
    </div>
  );
}