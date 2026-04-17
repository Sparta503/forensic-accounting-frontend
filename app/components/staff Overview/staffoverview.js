"use client";

import Table from "../../components/ui/Table";
import { Users } from "lucide-react";

export default function StaffOverview() {
  const columns = [
    { key: "name", label: "Name" },
    { key: "department", label: "Department" },
    { key: "role", label: "Role" },
    { key: "status", label: "Status" },
  ];

  const staff = [
    {
      id: 1,
      name: "John Mwangi",
      department: "Finance",
      role: "Auditor",
      status: "Active",
    },
    {
      id: 2,
      name: "Sarah Lee",
      department: "IT",
      role: "Security Analyst",
      status: "On Leave",
    },
    {
      id: 3,
      name: "Mike Ross",
      department: "Compliance",
      role: "Investigator",
      status: "Active",
    },
    {
      id: 4,
      name: "Emma Stone",
      department: "HR",
      role: "Manager",
      status: "Inactive",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-gray-900">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Users className="text-blue-600" />
        <h1 className="text-2xl font-bold">Staff Overview</h1>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Team Members</h2>
          <span className="text-sm text-gray-400">
            Internal workforce directory
          </span>
        </div>

        {/* UI TABLE (your component) */}
        <Table
          columns={columns}
          data={staff.map((s) => ({
            ...s,
            status: (
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium
                  ${
                    s.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : s.status === "On Leave"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
              >
                {s.status}
              </span>
            ),
          }))}
        />
      </div>

    </div>
  );
}