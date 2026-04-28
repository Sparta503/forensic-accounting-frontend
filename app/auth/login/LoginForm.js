"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { apiLogin, extractAccessToken } from "../../lib/apiClient";
import { getUserFromToken } from "../../lib/auth";

import { Shield, Eye, Mail, Lock, Building2 } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedRole, setSelectedRole] = useState("management");
  const [showRegistered, setShowRegistered] = useState(false);
  const [registeredRole, setRegisteredRole] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const registered = searchParams.get("registered");
    const role = searchParams.get("role");

    if (registered === "1") {
      setShowRegistered(true);
      setRegisteredRole(role);

      if (role === "admin" || role === "auditor" || role === "management") {
        setSelectedRole(role);
      }
    }
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const res = await apiLogin({
        email: data.email,
        password: data.password,
      });

      const token = extractAccessToken(res);
      if (!token) {
        throw new Error("Login succeeded but no access token was returned");
      }

      localStorage.setItem("token", token);

      const user = getUserFromToken();
      const dashboardPath = user?.role === "management" ? "management" : user?.role;
      router.push(`/dashboard/${dashboardPath || "management"}`);
    } finally {
      setIsLoading(false);
    }
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

      {showRegistered && (
        <div className="mb-4 p-3 rounded-lg bg-green-500/15 border border-green-400/40 text-green-200 text-sm">
          Successfully registered{registeredRole ? ` as ${registeredRole}` : ""}. Please log in.
        </div>
      )}

      {/* TITLE */}
      <h2 className="text-3xl font-bold mb-2 tracking-wide">
        Welcome
      </h2>

      <p className="text-gray-400 mb-6">
        Forensic Accounting Information System
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
          disabled={isLoading}
          className={`
            w-full p-3 rounded-lg font-semibold flex justify-center items-center gap-2 transition

            ${
              isLoading
                ? "bg-yellow-400/40 text-black cursor-not-allowed"
                : "bg-yellow-400 text-black hover:scale-[1.02]"
            }
          `}
        >
          {isLoading && (
            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
          )}

          {isLoading
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