"use client";

import { useState } from "react";
import Table from "../../components/ui/Table";
import { Filter } from "lucide-react";
import { useDashboardStore } from "../../store/dashboardStore";

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

  // ✅ GET FRAUD LOGS FROM DASHBOARD STORE
  const { fraudLogs } = useDashboardStore();

  // 🔥 FILTER LOGIC (core upgrade)
  const filteredData = fraudLogs.filter((item) => {
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