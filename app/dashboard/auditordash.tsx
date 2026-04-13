"use client";

import { Card } from "@/components/ui/Card";

export default function AuditorDashboard() {
  return (
    <div className="space-y-6">
      
      <h1 className="text-3xl font-bold">Auditor Dashboard 🔍</h1>

      {/* FRAUD STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Flagged Transactions" value="56" />
        <Card title="High Risk Cases" value="21" />
        <Card title="Avg Risk Score" value="72%" />
      </div>

      {/* ANALYSIS */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Fraud Insights</h2>
        <p className="text-gray-600">
          Analyze suspicious patterns, anomalies, and financial irregularities.
        </p>
      </div>
    </div>
  );
}