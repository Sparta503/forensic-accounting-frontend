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
import RiskTrendInline from "../../components/charts/RiskTrendInline";

// Force dynamic rendering to prevent static generation errors
export const dynamic = "force-dynamic";

export default function AdminDashboard() {
  // ✅ GET DATA FROM STORE
  const stats = useDashboardStore((s) => s.stats);
  const chartData = useDashboardStore((s) => s.chartData);
  const tableData = useDashboardStore((s) => s.tableData);
  const backendData = useDashboardStore((s) => s.backendData);
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
  // Prefer recent transactions for Recent Activity; fallback to tableData.admin
  const recentTx = Array.isArray(backendData?.transactions) ? backendData.transactions : [];
  const adminTable = (recentTx.length
    ? recentTx.slice(0, 20).map((t) => {
        const getField = (obj, keys) => {
          if (!obj || typeof obj !== "object") return undefined;
          for (const k of keys) {
            // support nested paths like "details.amount"
            if (k.includes(".")) {
              const parts = k.split(".");
              let cur = obj;
              let found = true;
              for (const p of parts) {
                if (cur && Object.prototype.hasOwnProperty.call(cur, p)) cur = cur[p];
                else { found = false; break; }
              }
              if (found && cur !== undefined) return cur;
            } else if (Object.prototype.hasOwnProperty.call(obj, k)) {
              return obj[k];
            }
          }
          return undefined;
        };

        const txId = getField(t, ["id", "_id", "transaction_id", "tx_id", "txn_id", "txnId", "transactionId", "reference", "ref"] ) || "";
        const amountRaw = getField(t, ["amount", "transaction_amount", "txn_amount", "value", "amt", "total", "Amount", "details.amount", "payload.amount", "amount_cents"]) ?? "";
        const amount = typeof amountRaw === "number" ? amountRaw.toLocaleString() : String(amountRaw || "");
        const time = getField(t, ["timestamp", "transaction_date", "createdAt", "created_at", "date", "Date"]) || "";
        const user = undefined;
        const category = undefined;
        const flagged = getField(t, ["is_flagged", "flagged", "is_fraud", "fraud", "status_flag"]);
        const status = (flagged === true || String(flagged) === "1" || String(flagged).toLowerCase() === "true") ? "Flagged" : "Not Flagged";

        return {
          transaction_id: txId,
          amount,
          time,
          status,
        };
      })
    : tableData.admin);

  const columns = [
    { key: "transaction_id", label: "Transaction ID" },
    { key: "amount", label: "Amount" },
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

        {(!adminCharts || isLoading) ? (
          <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-2xl shadow-xl border border-gray-700 animate-pulse h-[320px]" />
        ) : (
          <FraudTrendChart
            categories={safeAdminCharts.line.categories}
            series={safeAdminCharts.line.series}
          />
        )}

        {(!adminCharts || isLoading) ? (
          <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-2xl shadow-xl border border-gray-700 animate-pulse h-[320px]" />
        ) : (
          <RiskPieChart
            labels={safeAdminCharts.pie.labels}
            series={safeAdminCharts.pie.series}
          />
        )}

        {(!adminCharts || isLoading) ? (
          <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-2xl shadow-xl border border-gray-700 animate-pulse h-[320px]" />
        ) : (
          <RiskTrendInline role="admin" defaultHeight={260} expandedHeight={420} />
        )}

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
