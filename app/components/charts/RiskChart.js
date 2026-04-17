"use client";

import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function RiskPieChart() {
  const options = {
    chart: {
      background: "transparent",
    },

    labels: ["High Risk", "Medium", "Low"],

    colors: ["#ef4444", "#facc15", "#22c55e"],

    legend: {
      position: "bottom",
      labels: {
        colors: "#e2e8f0",
      },
    },

    dataLabels: {
      enabled: true,
      style: {
        colors: ["#fff"],
      },
    },

    stroke: {
      colors: ["#1f2937"], // gives clean separation
    },
  };

  const series = [44, 33, 23];

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-2xl shadow-xl border border-gray-700 hover:border-gray-500 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer group">

      <h2 className="text-white font-semibold mb-4 group-hover:text-gray-200">
        Risk Distribution
      </h2>

      <Chart options={options} series={series} type="donut" height={260} />
    </div>
  );
}