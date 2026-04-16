"use client";

import Card from "../../components/ui/Card";
import Table from "../../components/ui/Table";
import { Users, AlertTriangle, CreditCard, Shield, Activity } from "lucide-react";

export default function AdminDashboard() {

  const columns = [
    { key: "user", label: "User" },
    { key: "action", label: "Action" },
    { key: "time", label: "Time" },
    { key: "status", label: "Status" },
  ];

  const data = [
    { user: "admin@system.com", action: "Login", time: "2 mins ago", status: "Success" },
    { user: "auditor@audit.com", action: "Report Generated", time: "15 mins ago", status: "Completed" },
    { user: "user@demo.com", action: "Transaction", time: "1 hour ago", status: "Pending" },
    { user: "admin@system.com", action: "User Created", time: "3 hours ago", status: "Success" },
    { user: "system", action: "Backup", time: "6 hours ago", status: "Success" },
    { user: "auditor@audit.com", action: "Fraud Alert", time: "8 hours ago", status: "Reviewed" },
    { user: "user@demo.com", action: "Password Change", time: "12 hours ago", status: "Success" },
    { user: "admin@system.com", action: "Settings Updated", time: "1 day ago", status: "Success" },
  ];

  return (
    <div className="space-y-6">

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
        <Shield size={32} className="text-blue-600" />
        Admin Dashboard
      </h1>

      {/* CARDS */}
      <div className="grid grid-cols-3 gap-4 translate-x-[100px]">

        <Card
          title="Total Users"
          value="1,245"
          icon={Users}
          color="blue"
        />

        <Card
          title="Fraud Alerts"
          value="23"
          icon={AlertTriangle}
          color="red"
        />

        <Card
          title="Transactions"
          value="8,902"
          icon={CreditCard}
          color="purple"
        />

      </div>

      {/* TABLE SECTION */}
      <div className="space-y-3 pt-16">

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
          <Activity size={20} className="text-blue-600" />
          Recent System Activity
        </h2>

        <Table columns={columns} data={data} />

      </div>

    </div>
  );
}