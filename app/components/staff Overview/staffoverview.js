"use client";

import Table from "../../components/ui/Table";
import { Users } from "lucide-react";
import { useDashboardStore } from "../../store/dashboardStore";
import { apiRequest } from "../../lib/apiClient";
import { useEffect, useMemo, useState } from "react";

export default function StaffOverview() {
  const columns = [
    { key: "name", label: "Name" },
    { key: "department", label: "Department" },
    { key: "role", label: "Role" },
    { key: "status", label: "Status" },
  ];

  // GET STAFF DATA FROM DASHBOARD STORE
  const staffOverview = useDashboardStore((s) => s.staffOverview);
  const [rows, setRows] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const safeArray = (value) => {
      if (Array.isArray(value)) return value;
      if (value && typeof value === "object") {
        if (Array.isArray(value.items)) return value.items;
        if (Array.isArray(value.users)) return value.users;
        if (Array.isArray(value.data)) return value.data;
        if (Array.isArray(value.results)) return value.results;
      }
      return null;
    };

    const tryGetFirst = async (paths) => {
      let last = null;
      for (const p of paths) {
        try {
          return await apiRequest(p);
        } catch (e) {
          if (e?.status && e.status !== 404 && e.status !== 405) {
            throw e;
          }
          last = e;
        }
      }
      if (last) throw last;
      return null;
    };

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await tryGetFirst([
          "/users/",
          "/users",
          "/auth/users/",
          "/auth/users",
          "/admin/users/",
          "/admin/users",
          "/accounts/users/",
          "/accounts/users",
        ]);

        const arr = safeArray(res);
        if (!cancelled) {
          setRows(Array.isArray(arr) ? arr : []);
        }
      } catch (e) {
        if (!cancelled) {
          setRows(null);
          setError(e?.message || "Failed to load users");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const tableData = useMemo(() => {
    const source = Array.isArray(rows) && rows.length ? rows : staffOverview || [];

    return source.map((u) => {
      const name =
        u?.name ||
        u?.full_name ||
        u?.fullName ||
        u?.username ||
        u?.email ||
        "Unknown";

      const role = u?.role || u?.user_role || u?.userRole || u?.type || "-";
      const rawDepartment = u?.department || u?.dept || "";
      const roleKey = String(role || "").trim().toLowerCase();
      const derivedDepartment =
        roleKey === "admin" || roleKey.includes("admin")
          ? "Admin"
          : roleKey === "auditor" || roleKey.includes("audit")
            ? "Auditor"
            : roleKey === "management" || roleKey.includes("manage")
              ? "Management"
              : "-";
      const department = rawDepartment ? String(rawDepartment) : derivedDepartment;
      const statusText = u?.status || u?.state || "Active";
      const statusKey = String(statusText || "").trim().toLowerCase();

      return {
        name: String(name),
        department,
        role: String(role),
        status: (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium
              ${
                statusKey === "active" || statusKey === "logged in" || statusKey === "loggedin"
                  ? "bg-green-100 text-green-700"
                  : statusKey === "on leave" || statusKey === "onleave"
                  ? "bg-yellow-100 text-yellow-700"
                  : statusKey === "logged out" || statusKey === "loggedout"
                    ? "bg-gray-100 text-gray-700"
                  : "bg-gray-100 text-gray-600"
              }`}
          >
            {String(statusText)}
          </span>
        ),
      };
    });
  }, [rows, staffOverview]);

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

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* UI TABLE (your component) */}
        <Table
          columns={columns}
          data={loading ? [] : tableData}
        />
      </div>

    </div>
  );
}