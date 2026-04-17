"use client";

import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function TransactionTrendChart() {
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
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      labels: {
        style: { colors: "#cbd5f5" },
      },
    },

    yaxis: {
      labels: {
        style: { colors: "#cbd5f5" },
      },
    },

    grid: {
      borderColor: "rgba(255,255,255,0.1)",
    },

    colors: ["#3b82f6"],

    tooltip: {
      theme: "dark",
    },
  };

  const series = [
    {
      name: "Transactions",
      data: [120, 200, 150, 300, 250, 400, 350],
    },
  ];

  return (
    <div className="bg-gradient-to-br from-blue-700 to-blue-900 p-6 rounded-2xl shadow-xl">

      <h2 className="text-white font-semibold mb-4">
        Weekly Transaction Trend
      </h2>

      <Chart options={options} series={series} type="bar" height={260} />
    </div>
  );
}