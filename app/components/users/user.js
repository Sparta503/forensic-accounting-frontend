"use client";

import { useState } from "react";
import Table from "../../components/ui/Table";
import { Search, Users } from "lucide-react";
import { useDashboardStore } from "../../store/dashboardStore";

export default function UsersPage() {
  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
    { key: "status", label: "Status" },
    { key: "lastActive", label: "Last Active" },
  ];

  const [search, setSearch] = useState("");

  // GET USERS FROM DASHBOARD STORE
  const { users } = useDashboardStore();

  // search filter
  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  // UPDATE DASHBOARD STATS to match user count
  const { setStats } = useDashboardStore.getState();
  // Auto-update admin stats when user count changes
  const currentStats = useDashboardStore.getState().stats.admin;
  if (currentStats.totalUsers !== users.length) {
    setStats("admin", { ...currentStats, totalUsers: users.length });
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-gray-900">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Users className="text-blue-600" />
        <h1 className="text-2xl font-bold">Users Management</h1>
      </div>

      {/* Controls */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm mb-4">

        <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 bg-white w-full md:w-1/2">
          <Search size={16} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search users..."
            className="w-full outline-none text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">

        <Table
          columns={columns}
          data={filteredUsers.map((u) => ({
            ...u,

            // 🎯 Role badge
            role: (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                {u.role}
              </span>
            ),

            // 🎯 Status badge
            status: (
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium
                  ${
                    u.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : u.status === "Inactive"
                      ? "bg-gray-100 text-gray-600"
                      : "bg-red-100 text-red-700"
                  }`}
              >
                {u.status}
              </span>
            ),
          }))}
        />

      </div>

    </div>
  );
}