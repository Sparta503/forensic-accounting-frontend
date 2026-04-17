"use client";

import { useEffect } from "react";
import Table from "../../components/ui/Table";
import Card from "../../components/ui/Card";
import { useDashboardStore } from "../../store/dashboardStore";

import {
  Users,
  TrendingUp,
  Building2,
  ListTodo,
} from "lucide-react";

// ✅ CHARTS
import FraudTrendChart from "../../components/charts/FraudPieChart";
import RiskPieChart from "../../components/charts/RiskChart";
import TransactionTrendChart from "../../components/charts/TrendChart";

export default function ManagementDashboard() {
  // ✅ GET DATA FROM STORE
  const { stats, chartData, tableData, fetchDashboardData, isLoading } = useDashboardStore();
  
  // ✅ FETCH DATA ON MOUNT
  useEffect(() => {
    fetchDashboardData("management");
  }, [fetchDashboardData]);

  const managementStats = stats.management;
  const managementCharts = chartData.management;
  const managementTable = tableData.management;

  const columns = [
    { key: "department", label: "Department" },
    { key: "task", label: "Task" },
    { key: "manager", label: "Manager" },
    { key: "status", label: "Status" },
    { key: "date", label: "Due Date" },
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
        <Building2 size={32} className="text-blue-600" />
        Management Dashboard
      </h1>

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ml-40">

        <Card
          title="Active Projects"
          value={isLoading ? "..." : managementStats.activeProjects.toString()}
          icon={ListTodo}
          color="blue"
        />

        <Card
          title="Team Members"
          value={isLoading ? "..." : managementStats.teamMembers.toString()}
          icon={Users}
          color="purple"
        />

        <Card
          title="Revenue Growth"
          value={isLoading ? "..." : `+${managementStats.revenueGrowth}%`}
          icon={TrendingUp}
          color="green"
        />

      </div>

      {/* ✅ CHARTS */}
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
        <TrendingUp size={20} className="text-blue-600" />
        Graphical Summary
      </h2>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* LINE */}
        <FraudTrendChart
          categories={managementCharts.line.categories}
          series={managementCharts.line.series}
        />

        {/* PIE */}
        <RiskPieChart
          labels={managementCharts.pie.labels}
          series={managementCharts.pie.series}
        />

        {/* BAR */}
        <TransactionTrendChart
          categories={managementCharts.bar.categories}
          series={managementCharts.bar.series}
        />

      </div>

      {/* TABLE */}
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
          <ListTodo size={20} className="text-blue-600" />
          Department Tasks Overview
        </h2>

        <Table columns={columns} data={managementTable} />

      </div>

    </div>
  );
}