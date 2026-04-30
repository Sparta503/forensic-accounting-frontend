"use client";

import { AlertTriangle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiRequest } from "../../lib/apiClient";

export default function LogoutModal({ isOpen, onClose }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    // Immediately perform local logout for best perceived speed
    setLoading(true);
    localStorage.removeItem("token");
    localStorage.removeItem("app_role");
    // Fire-and-forget backend logout; don't block the UI/navigation
    apiRequest("/auth/logout", { method: "POST" }).catch((e) => {
      if (typeof console !== "undefined") console.warn("[LogoutModal] backend logout failed", e);
    });

    // Navigate away immediately
    router.push("/auth/login");
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50"
    >
      {/* MODAL */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-gradient-to-br from-yellow-900 via-amber-800 to-black text-white rounded-2xl p-6 w-[320px] shadow-[0_0_40px_rgba(234,179,8,0.3)] border border-yellow-400/30 text-center animate-fadeIn"
      >
        {/* GOLD GLOW */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[200px] h-[200px] bg-yellow-500/20 blur-3xl rounded-full pointer-events-none" />

        {/* ICON */}
        <div className="flex justify-center mb-4 text-yellow-400">
          <AlertTriangle size={40} />
        </div>

        {/* TEXT */}
        <h2 className="text-lg font-semibold mb-2">
          {loading ? "Logging out..." : "Confirm Logout"}
        </h2>

        <p className="text-yellow-100/80 text-sm mb-6">
          {loading
            ? "Please wait while we sign you out"
            : "Are you sure you want to log out?"}
        </p>

        {/* BUTTONS */}
        <div className="flex gap-3">

          {/* CANCEL */}
          <button
            onClick={onClose}
            disabled={loading}
            className={`w-full py-2 rounded transition border border-yellow-400/30
              ${loading ? "bg-gray-700 cursor-not-allowed" : "bg-white/10 hover:bg-white/20 text-white"}
            `}
          >
            Cancel
          </button>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            disabled={loading}
            className={`w-full py-2 rounded font-semibold transition flex items-center justify-center gap-2
              ${loading ? "bg-yellow-400/40 text-black cursor-not-allowed" : "bg-yellow-400 text-black hover:bg-yellow-300 hover:scale-[1.02]"}
            `}
          >
            {loading ? (
              <span className="flex items-center gap-1.5">
                <Loader2 size={16} className="animate-spin" />
                Logging out...
              </span>
            ) : (
              "Logout"
            )}
          </button>

        </div>
      </div>

      {/* ANIMATION */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}