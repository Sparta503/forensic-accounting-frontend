"use client";

import { useEffect, useMemo, useState } from "react";
import Table from "../../components/ui/Table";
import { Filter } from "lucide-react";
import { apiRequest } from "../../lib/apiClient";

export default function FraudLogPage() {
  const columns = [
    { key: "transaction_id", label: "Transaction ID" },
    { key: "risk_score", label: "Risk Score" },
    { key: "risk", label: "Risk" },
    { key: "risk_level", label: "Risk Level" },
    { key: "status", label: "Status" },
    { key: "fraud_reasons", label: "Fraud Reasons" },
    { key: "timestamp", label: "Timestamp" },
  ];

  const [rows, setRows] = useState([]);
  const [lastResponse, setLastResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [checkId, setCheckId] = useState("");
  const [checkResult, setCheckResult] = useState(null);
  const [checkError, setCheckError] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  const [filter, setFilter] = useState({
    risk: "All",
    status: "All",
  });

  useEffect(() => {
    let mounted = true;

    async function load() {
      setIsLoading(true);
      setError("");

      try {
        const res = await apiRequest("/fraud/flagged");
        if (mounted) setLastResponse(res);
        const items = Array.isArray(res)
          ? res
          : Array.isArray(res?.flagged_transactions)
          ? res.flagged_transactions
          : res?.items || res?.data || res?.results || [];

        // Normalize API objects to expected column keys
        const normalized = (items || []).map((r) => {
          const txId = String(r.transaction_id ?? r._id ?? r.id ?? r.transactionId ?? "");
          // Accept numeric `risk` as the score when risk_score is not provided
          const score =
            r.risk_score ?? r.riskScore ?? r.score ?? (typeof r.risk === "number" ? r.risk : null);
          const fraudReasons = r.fraud_reasons ?? r.reasons ?? [];

          // If `risk` is numeric we already captured it as score; prefer textual risk otherwise
          const derivedRisk = typeof r.risk === "number" ? "" : r.risk ?? r.risk_level ?? (r.is_fraud ? "Fraud" : "");

          const derivedRiskLevel =
            r.risk_level ??
            r.riskLevel ??
            (typeof score === "number"
              ? score >= 70
                ? "High"
                : score >= 40
                ? "Medium"
                : "Low"
              : "");

          const derivedStatus = r.status ?? (r.is_flagged ? "Flagged" : r.is_fraud ? "Suspected" : "");

          const derivedReason = r.reason ?? (Array.isArray(fraudReasons) ? fraudReasons.join(", ") : fraudReasons) ?? "";

          return {
            transaction_id: txId,
            risk_score: score ?? "",
            risk: derivedRisk,
            risk_level: derivedRiskLevel,
            status: derivedStatus,
            reason: derivedReason,
            fraud_reasons: Array.isArray(fraudReasons) ? fraudReasons : [],
            timestamp: r.timestamp ?? r.date ?? r.transaction_date ?? r.Date ?? "",
            __raw: r,
          };
        });

        if (mounted) setRows(normalized);
      } catch (e) {
        if (mounted) setError(e?.message || "Failed to load flagged transactions");
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  // 🔥 FILTER LOGIC (core upgrade)
  const filteredData = useMemo(() => {
    return rows.filter((item) => {
      const riskValue = (item?.risk ?? item?.risk_level ?? item?.riskLevel ?? "").toString();
      const statusValue = (item?.status ?? "").toString();

      const riskMatch = filter.risk === "All" || riskValue === filter.risk;
      const statusMatch = filter.status === "All" || statusValue === filter.status;

      return riskMatch && statusMatch;
    });
  }, [rows, filter.risk, filter.status]);

  const checkFraud = async () => {
    const id = checkId.trim();
    if (!id) return;

    setIsChecking(true);
    setCheckError("");
    setCheckResult(null);

    try {
      const res = await apiRequest(`/fraud/check/${encodeURIComponent(id)}`);
      setCheckResult(res);
    } catch (e) {
      setCheckError(e?.message || "Failed to check fraud");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Fraud Log</h1>

        <div className="flex gap-3 items-center">

          {/* 🔥 Risk Filter */}
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm"
            value={filter.risk}
            onChange={(e) =>
              setFilter({ ...filter, risk: e.target.value })
            }
          >
            <option value="All">All Risk</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* 🔥 Status Filter */}
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm"
            value={filter.status}
            onChange={(e) =>
              setFilter({ ...filter, status: e.target.value })
            }
          >
            <option value="All">All Status</option>
            <option value="Investigating">Investigating</option>
            <option value="Reviewed">Reviewed</option>
            <option value="Blocked">Blocked</option>
            <option value="Resolved">Resolved</option>
          </select>

          <Filter size={18} className="text-gray-500" />
        </div>
      </div>

      <div className="mb-4 bg-white border border-gray-200 rounded-xl shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <input
            value={checkId}
            onChange={(e) => setCheckId(e.target.value)}
            placeholder="Transaction ID (for /fraud/check/{transaction_id})"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm"
          />
          <button
            type="button"
            onClick={checkFraud}
            disabled={isChecking || !checkId.trim()}
            className="px-4 py-2 rounded-lg bg-black text-white text-sm disabled:opacity-50"
          >
            {isChecking ? "Checking..." : "Check"}
          </button>
        </div>

        {checkError ? (
          <div className="mt-3 text-sm text-red-700">{checkError}</div>
        ) : null}

        {checkResult ? (
          <pre className="mt-3 p-3 rounded bg-gray-50 border border-gray-200 text-xs overflow-auto">
            {JSON.stringify(checkResult, null, 2)}
          </pre>
        ) : null}
      </div>

      {error ? (
        <div className="mb-4 p-3 rounded border border-red-300 bg-red-50 text-red-700 text-sm">{error}</div>
      ) : null}

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
        <Table columns={columns} data={filteredData} />
      </div>

      {isLoading ? <div className="text-sm text-gray-600 mt-3">Loading...</div> : null}
    </div>
  );
}