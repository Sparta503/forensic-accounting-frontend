"use client";

import { useState } from "react";
import { UploadCloud, FileText, Loader2, CheckCircle } from "lucide-react";

export default function AuditReportsPage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);

  // 📤 Handle file upload
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setReport(null);
  };

  // 🤖 Simulated report generation
  const generateReport = async () => {
    if (!file) return;

    setLoading(true);

    // simulate API processing time
    setTimeout(() => {
      setReport({
        title: "Audit Summary Report",
        riskScore: "High (78/100)",
        summary:
          "Multiple anomalies detected including unusual transaction spikes, inconsistent login patterns, and flagged financial movements.",
        findings: [
          "Suspicious login location mismatch detected",
          "Transaction volume exceeded normal thresholds",
          "Multiple failed authentication attempts",
        ],
        recommendation:
          "Immediate account review and temporary transaction freeze recommended.",
      });

      setLoading(false);
    }, 2000);
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
          disabled={!file || loading}
          className="mt-4 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={16} />
              Generating...
            </>
          ) : (
            "Generate Report"
          )}
        </button>
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
            {report.findings.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <p className="text-sm font-medium text-red-600">
            Recommendation: {report.recommendation}
          </p>
        </div>
      )}

    </div>
  );
}