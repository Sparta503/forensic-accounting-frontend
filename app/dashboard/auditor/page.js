"use client";

import Card from "../../components/ui/Card";
import { AlertTriangle, ShieldCheck, CheckCircle, ClipboardList, Shield } from "lucide-react";
import Table from "../../components/ui/Table";

export default function AuditorDashboard() {

  const columns = [
    { key: "id", label: "Transaction ID" },
    { key: "amount", label: "Amount" },
    { key: "status", label: "Status" },
  ];

  const data = [
    { id: "#TX123", amount: "$5000", status: "High Risk" },
    { id: "#TX124", amount: "$200", status: "Review" },
    { id: "#TX125", amount: "$1200", status: "Resolved" },
    { id: "#TX126", amount: "$3500", status: "High Risk" },
    { id: "#TX127", amount: "$800", status: "Review" },
    { id: "#TX128", amount: "$150", status: "Resolved" },
    { id: "#TX129", amount: "$4200", status: "High Risk" },
    { id: "#TX130", amount: "$600", status: "Review" },
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
        Auditor Dashboard
      </h1>

      {/* CARDS */}
      <div className="grid grid-cols-3 gap-4 translate-x-[100px]">

        <Card
          title="Flagged Transactions"
          value="56"
          icon={AlertTriangle}
          color="red"
        />

        <Card
          title="High Risk Cases"
          value="12"
          icon={ShieldCheck}
          color="yellow"
        />

        <Card
          title="Resolved Cases"
          value="34"
          icon={CheckCircle}
          color="green"
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
          <ClipboardList size={20} className="text-blue-600" />
          Recent Fraud Alerts
        </h2>

        <Table columns={columns} data={data} />

      </div>

    </div>
  );
}