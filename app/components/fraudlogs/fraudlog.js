"use client";

import { useState } from "react";
import Table from "../../components/ui/Table";
import { Filter } from "lucide-react";

export default function FraudLogPage() {
  const columns = [
    { key: "id", label: "Case ID" },
    { key: "user", label: "User" },
    { key: "type", label: "Fraud Type" },
    { key: "amount", label: "Amount" },
    { key: "risk", label: "Risk Level" },
    { key: "status", label: "Status" },
    { key: "date", label: "Date" },
  ];

  const [filter, setFilter] = useState({
    risk: "All",
    status: "All",
  });

  const data = [
    {
      id: "FRD-001",
      user: "John Doe",
      type: "Card Fraud",
      amount: "$1,200",
      risk: "High",
      status: "Investigating",
      date: "2026-04-12",
    },
    {
      id: "FRD-002",
      user: "Sarah Lee",
      type: "Login Anomaly",
      amount: "$0",
      risk: "Medium",
      status: "Reviewed",
      date: "2026-04-11",
    },
    {
      id: "FRD-003",
      user: "Mike Ross",
      type: "Transaction Spike",
      amount: "$5,800",
      risk: "High",
      status: "Blocked",
      date: "2026-04-10",
    },
    {
      id: "FRD-004",
      user: "Emma Stone",
      type: "Geo Mismatch",
      amount: "$320",
      risk: "Low",
      status: "Resolved",
      date: "2026-04-09",
    },
  ];

  // 🔥 FILTER LOGIC (core upgrade)
  const filteredData = data.filter((item) => {
    const riskMatch =
      filter.risk === "All" || item.risk === filter.risk;

    const statusMatch =
      filter.status === "All" || item.status === filter.status;

    return riskMatch && statusMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Fraud Log</h1>

        <div className="flex gap-3 items-center">

          {/* 🔥 Risk Filter */}
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm"
            value={filter.risk}
            onChange={(e) =>
              setFilter({ ...filter, risk: e.target.value })
            }
          >
            <option value="All">All Risk</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* 🔥 Status Filter */}
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm"
            value={filter.status}
            onChange={(e) =>
              setFilter({ ...filter, status: e.target.value })
            }
          >
            <option value="All">All Status</option>
            <option value="Investigating">Investigating</option>
            <option value="Reviewed">Reviewed</option>
            <option value="Blocked">Blocked</option>
            <option value="Resolved">Resolved</option>
          </select>

          <Filter size={18} className="text-gray-500" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
        <Table columns={columns} data={filteredData} />
      </div>
    </div>
  );
}