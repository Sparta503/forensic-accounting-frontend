"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function PerformanceReport() {
  const [reports, setReports] = useState([]);

  // 📥 Load generated audit reports
  useEffect(() => {
    const stored =
      JSON.parse(localStorage.getItem("auditReports")) || [];
    setReports(stored);
  }, []);

  // 📊 Convert reports → chart data
  const chartData = reports.map((r, index) => {
    const riskMatch = r.riskScore?.match(/\d+/);
    const riskValue = riskMatch ? Number(riskMatch[0]) : 0;

    return {
      name: `Report ${index + 1}`,
      risk: riskValue,
    };
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-gray-900">

      {/* Header */}
      <h1 className="text-2xl font-bold mb-6">
        Performance Reports
      </h1>

      {/* Chart Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">

        <h2 className="text-lg font-semibold mb-4">
          Risk Score Trends (From Audit Reports)
        </h2>

        {reports.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No reports available yet. Generate audit reports first.
          </p>
        ) : (
          <LineChart width={700} height={300} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="risk"
              stroke="#ef4444"
              strokeWidth={2}
            />
          </LineChart>
        )}
      </div>

      {/* Optional summary */}
      <div className="mt-6 grid grid-cols-3 gap-4">

        <div className="bg-white p-4 border rounded-lg">
          <p className="text-sm text-gray-500">Total Reports</p>
          <p className="text-xl font-bold">{reports.length}</p>
        </div>

        <div className="bg-white p-4 border rounded-lg">
          <p className="text-sm text-gray-500">Avg Risk Score</p>
          <p className="text-xl font-bold">
            {reports.length
              ? Math.round(
                  chartData.reduce((a, b) => a + b.risk, 0) /
                    reports.length
                )
              : 0}
          </p>
        </div>

        <div className="bg-white p-4 border rounded-lg">
          <p className="text-sm text-gray-500">High Risk Reports</p>
          <p className="text-xl font-bold text-red-500">
            {
              chartData.filter((r) => r.risk >= 70).length
            }
          </p>
        </div>

      </div>
    </div>
  );
}