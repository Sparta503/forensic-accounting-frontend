"use client";

import { useEffect, useMemo, useState } from "react";
import Table from "../../../components/ui/Table";
import { apiRequest } from "../../../lib/apiClient";

export const dynamic = "force-dynamic";

export default function AuditorTransactionsPage() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const [editing, setEditing] = useState(null);
  const [editBodyText, setEditBodyText] = useState("{}");

  useEffect(() => {
    let mounted = true;

    const extractItems = (res) => {
      if (Array.isArray(res)) return res;
      return (
        res?.items ||
        res?.transactions ||
        res?.data ||
        res?.results ||
        res?.data?.items ||
        res?.data?.transactions ||
        res?.data?.results ||
        []
      );
    };

    const loadTransactions = async () => {
      try {
        return await apiRequest("/transactions/");
      } catch (e) {
        if (e?.status === 404 || e?.status === 405) {
          return await apiRequest("/transactions");
        }
        throw e;
      }
    };

    async function load() {
      setIsLoading(true);
      setError("");
      try {
        const res = await loadTransactions();
        const items = extractItems(res);
        if (!Array.isArray(items)) {
          throw new Error("Unexpected /transactions response shape");
        }
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

  const getTransactionId = (row) =>
    row?._id ?? row?.transaction_id ?? row?.id ?? row?.transactionId ?? row?.TransactionID;

  const onDeleteRow = async (row) => {
    const id = getTransactionId(row);
    if (!id) {
      setActionError("Could not determine transaction id for delete");
      return;
    }

    const confirmed = window.confirm(`Delete transaction ${id}?`);
    if (!confirmed) return;

    setActionError("");
    setActionLoadingId(String(id));
    try {
      await apiRequest(`/transactions/${encodeURIComponent(id)}`, { method: "DELETE" });
      setData((prev) => prev.filter((r) => String(getTransactionId(r)) !== String(id)));
    } catch (e) {
      setActionError(e?.message || "Failed to delete transaction");
    } finally {
      setActionLoadingId(null);
    }
  };

  const onStartEdit = (row) => {
    setActionError("");
    setEditing(row);
    setEditBodyText(JSON.stringify(row ?? {}, null, 2));
  };

  const onCancelEdit = () => {
    setEditing(null);
    setEditBodyText("{}");
    setActionError("");
  };

  const onSaveEdit = async () => {
    const row = editing;
    const id = getTransactionId(row);
    if (!id) {
      setActionError("Could not determine transaction id for update");
      return;
    }

    setActionError("");
    setActionLoadingId(String(id));

    try {
      const payload = JSON.parse(editBodyText || "{}");
      if (payload && typeof payload === "object") {
        delete payload._id;
        delete payload.id;
        delete payload.transaction_id;
      }
      const updated = await apiRequest(`/transactions/${encodeURIComponent(id)}`, {
        method: "PUT",
        body: payload,
      });

      setData((prev) =>
        prev.map((r) => {
          const rid = getTransactionId(r);
          if (String(rid) !== String(id)) return r;
          return updated && typeof updated === "object" ? updated : { ...r, ...payload };
        })
      );

      setEditing(null);
    } catch (e) {
      setActionError(e?.message || "Failed to update transaction");
    } finally {
      setActionLoadingId(null);
    }
  };

  const columns = useMemo(
    () => [
      {
        key: "actions",
        label: "Actions",
        render: (row) => {
          const id = getTransactionId(row);
          const isBusy = actionLoadingId != null && String(actionLoadingId) === String(id);

          return (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onStartEdit(row)}
                disabled={isBusy}
                className="px-2 py-1 text-xs rounded bg-gray-900 text-white disabled:opacity-50"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => onDeleteRow(row)}
                disabled={isBusy}
                className="px-2 py-1 text-xs rounded bg-red-600 text-white disabled:opacity-50"
              >
                {isBusy ? "..." : "Delete"}
              </button>
            </div>
          );
        },
      },
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
    [actionLoadingId]
  );

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>

      {error ? (
        <div className="p-3 rounded border border-red-300 bg-red-50 text-red-700 text-sm">{error}</div>
      ) : null}

      {actionError ? (
        <div className="p-3 rounded border border-red-300 bg-red-50 text-red-700 text-sm">{actionError}</div>
      ) : null}

      {editing ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-6">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={onCancelEdit}
          />
          <div className="relative mt-20 w-full max-w-3xl bg-white border border-gray-200 rounded-xl p-4 space-y-3 shadow-lg">
            <div className="text-sm font-semibold text-gray-900">Edit Transaction</div>
            <div className="text-xs text-gray-500">
              Transaction ID: {String(getTransactionId(editing) ?? "-")}
            </div>
            <textarea
              value={editBodyText}
              onChange={(e) => setEditBodyText(e.target.value)}
              rows={12}
              className="w-full font-mono text-xs bg-gray-100 text-gray-800 border border-gray-300 rounded-lg p-3"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onSaveEdit}
                disabled={actionLoadingId != null}
                className="px-4 py-2 rounded-lg bg-black text-white text-sm disabled:opacity-50"
              >
                Save
              </button>
              <button
                type="button"
                onClick={onCancelEdit}
                disabled={actionLoadingId != null}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-900 text-sm disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <Table columns={columns} data={data} />

      {isLoading ? <div className="text-sm text-gray-500">Loading...</div> : null}
    </div>
  );
}
