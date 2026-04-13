"use client";

import { Card } from "@/components/ui/Card";

export default function UserDashboard() {
  return (
    <div className="space-y-6">
      
      <h1 className="text-3xl font-bold">My Dashboard 👤</h1>

      {/* USER STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="My Transactions" value="120" />
        <Card title="Spent This Month" value="$2,450" />
        <Card title="Risk Alerts" value="2" />
      </div>

      {/* PERSONAL INFO */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Account Summary</h2>
        <p className="text-gray-600">
          View your transactions and monitor your financial activity.
        </p>
      </div>
    </div>
  );
}