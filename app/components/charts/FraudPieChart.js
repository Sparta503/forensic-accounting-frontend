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
    <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-2xl shadow-xl border border-gray-700 hover:border-gray-500 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer group">
      <h2 className="text-white mb-4 font-semibold group-hover:text-gray-200">
        Trend Analysis
      </h2>

      <Chart options={options} series={series} type="line" height={260} />
    </div>
  );
}