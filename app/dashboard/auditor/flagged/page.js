"use client";

import { useEffect, useMemo } from "react";
import Card from "../../../components/ui/Card";
import Table from "../../../components/ui/Table";
import { useDashboardStore } from "../../../store/dashboardStore";
import { AlertTriangle, TrendingUp, CheckCircle, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default function FlaggedTransactionsPage() {
  // ✅ GET DATA FROM STORE
  const flaggedTransactions = useDashboardStore((s) => s.flaggedTransactions);
  const fetchDashboardData = useDashboardStore((s) => s.fetchDashboardData);
  const stats = useDashboardStore((s) => s.stats);

  // ✅ FETCH DATA ON MOUNT
  useEffect(() => {
    fetchDashboardData("auditor");
  }, [fetchDashboardData]);

  const isLoading = useDashboardStore((s) => s.isLoading);
  const auditorStats = stats.auditor;
  const highRiskFlagged = flaggedTransactions.filter(t => t.risk === "High");
  const mediumRiskFlagged = flaggedTransactions.filter(t => t.risk === "Medium");

  const columns = useMemo(
    () => [
      { key: "transaction_id", label: "Transaction ID" },
      { key: "user", label: "User" },
      { key: "amount", label: "Amount" },
      { key: "risk", label: "Risk Level" },
      { key: "risk_score", label: "Risk Score" },
      { key: "status", label: "Status" },
      { key: "reason", label: "Reason" },
      { key: "timestamp", label: "Timestamp" },
    ],
    []
  );

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
      value: isLoading ? "..." : flaggedTransactions.filter(t => t.status === "Flagged").length.toString(),
      icon: CheckCircle,
      color: "blue",
    },
  ];

  return (
    <div className="space-y-8">
      {/* TITLE */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Flagged Transactions</h1>
        <p className="text-gray-600 mt-2">Transactions marked for review and investigation</p>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* FLAGGED TRANSACTIONS TABLE */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Flagged Transactions List</h2>
        {flaggedTransactions.length > 0 ? (
          <Table columns={columns} data={flaggedTransactions} />
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No flagged transactions at the moment.</p>
          </div>
        )}
      </div>

      {/* RISK DISTRIBUTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Risk Distribution</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">High Risk</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-gray-200 rounded-full">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: `${(highRiskFlagged.length / flaggedTransactions.length * 100) || 0}%` }}></div>
                </div>
                <span className="text-sm font-semibold text-gray-700">{highRiskFlagged.length}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Medium Risk</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-gray-200 rounded-full">
                  <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${(mediumRiskFlagged.length / flaggedTransactions.length * 100) || 0}%` }}></div>
                </div>
                <span className="text-sm font-semibold text-gray-700">{mediumRiskFlagged.length}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Summary</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex justify-between border-b pb-2">
              <span className="text-gray-700">Total Flagged</span>
              <span className="font-semibold text-gray-900">{flaggedTransactions.length}</span>
            </li>
            <li className="flex justify-between border-b pb-2">
              <span className="text-gray-700">Pending Review</span>
              <span className="font-semibold text-red-600">{flaggedTransactions.filter(t => t.status === "Flagged").length}</span>
            </li>
            <li className="flex justify-between border-b pb-2">
              <span className="text-gray-700">Average Risk Score</span>
              <span className="font-semibold text-gray-900">{(flaggedTransactions.reduce((sum, t) => sum + (t.risk_score || 0), 0) / flaggedTransactions.length || 0).toFixed(1)}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-700">Avg Amount</span>
              <span className="font-semibold text-gray-900">$6,480</span>
            </li>
          </ul>
        </div>
      </div>

      {isLoading && (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading flagged transactions...</p>
        </div>
      )}
    </div>
  );
}
