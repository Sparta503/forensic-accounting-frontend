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
  TrendingUp,
  Clock,
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
  const stats = useDashboardStore((s) => s.stats);
  const chartData = useDashboardStore((s) => s.chartData);
  const tableData = useDashboardStore((s) => s.tableData);
  const flaggedTransactions = useDashboardStore((s) => s.flaggedTransactions);
  const fetchDashboardData = useDashboardStore((s) => s.fetchDashboardData);
  const isLoading = useDashboardStore((s) => s.isLoading);

  // ✅ FETCH DATA
  useEffect(() => {
    fetchDashboardData("auditor");
  }, []);

  const auditorStats = stats.auditor;
  const auditorCharts = chartData.auditor;
  const auditorTable = tableData.auditor;

  const hasChartData = (() => {
    try {
      const pieSeries = auditorCharts?.pie?.series || [];
      const pieSum = pieSeries.reduce((s, v) => s + (typeof v === "number" ? v : 0), 0);
      if (pieSum > 0) return true;
      const lineSeries = auditorCharts?.line?.series || [];
      if (lineSeries.some((s) => Array.isArray(s.data) && s.data.some((n) => typeof n === "number" && n > 0))) return true;
      return false;
    } catch (e) {
      return false;
    }
  })();

  const highRiskFlagged = flaggedTransactions.filter(t => t.risk === "High");
  const mediumRiskFlagged = flaggedTransactions.filter(t => t.risk === "Medium");
  const pendingReview = flaggedTransactions.filter(t => t.status === "Flagged");

  const summaryCards = [
    {
      title: "Total Flagged",
      value: isLoading ? "..." : flaggedTransactions.length.toString(),
      icon: AlertTriangle,
      color: "red",
    },
    {
      title: "High Risk",
      value: isLoading ? "..." : highRiskFlagged.length.toString(),
      icon: TrendingUp,
      color: "red",
    },
    {
      title: "Medium Risk",
      value: isLoading ? "..." : mediumRiskFlagged.length.toString(),
      icon: Clock,
      color: "yellow",
    },
    {
      title: "Pending Review",
      value: isLoading ? "..." : pendingReview.length.toString(),
      icon: CheckCircle,
      color: "blue",
    },
  ];

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ml-40">
        {summaryCards.map((card, idx) => (
          <Card
            key={idx}
            title={card.title}
            value={card.value}
            icon={card.icon}
            color={card.color}
          />
        ))}
      </div>

      {/* CHARTS */}
      <h2 className="text-xl font-semibold text-gray-900 tracking-wide flex items-center gap-2 border-l-4 border-blue-500 pl-3">
        <ShieldCheck size={20} className="text-blue-600" />
        Graphical Summary
        <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${hasChartData ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
          {hasChartData ? 'Live Data' : 'Mock Data'}
        </span>
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