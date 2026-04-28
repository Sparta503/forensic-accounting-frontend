"use client";

import { useState } from "react";
import { UploadCloud, FileText, Loader2, CheckCircle } from "lucide-react";
import { apiRequest } from "../../lib/apiClient";

export default function AuditReportsPage() {
  const [file, setFile] = useState(null);
  const [report, setReport] = useState(null);

  const [transactionId, setTransactionId] = useState("");
  const [checkResult, setCheckResult] = useState(null);
  const [checkError, setCheckError] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  // Handle file upload
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setReport(null);
  };

  // Process document and update dashboard
  const generateReport = async () => {
    if (!file) return;

    // No backend document-analysis endpoint is available in Swagger yet.
    // Keep the UI but surface a clear message.
    setReport({
      title: "Audit Reports",
      riskScore: "N/A",
      summary: "Backend document analysis endpoint is not available yet. Use 'Check Transaction Fraud' below.",
      findings: [],
      recommendation: "",
    });
  };

  const checkFraud = async () => {
    const id = transactionId.trim();
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
    <div className="min-h-screen bg-gray-50 p-6 text-gray-900">

      {/* Header */}
      <h1 className="text-2xl font-bold mb-6">Audit Reports</h1>

      {/* Upload Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">

        <div className="flex items-center gap-3 mb-4">
          <UploadCloud className="text-blue-500" />
          <h2 className="text-lg font-semibold">Upload Document</h2>
        </div>

        <input
          type="file"
          onChange={handleFileChange}
          className="block w-full text-sm border border-gray-300 rounded-lg p-2 bg-gray-50"
        />

        {file && (
          <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
            <FileText size={16} />
            {file.name}
          </div>
        )}

        <button
          onClick={generateReport}
          disabled={!file || isLoading}
          className="mt-4 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={16} />
              Analyzing & Updating Dashboard...
            </>
          ) : (
            "Generate Report"
          )}
        </button>
      </div>

      <div className="mt-6 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-3">Check Transaction Fraud</h2>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <input
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            placeholder="Transaction ID"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm"
          />
          <button
            type="button"
            onClick={checkFraud}
            disabled={isChecking || !transactionId.trim()}
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

      {/* Report Output */}
      {report && (
        <div className="mt-6 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">

          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="text-green-500" />
            <h2 className="text-lg font-semibold">{report.title}</h2>
          </div>

          <p className="mb-2">
            <span className="font-semibold">Risk Score:</span>{" "}
            {report.riskScore}
          </p>

          <p className="mb-4 text-gray-700">
            {report.summary}
          </p>

          <h3 className="font-semibold mb-2">Findings</h3>
          <ul className="list-disc pl-6 text-gray-700 mb-4">
            {Array.isArray(report.findings) && report.findings.length
              ? report.findings.map((item, index) => <li key={index}>{item}</li>)
              : null}
          </ul>

          {report.recommendation ? (
            <p className="text-sm font-medium text-red-600">
              Recommendation: {report.recommendation}
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}