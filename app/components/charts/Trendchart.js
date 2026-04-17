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

    colors: ["#f3f4f6"], // lighter bar for contrast on black

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
    <div className="bg-black p-6 rounded-2xl shadow-lg border border-gray-800 transition-all duration-300 cursor-pointer group hover:shadow-2xl hover:scale-[1.03] hover:border-gray-500">

      <h2 className="text-white font-semibold mb-4 transition-colors duration-300 group-hover:text-gray-300">
        Weekly Transaction Trend
      </h2>

      <Chart options={options} series={series} type="bar" height={260} />
    </div>
  );
}