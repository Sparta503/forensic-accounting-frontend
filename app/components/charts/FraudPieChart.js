"use client";

import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function FraudTrendChart({
  categories = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  series = [
    { name: "Fraud-free", data: [30, 40, 35, 50, 49, 60, 70] },
    { name: "Detected", data: [5, 10, 8, 15, 12, 20, 25] },
  ],
}) {
  const options = {
    chart: {
      background: "transparent",
    },

    xaxis: {
      categories: categories,
      labels: {
        style: { colors: "#e2e8f0" },
      },
    },

    yaxis: {
      labels: {
        style: { colors: "#e2e8f0" },
      },
    },

    stroke: {
      curve: "smooth",
      width: 3,
    },

    colors: ["#4ade80", "#f87171"], // green (safe), red (fraud)

    tooltip: {
      theme: "dark",
    },
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