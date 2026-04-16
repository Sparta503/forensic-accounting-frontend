"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { mockLogin } from "../../lib/mockAuth";

import { Shield, Eye, Mail, Lock, Building2 } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState("management");

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    await new Promise((r) => setTimeout(r, 1500));

    const token = mockLogin(data.email, data.password, selectedRole);
    localStorage.setItem("token", token);

    const user = JSON.parse(atob(token));
    const dashboardPath =
      user?.role === "management" ? "management" : user?.role;

    router.push(`/dashboard/${dashboardPath}`);
  };

  const roles = [
    { name: "admin", label: "Admin", icon: Shield },
    { name: "auditor", label: "Auditor", icon: Eye },
    { name: "management", label: "Management", icon: Building2 },
  ];

  return (
    <div
      className="
        w-full max-w-md
        bg-[#0b0f19]
        text-white
        rounded-2xl p-8
        border border-yellow-400/20
        shadow-[0_20px_80px_rgba(0,0,0,0.8)]
      "
    >

      {/* TITLE */}
      <h2 className="text-3xl font-bold mb-2 tracking-wide">
        Welcome
      </h2>

      <p className="text-gray-400 mb-6">
        Login to TN CyberTech Banking System
      </p>

      {/* ROLE SELECT */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {roles.map((role) => {
          const Icon = role.icon;
          const active = selectedRole === role.name;

          return (
            <div
              key={role.name}
              onClick={() => !isSubmitting && setSelectedRole(role.name)}
              className={`
                px-3 py-1 rounded-full text-sm flex items-center gap-1 cursor-pointer transition

                ${
                  active
                    ? "bg-yellow-400 text-black font-semibold"
                    : "bg-white/10 text-white hover:bg-white/20"
                }
              `}
            >
              <Icon size={14} />
              {role.label}
            </div>
          );
        })}
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* EMAIL */}
        <div className="relative">
          <Mail className="absolute left-3 top-3 text-yellow-400" size={18} />
          <input
            type="email"
            placeholder="Email"
            disabled={isSubmitting}
            {...register("email", { required: true })}
            className="
              w-full pl-10 p-3
              bg-black/40
              text-white placeholder-gray-500
              rounded-lg
              border border-gray-700
              focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400
            "
          />
        </div>

        {/* PASSWORD */}
        <div className="relative">
          <Lock className="absolute left-3 top-3 text-yellow-400" size={18} />
          <input
            type="password"
            placeholder="Password"
            disabled={isSubmitting}
            {...register("password", { required: true })}
            className="
              w-full pl-10 p-3
              bg-black/40
              text-white placeholder-gray-500
              rounded-lg
              border border-gray-700
              focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400
            "
          />
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`
            w-full p-3 rounded-lg font-semibold flex justify-center items-center gap-2 transition

            ${
              isSubmitting
                ? "bg-yellow-400/40 text-black cursor-not-allowed"
                : "bg-yellow-400 text-black hover:scale-[1.02]"
            }
          `}
        >
          {isSubmitting && (
            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
          )}

          {isSubmitting
            ? "Logging in..."
            : `Login as ${
                roles.find((r) => r.name === selectedRole)?.label
              }`}
        </button>

      </form>

      {/* LINK */}
      <div className="text-sm text-gray-400 mt-5">
        <Link href="/auth/register" className="hover:text-yellow-400 transition">
          Create account
        </Link>
      </div>

    </div>
  );
}