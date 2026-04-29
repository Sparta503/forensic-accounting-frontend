"use client";

import { useEffect } from "react";
import Table from "../../components/ui/Table";
import Card from "../../components/ui/Card";
import { useDashboardStore } from "../../store/dashboardStore";

import {
  Users,
  AlertTriangle,
  CreditCard,
  Shield,
  Activity,
} from "lucide-react";

// ✅ CHARTS
import FraudTrendChart from "../../components/charts/FraudPieChart";
import RiskPieChart from "../../components/charts/RiskChart";
import TransactionTrendChart from "../../components/charts/TransactionTrendChart";

// Force dynamic rendering to prevent static generation errors
export const dynamic = "force-dynamic";

export default function AdminDashboard() {
  // ✅ GET DATA FROM STORE
  const stats = useDashboardStore((s) => s.stats);
  const chartData = useDashboardStore((s) => s.chartData);
  const tableData = useDashboardStore((s) => s.tableData);
  const fetchDashboardData = useDashboardStore((s) => s.fetchDashboardData);
  const isLoading = useDashboardStore((s) => s.isLoading);
  
  // ✅ FETCH DATA ON MOUNT
  useEffect(() => {
    fetchDashboardData("admin");
  }, []);

  const adminStats = stats.admin;
  const adminCharts = chartData.admin;
  const safeAdminCharts = adminCharts || {
    line: { categories: [], series: [] },
    pie: { labels: [], series: [] },
    bar: { categories: [], series: [{ name: "", data: [] }] },
  };
  const adminTable = tableData.admin;

  const columns = [
    { key: "user", label: "User" },
    { key: "action", label: "Action" },
    { key: "time", label: "Time" },
    { key: "status", label: "Status" },
  ];

  return (
    <div className="space-y-8">

      {/* TITLE */}
      <h1 className="text-3xl font-bold tracking-wide text-gray-900 flex items-center gap-3 pb-2 border-b border-gray-300 w-fit">
        <Shield size={32} className="text-blue-600" />
        Admin Dashboard
      </h1>

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ml-40">

        <Card
          title="Total Users"
          value={isLoading ? "..." : Number(adminStats.totalUsers || 0).toLocaleString()}
          icon={Users}
          color="blue"
        />

        <Card
          title="Fraud Alerts"
          value={isLoading ? "..." : adminStats.fraudAlerts.toString()}
          icon={AlertTriangle}
          color="red"
        />

        <Card
          title="Transactions"
          value={isLoading ? "..." : Number(adminStats.transactions || 0).toLocaleString()}
          icon={CreditCard}
          color="purple"
        />

      </div>

      {/* CHARTS */}
      <h2 className="text-xl font-semibold text-gray-900 tracking-wide flex items-center gap-2 border-l-4 border-blue-500 pl-3">
        <Activity size={20} className="text-blue-600" />
        Graphical Summary
      </h2>

      <div className="grid lg:grid-cols-3 gap-6">

        <FraudTrendChart
          categories={safeAdminCharts.line.categories}
          series={safeAdminCharts.line.series}
        />

        <RiskPieChart
          labels={safeAdminCharts.pie.labels}
          series={safeAdminCharts.pie.series}
        />

        <TransactionTrendChart
          categories={safeAdminCharts.bar.categories}
          series={safeAdminCharts.bar.series}
        />

      </div>

      {/* TABLE */}
      <div className="space-y-3 pt-6">

        <h2 className="text-xl font-semibold text-gray-900 tracking-wide flex items-center gap-2 border-l-4 border-blue-500 pl-3">
          <Activity size={20} className="text-blue-600" />
          Recent Activity
        </h2>

        <Table columns={columns} data={adminTable} />

      </div>

    </div>
  );
}
