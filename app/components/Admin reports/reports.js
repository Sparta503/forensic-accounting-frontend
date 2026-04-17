"use client";

import { useState } from "react";
import Table from "../../components/ui/Table";
import { Search, Filter } from "lucide-react";

export default function AdminReports() {
  const columns = [
    { key: "id", label: "Report ID" },
    { key: "title", label: "Title" },
    { key: "department", label: "Department" },
    { key: "risk", label: "Risk Level" },
    { key: "status", label: "Status" },
    { key: "date", label: "Date" },
  ];

  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");

  const reports = [
    {
      id: "RPT-001",
      title: "Fraud Detection Summary",
      department: "Finance",
      risk: "High",
      status: "Pending Review",
      date: "2026-04-10",
    },
    {
      id: "RPT-002",
      title: "Audit Compliance Report",
      department: "Compliance",
      risk: "Medium",
      status: "Approved",
      date: "2026-04-09",
    },
    {
      id: "RPT-003",
      title: "System Anomaly Report",
      department: "IT",
      risk: "High",
      status: "Under Review",
      date: "2026-04-08",
    },
    {
      id: "RPT-004",
      title: "Staff Activity Report",
      department: "HR",
      risk: "Low",
      status: "Resolved",
      date: "2026-04-07",
    },
  ];

  // 🔥 filtering logic (modern admin pattern)
  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.department.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase());

    const matchesRisk =
      riskFilter === "All" || r.risk === riskFilter;

    return matchesSearch && matchesRisk;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-gray-900">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">

        <div>
          <h1 className="text-2xl font-bold">Admin Reports</h1>
          <p className="text-sm text-gray-500">
            Manage and review system-generated reports
          </p>
        </div>

      </div>

      {/* Controls */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm mb-4">

        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">

          {/* Search */}
          <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 bg-white w-full md:w-1/2">
            <Search size={16} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search reports..."
              className="w-full outline-none text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-500" />

            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option value="All">All Risk</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

        </div>

      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">

        <Table
          columns={columns}
          data={filteredReports.map((r) => ({
            ...r,

            // 🎯 modern badge styling
            risk: (
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium
                  ${
                    r.risk === "High"
                      ? "bg-red-100 text-red-700"
                      : r.risk === "Medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
              >
                {r.risk}
              </span>
            ),

            status: (
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium
                  ${
                    r.status === "Approved"
                      ? "bg-green-100 text-green-700"
                      : r.status === "Pending Review"
                      ? "bg-yellow-100 text-yellow-700"
                      : r.status === "Under Review"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
              >
                {r.status}
              </span>
            ),
          }))}
        />

      </div>

    </div>
  );
}