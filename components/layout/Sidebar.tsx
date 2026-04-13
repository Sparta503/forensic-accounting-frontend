"use client";

import Link from "next/link";
import { Home, CreditCard, BarChart3, FileText, Settings } from "lucide-react";
import { getUserFromToken } from "@/lib/auth";

export default function Sidebar() {
  const user = getUserFromToken();

  const role = user?.role;

  // 🔥 ROLE-BASED MENU
  const menu = [
    { name: "Dashboard", path: `/dashboard/${role}`, icon: Home },

    ...(role === "admin"
      ? [
          { name: "Users", path: "/admin/users", icon: Settings },
          { name: "Reports", path: "/reports", icon: FileText },
        ]
      : []),

    ...(role === "auditor"
      ? [
          { name: "Transactions", path: "/transactions", icon: CreditCard },
          { name: "Analysis", path: "/analysis", icon: BarChart3 },
        ]
      : []),

    ...(role === "user"
      ? [
          { name: "My Transactions", path: "/transactions", icon: CreditCard },
        ]
      : []),
  ];

  return (
    <aside className="w-64 h-screen bg-gray-900 text-white p-4">
      <h2 className="text-xl font-bold mb-6">Forensic</h2>

      <nav className="flex flex-col gap-2">
        {menu.map((item) => (
          <Link
            key={item.name}
            href={item.path}
            className="flex items-center gap-3 px-4 py-2 rounded hover:bg-gray-800"
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}