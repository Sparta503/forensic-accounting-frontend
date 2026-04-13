"use client";

import { Bell, User } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="w-full h-16 bg-white border-b flex items-center justify-between px-6 shadow-sm">
      
      {/* LEFT */}
      <h1 className="text-xl font-semibold text-gray-800">
        Forensic Dashboard
      </h1>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        <button className="relative">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-2 cursor-pointer">
          <User className="w-6 h-6 text-gray-600" />
          <span className="text-sm text-gray-700">Admin</span>
        </div>
      </div>
    </nav>
  );
}