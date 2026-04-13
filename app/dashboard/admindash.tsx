"use client";

import { Card } from "@/components/ui/Card";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      
      <h1 className="text-3xl font-bold">Admin Dashboard 🚀</h1>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Total Users" value="1,245" />
        <Card title="Total Transactions" value="8,920" />
        <Card title="Fraud Cases" value="134" />
      </div>

      {/* SYSTEM OVERVIEW */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">System Overview</h2>
        <p className="text-gray-600">
          Monitor all users, transactions, and fraud detection across the system.
        </p>
      </div>
    </div>
  );
}