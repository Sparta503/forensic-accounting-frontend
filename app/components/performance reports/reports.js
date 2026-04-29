"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useEffect, useMemo } from "react";
import { useDashboardStore } from "../../store/dashboardStore";

export default function PerformanceReport() {
  const auditReports = useDashboardStore((s) => s.auditReports);
  const performanceReports = useDashboardStore((s) => s.performanceReports);
  const managementCharts = useDashboardStore((s) => s.chartData.management);
  const backendData = useDashboardStore((s) => s.backendData);
  const fetchDashboardData = useDashboardStore((s) => s.fetchDashboardData);

  useEffect(() => {
    fetchDashboardData("management");
  }, []);

  const { allReports, chartData } = useMemo(() => {
    const merged = [...(auditReports || []), ...(performanceReports || [])];
    if (merged.length) {
      const points = merged.map((r, index) => {
        const riskMatch = r?.riskLevel?.match(/\d+/) || r?.riskScore?.match(/\d+/);
        const riskValue = riskMatch ? Number(riskMatch[0]) : 0;
        return {
          name: `Report ${index + 1}`,
          risk: riskValue || 50,
        };
      });
      return { allReports: merged, chartData: points };
    }

    const categories = managementCharts?.bar?.categories || [];
    const series = managementCharts?.bar?.series?.[0]?.data || [];
    const points = categories.map((name, i) => ({
      name,
      risk: typeof series[i] === "number" ? series[i] : 0,
    }));
    return { allReports: [], chartData: points };
  }, [auditReports, performanceReports, managementCharts]);

  const { totalReportsCount, highRiskReportsCount } = useMemo(() => {
    const tx = Array.isArray(backendData?.transactions) ? backendData.transactions : [];
    const flagged = Array.isArray(backendData?.flagged) ? backendData.flagged : [];

    const totalFromBackend = tx.length > 0 ? tx.length : null;

    const highRiskFromFlagged = flagged.length > 0 ? flagged.length : null;
    const highRiskFromTransactions = tx.length
      ? tx.filter((t) => {
          const score =
            t?.risk_score ??
            t?.riskScore ??
            t?.risk ??
            t?.risk_level ??
            t?.riskLevel;

          const numeric = typeof score === "number" ? score : Number(String(score || "").match(/\d+/)?.[0] || 0);

          return (
            t?.is_flagged === true ||
            t?.is_fraud === true ||
            t?.flagged === true ||
            t?.fraud === true ||
            numeric >= 70
          );
        }).length
      : null;

    const totalFallback = allReports.length || chartData.length;
    const highRiskFallback = chartData.filter((r) => r.risk >= 70).length;

    return {
      totalReportsCount: totalFromBackend ?? totalFallback,
      highRiskReportsCount:
        highRiskFromFlagged ??
        highRiskFromTransactions ??
        highRiskFallback,
    };
  }, [backendData, allReports.length, chartData]);

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

        {chartData.length === 0 ? (
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
          <p className="text-xl font-bold">{totalReportsCount}</p>
        </div>

        <div className="bg-white p-4 border rounded-lg">
          <p className="text-sm text-gray-500">Avg Risk Score</p>
          <p className="text-xl font-bold">
            {chartData.length
              ? Math.round(
                  chartData.reduce((a, b) => a + b.risk, 0) /
                    chartData.length
                )
              : 0}
          </p>
        </div>

        <div className="bg-white p-4 border rounded-lg">
          <p className="text-sm text-gray-500">High Risk Reports</p>
          <p className="text-xl font-bold text-red-500">
            {
              highRiskReportsCount
            }
          </p>
        </div>

      </div>
    </div>
  );
}