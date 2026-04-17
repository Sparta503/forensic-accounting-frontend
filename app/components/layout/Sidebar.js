"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getUserFromToken } from "../../lib/auth";
import {
  LayoutDashboard,
  FileText,
  Users,
  ClipboardList,
  Building2,
  ListTodo,
  Menu,
  LogOut,
  Shield,
  Settings,
} from "lucide-react";

import LogoutModal from "./LogoutModal";

export default function Sidebar() {
  const [role, setRole] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  useEffect(() => {
    const user = getUserFromToken();
    setRole(user?.role);
  }, []);

  const menu = {
    admin: [
      { name: "Admin Home", path: "/dashboard/admin", icon: LayoutDashboard },
      { name: "Reports", path: "/dashboard/admin/Reports", icon: FileText },
      { name: "Users", path: "/dashboard/admin/users", icon: Users },
    ],
    auditor: [
      { name: "Audit Dashboard", path: "/dashboard/auditor", icon: ClipboardList },
      { name: "Fraud Logs", path: "/dashboard/auditor/fraud-logs", icon: FileText },
      { name: "Audit Reports", path: "/dashboard/auditor/audit-reports", icon: FileText },
    ],
    management: [
      { name: "Management Dashboard", path: "/dashboard/management", icon: Building2 },
      { name: "Department Tasks", path: "/dashboard/management/departmenttask", icon: ListTodo },
      { name: "Staff Overview", path: "/dashboard/management/staffOview", icon: Users },
      { name: "Performance Reports", path: "/dashboard/management/Reports", icon: FileText },
    ],
  };

  const items = menu[role] || [];

  return (
    <>
      <div
        className={`
          relative h-screen 
          ${collapsed ? "w-20" : "w-64"} 
          bg-black/60
          text-white 
          p-4 
          transition-all duration-300
          flex flex-col
          border-r border-gray-800
        `}
      >
        {/* TOP */}
        <div className="flex items-center justify-between mb-6">
          {!collapsed && (
            <h1 className="text-xl font-bold flex items-center gap-2 text-gray-100">
              <Shield size={24} className="text-gray-400" />
              TN CyberTech
            </h1>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded hover:bg-gray-400/20 transition text-gray-300"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* DARK GLOW EFFECT */}
        <div className="absolute top-20 left-0 w-full h-[300px] bg-yellow-500/10 blur-3xl pointer-events-none" />

        {/* MENU */}
        <div className="space-y-2 flex-1 mt-12 relative z-10">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                href={item.path}
                className="
                  group flex items-center gap-3 p-3
                  transition-all duration-300
                  border-t border-b border-gray-800
                  hover:bg-gray-800
                  hover:translate-x-1
                  hover:shadow-md
                  hover:shadow-gray-700/30
                "
              >
                <Icon
                  size={20}
                  className="
                    text-gray-400
                    transition-all duration-300
                    group-hover:scale-110
                    group-hover:text-white
                  "
                />

                {!collapsed && (
                  <span
                    className="
                      text-gray-300
                      transition-all duration-300
                      group-hover:text-white
                    "
                  >
                    {item.name}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* SETTINGS */}
        <Link
          href="/dashboard/settings"
          className="
            group flex items-center gap-3 p-3
            transition-all duration-300
            border-t border-b border-gray-800
            hover:bg-gray-800
            hover:translate-x-1
            hover:shadow-md
            hover:shadow-gray-700/30
            mb-2
          "
        >
          <Settings
            size={20}
            className="
              text-gray-400
              transition-all duration-300
              group-hover:scale-110
              group-hover:text-white
            "
          />

          {!collapsed && (
            <span
              className="
                text-gray-300
                transition-all duration-300
                group-hover:text-white
              "
            >
              Settings
            </span>
          )}
        </Link>

        {/* LOGOUT */}
        <button
          onClick={() => setShowLogout(true)}
          className="
            flex items-center gap-3 p-2 rounded
            transition-all duration-300
            hover:bg-gray-900/30
            hover:translate-x-1
            hover:shadow-md
            hover:shadow-gray-500/20
            border border-transparent hover:border-gray-500/30
          "
        >
          <LogOut
            size={20}
            className="text-gray-400 transition-all duration-300 group-hover:scale-110 group-hover:text-gray-500"
          />

          {!collapsed && (
            <span className="text-gray-300 transition-all duration-300 group-hover:text-gray-500">
              Logout
            </span>
          )}
        </button>
      </div>

      {/* MODAL */}
      <LogoutModal
        isOpen={showLogout}
        onClose={() => setShowLogout(false)}
      />
    </>
  );
}