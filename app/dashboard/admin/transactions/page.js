"use client";

import { useEffect, useMemo, useState } from "react";
import Table from "../../../components/ui/Table";
import { apiRequest } from "../../../lib/apiClient";

export const dynamic = "force-dynamic";

export default function AdminTransactionsPage() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function load() {
      setIsLoading(true);
      setError("");
      try {
        const res = await apiRequest("/transactions/");
        const items = Array.isArray(res) ? res : res?.items || res?.data || res?.results || [];
        if (mounted) setData(items);
      } catch (e) {
        if (mounted) setError(e?.message || "Failed to load transactions");
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const columns = useMemo(
    () => [
      { key: "Date", label: "Date" },
      { key: "Mode", label: "Mode" },
      { key: "Category", label: "Category" },
      { key: "Subcategory", label: "Subcategory" },
      { key: "Note", label: "Note" },
      { key: "Amount", label: "Amount" },
      { key: "Income/Expense", label: "Income/Expense" },
      { key: "Currency", label: "Currency" },
      { key: "is_flagged", label: "Flagged" },
      { key: "is_fraud", label: "Fraud" },
      { key: "risk_score", label: "Risk Score" },
    ],
    []
  );

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>

      {error ? (
        <div className="p-3 rounded border border-red-300 bg-red-50 text-red-700 text-sm">{error}</div>
      ) : null}

      <Table columns={columns} data={data} />

      {isLoading ? <div className="text-sm text-gray-500">Loading...</div> : null}
    </div>
  );
}
