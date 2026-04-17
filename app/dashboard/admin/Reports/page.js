"use client";

import StaffOverview from "../../../components/Admin reports/reports";

export const dynamic = "force-dynamic";

export default function FraudLogsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white-900 via-amber-800 to-black p-6 -m-6">
      <StaffOverview/>
    </div>
  );
}
