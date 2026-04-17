"use client";

import Table from "../../components/ui/Table";
import Card from "../../components/ui/Card";

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

// ✅ HOOK
import { useAnalysis } from "../../hooks/useAnalysis";

export default function ManagementDashboard() {

  // ✅ Treat as its own role
  const analysis = useAnalysis("management");

  const columns = [
    { key: "department", label: "Department" },
    { key: "task", label: "Task" },
    { key: "manager", label: "Manager" },
    { key: "status", label: "Status" },
    { key: "date", label: "Due Date" },
  ];

  const data = [
    { department: "Finance", task: "Q3 Budget Review", manager: "John Smith", status: "In Progress", date: "Today" },
    { department: "HR", task: "Employee Onboarding", manager: "Sarah Lee", status: "Completed", date: "Yesterday" },
    { department: "Operations", task: "Audit Compliance", manager: "Mike Chen", status: "Pending", date: "Tomorrow" },
    { department: "IT", task: "System Migration", manager: "David Kim", status: "In Progress", date: "2 days" },
    { department: "Marketing", task: "Campaign Analysis", manager: "Emma Wilson", status: "Review", date: "3 days" },
    { department: "Sales", task: "Quarterly Report", manager: "Alex Brown", status: "Completed", date: "Last week" },
    { department: "Legal", task: "Contract Review", manager: "Lisa Park", status: "Pending", date: "Next week" },
    { department: "Finance", task: "Expense Audit", manager: "John Smith", status: "In Progress", date: "Today" },
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        <Card
          title="Active Projects"
          value="12"
          icon={ListTodo}
          color="blue"
        />

        <Card
          title="Team Members"
          value="48"
          icon={Users}
          color="purple"
        />

        <Card
          title="Revenue Growth"
          value="+15%"
          icon={TrendingUp}
          color="green"
        />

      </div>

      {/* ✅ CHARTS */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* BIG LINE */}
        <div className="lg:col-span-2">
          <FraudTrendChart
            categories={analysis.line.categories}
            series={analysis.line.series}
          />
        </div>

        {/* PIE */}
        <RiskPieChart
          labels={analysis.pie.labels}
          series={analysis.pie.series}
        />

      </div>

      {/* BAR */}
      <div>
        <TransactionTrendChart
          categories={analysis.bar.categories}
          series={analysis.bar.series}
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

        <Table columns={columns} data={data} />

      </div>

    </div>
  );
}