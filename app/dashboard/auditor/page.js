"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
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
import TransactionTrendChart from "../../components/charts/TransactionTrendChart";

// Force dynamic rendering to prevent static generation errors
export const dynamic = "force-dynamic";

function AuditorDashboardContent() {
  // ✅ SEARCH PARAMS (needed for Table filtering)
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  // ✅ STORE
  const {
    stats,
    chartData,
    tableData,
    fetchDashboardData,
    isLoading,
  } = useDashboardStore();

  // ✅ FETCH DATA
  useEffect(() => {
    fetchDashboardData("auditor");
  }, [fetchDashboardData]);

  const auditorStats = stats.auditor;
  const auditorCharts = chartData.auditor;
  const auditorTable = tableData.auditor;

  const columns = [
    { key: "Date", label: "Date" },
    { key: "Mode", label: "Mode" },
    { key: "Category", label: "Category" },
    { key: "Subcategory", label: "Subcategory" },
    { key: "Note", label: "Note" },
    { key: "Amount", label: "Amount" },
    { key: "Income/Expense", label: "Income/Expense" },
    { key: "Currency", label: "Currency" },
  ];

  return (
    <div className="space-y-8">

      {/* TITLE */}
      <h1 className="text-3xl font-bold tracking-wide text-gray-900 flex items-center gap-3 pb-2 border-b border-gray-300 w-fit">
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

      {/* CHARTS */}
      <h2 className="text-xl font-semibold text-gray-900 tracking-wide flex items-center gap-2 border-l-4 border-blue-500 pl-3">
        <ShieldCheck size={20} className="text-blue-600" />
        Graphical Summary
      </h2>

      <div className="grid lg:grid-cols-3 gap-6">

        <FraudTrendChart
          categories={auditorCharts.line.categories}
          series={auditorCharts.line.series}
        />

        <RiskPieChart
          labels={auditorCharts.pie.labels}
          series={auditorCharts.pie.series}
        />

        <TransactionTrendChart
          categories={auditorCharts.bar.categories}
          series={auditorCharts.bar.series}
        />

      </div>

      {/* TABLE */}
      <div className="space-y-3 pt-6">

        <h2 className="text-xl font-semibold text-gray-900 tracking-wide flex items-center gap-2 border-l-4 border-blue-500 pl-3">
          <ClipboardList size={20} className="text-blue-600" />
          Recent Fraud Alerts
        </h2>

        {/* ✅ PASS searchQuery */}
        <Table
          columns={columns}
          data={auditorTable}
          searchQuery={searchQuery}
        />

      </div>

    </div>
  );
}

export default function AuditorDashboard() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <AuditorDashboardContent />
    </Suspense>
  );
}