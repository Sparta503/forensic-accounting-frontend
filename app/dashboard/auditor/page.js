"use client";

import { useEffect } from "react";
import Card from "../../components/ui/Card";
import Table from "../../components/ui/Table";
import { useDashboardStore } from "../../store/dashboardStore";

import {
  AlertTriangle,
  ShieldCheck,
  CheckCircle,
  ClipboardList,
  Shield,
} from "lucide-react";

// ✅ CHARTS
import FraudTrendChart from "../../components/charts/FraudPieChart";
import RiskPieChart from "../../components/charts/RiskChart";
import TransactionTrendChart from "../../components/charts/TrendChart";

export default function AuditorDashboard() {
  // ✅ GET DATA FROM STORE
  const { stats, chartData, tableData, fetchDashboardData, isLoading } = useDashboardStore();
  
  // ✅ FETCH DATA ON MOUNT
  useEffect(() => {
    fetchDashboardData("auditor");
  }, [fetchDashboardData]);

  const auditorStats = stats.auditor;
  const auditorCharts = chartData.auditor;
  const auditorTable = tableData.auditor;

  const columns = [
    { key: "id", label: "Transaction ID" },
    { key: "amount", label: "Amount" },
    { key: "status", label: "Status" },
  ];

  return (
    <div className="space-y-8">

      {/* TITLE */}
      <h1
        className="
          text-3xl font-bold tracking-wide
          text-gray-900
          flex items-center gap-3
          pb-2
          border-b border-gray-300
          w-fit
        "
      >
        <Shield size={32} className="text-blue-600" />
        Auditor Dashboard
      </h1>

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ml-40">

        <Card
          title="Flagged Transactions"
          value={isLoading ? "..." : auditorStats.flaggedTransactions.toString()}
          icon={AlertTriangle}
          color="red"
        />

        <Card
          title="High Risk Cases"
          value={isLoading ? "..." : auditorStats.highRiskCases.toString()}
          icon={ShieldCheck}
          color="yellow"
        />

        <Card
          title="Resolved Cases"
          value={isLoading ? "..." : auditorStats.resolvedCases.toString()}
          icon={CheckCircle}
          color="green"
        />

      </div>

      {/* ✅ CHARTS SECTION */}
      <h2
        className="
          text-xl font-semibold
          text-gray-900
          tracking-wide
          flex items-center gap-2
          border-l-4 border-blue-500
          pl-3
        "
      >
        <ShieldCheck size={20} className="text-blue-600" />
        Graphical Summary
      </h2>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* LINE CHART */}
        <FraudTrendChart
          categories={auditorCharts.line.categories}
          series={auditorCharts.line.series}
        />

        {/* PIE CHART */}
        <RiskPieChart
          labels={auditorCharts.pie.labels}
          series={auditorCharts.pie.series}
        />

        {/* BAR CHART */}
        <TransactionTrendChart
          categories={auditorCharts.bar.categories}
          series={auditorCharts.bar.series}
        />

      </div>

      {/* TABLE SECTION */}
      <div className="space-y-3 pt-6">

        <h2
          className="
            text-xl font-semibold
            text-gray-900
            tracking-wide
            flex items-center gap-2
            border-l-4 border-blue-500
            pl-3
          "
        >
          <ClipboardList size={20} className="text-blue-600" />
          Recent Fraud Alerts
        </h2>

        <Table columns={columns} data={auditorTable} />

      </div>

    </div>
  );
}