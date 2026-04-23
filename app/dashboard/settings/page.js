"use client";

import { useState } from "react";
import { Settings, Shield, Bell, User } from "lucide-react";

export const dynamic = "force-dynamic";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account");

  const tabs = [
    { key: "account", label: "Account", icon: User },
    { key: "security", label: "Security", icon: Shield },
    { key: "notifications", label: "Notifications", icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white-900 via-amber-800 to-black p-6 -m-6">
      <div className="max-w-5xl mx-auto pt-20">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-4 rounded-2xl bg-black/40 border border-yellow-400/50 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
            <Settings className="text-yellow-300" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Settings</h1>
            <p className="text-white/80 text-sm">
              Manage your account preferences and security options
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-7 mt-6">
          <div className="bg-black/45 backdrop-blur-2xl border border-yellow-400/50 rounded-3xl p-5 shadow-[0_15px_45px_rgba(0,0,0,0.45)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_25px_80px_rgba(0,0,0,0.55)] hover:border-yellow-300/70">
            <div className="space-y-2">
              {tabs.map((t) => {
                const Icon = t.icon;
                const active = activeTab === t.key;

                return (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setActiveTab(t.key)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition text-left border ${
                      active
                        ? "bg-yellow-400 text-black border-yellow-300"
                        : "bg-black/30 text-white border-white/15 hover:bg-black/40 hover:border-yellow-300/40 hover:translate-x-1"
                    }`}
                  >
                    <Icon size={18} />
                    <span className="font-medium">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-black/45 backdrop-blur-2xl border border-yellow-400/50 rounded-3xl p-8 shadow-[0_15px_45px_rgba(0,0,0,0.45)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_25px_80px_rgba(0,0,0,0.55)] hover:border-yellow-300/70">
            {activeTab === "account" && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-white text-lg font-semibold">Account</h2>
                  <p className="text-white/80 text-sm">
                    Update basic account preferences.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 text-sm mb-2">
                      Display name
                    </label>
                    <input
                      className="w-full p-3 rounded-lg bg-black/30 border border-yellow-400/40 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-200 hover:border-yellow-300/70 hover:bg-black/40"
                      placeholder="Enter display name"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm mb-2">
                      Email
                    </label>
                    <input
                      className="w-full p-3 rounded-lg bg-black/30 border border-yellow-400/40 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-200 hover:border-yellow-300/70 hover:bg-black/40"
                      placeholder="Enter email"
                      type="email"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  className="px-5 py-3 rounded-lg bg-yellow-400 text-black font-semibold transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_10px_30px_rgba(250,204,21,0.25)] active:scale-[0.99]"
                >
                  Save Changes
                </button>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-white text-lg font-semibold">Security</h2>
                  <p className="text-white/80 text-sm">
                    Manage password and sign-in settings.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 text-sm mb-2">
                      Current password
                    </label>
                    <input
                      className="w-full p-3 rounded-lg bg-black/30 border border-yellow-400/40 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-200 hover:border-yellow-300/70 hover:bg-black/40"
                      placeholder="Current password"
                      type="password"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm mb-2">
                      New password
                    </label>
                    <input
                      className="w-full p-3 rounded-lg bg-black/30 border border-yellow-400/40 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-200 hover:border-yellow-300/70 hover:bg-black/40"
                      placeholder="New password"
                      type="password"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  className="px-5 py-3 rounded-lg bg-yellow-400 text-black font-semibold transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_10px_30px_rgba(250,204,21,0.25)] active:scale-[0.99]"
                >
                  Update Password
                </button>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-white text-lg font-semibold">Notifications</h2>
                  <p className="text-white/80 text-sm">
                    Choose which updates you want to receive.
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center justify-between gap-4 bg-black/30 border border-white/15 rounded-xl p-4 transition-all duration-200 hover:bg-black/40 hover:border-yellow-300/40">
                    <span className="text-white">Email alerts</span>
                    <input type="checkbox" className="h-5 w-5" defaultChecked />
                  </label>

                  <label className="flex items-center justify-between gap-4 bg-black/30 border border-white/15 rounded-xl p-4 transition-all duration-200 hover:bg-black/40 hover:border-yellow-300/40">
                    <span className="text-white">Report status updates</span>
                    <input type="checkbox" className="h-5 w-5" defaultChecked />
                  </label>

                  <label className="flex items-center justify-between gap-4 bg-black/30 border border-white/15 rounded-xl p-4 transition-all duration-200 hover:bg-black/40 hover:border-yellow-300/40">
                    <span className="text-white">Weekly summaries</span>
                    <input type="checkbox" className="h-5 w-5" />
                  </label>
                </div>

                <button
                  type="button"
                  className="px-5 py-3 rounded-lg bg-yellow-400 text-black font-semibold transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_10px_30px_rgba(250,204,21,0.25)] active:scale-[0.99]"
                >
                  Save Preferences
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
