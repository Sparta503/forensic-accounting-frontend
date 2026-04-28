"use client";

import { useState } from "react";
import { apiRequest } from "../../../../lib/apiClient";

export const dynamic = "force-dynamic";

export default function ImportCsvPage() {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const onImport = async () => {
    if (!file) return;

    setIsLoading(true);
    setError("");
    setResult(null);

    try {
      const form = new FormData();
      form.append("file", file);

      const res = await apiRequest("/transactions/import-csv", {
        method: "POST",
        body: form,
      });
      setResult(res);
    } catch (e) {
      setError(e?.message || "Failed to import CSV");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Import Transactions CSV</h1>

      <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
        <input
          type="file"
          accept=".csv,text/csv"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <button
          type="button"
          onClick={onImport}
          disabled={isLoading || !file}
          className="px-4 py-2 rounded-lg bg-black text-white text-sm disabled:opacity-50"
        >
          {isLoading ? "Importing..." : "Import"}
        </button>

        {error ? <div className="text-sm text-red-700">{error}</div> : null}

        {result ? (
          <pre className="p-3 rounded bg-gray-50 border border-gray-200 text-xs overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        ) : null}
      </div>
    </div>
  );
}
