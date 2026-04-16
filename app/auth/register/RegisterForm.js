"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { mockRegister } from "../../lib/mockAuth";

import { Shield, User, Eye, Mail, Lock, Building2 } from "lucide-react";

export default function RegisterForm() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState("user");

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    await new Promise((r) => setTimeout(r, 1200));

    mockRegister(data.email, data.password, selectedRole);

    router.push("/auth/login");
  };

  const roles = [
    { name: "admin", label: "Admin", icon: Shield },
    { name: "auditor", label: "Auditor", icon: Eye },
    {  name: "management", label: "Management", icon: Building2 },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-900 via-amber-800 to-black">

      <div className="
        w-full max-w-md
        bg-white/10 backdrop-blur-2xl
        border border-yellow-400/30
        rounded-2xl p-8
        shadow-[0_20px_80px_rgba(0,0,0,0.6)]
      ">

        <h2 className="text-2xl font-bold text-white text-center">
          Create Account
        </h2>

        <p className="text-center text-white/70 mb-6">
          Join Gold Security System
        </p>

        {/* ROLE */}
        <div className="flex justify-center gap-2 mb-4">
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

        {/* EMAIL */}
        <div className="relative mb-4">
          <Mail className="absolute left-3 top-3 text-yellow-300" size={18} />
          <input
            type="email"
            placeholder="Email"
            disabled={isSubmitting}
            {...register("email", { required: true })}
            className="
              w-full pl-10 p-3
              bg-white/10
              text-gray-900 placeholder-gray-500
              rounded-lg backdrop-blur-md
              border border-yellow-400/30
              focus:outline-none focus:ring-2 focus:ring-yellow-400
            "
          />
        </div>

        {/* PASSWORD */}
        <div className="relative mb-5">
          <Lock className="absolute left-3 top-3 text-yellow-300" size={18} />
          <input
            type="password"
            placeholder="Password"
            disabled={isSubmitting}
            {...register("password", { required: true })}
            className="
              w-full pl-10 p-3
              bg-white/10
              text-gray-900 placeholder-gray-500
              rounded-lg backdrop-blur-md
              border border-yellow-400/30
              focus:outline-none focus:ring-2 focus:ring-yellow-400
            "
          />
        </div>

        {/* BUTTON */}
        <button
          disabled={isSubmitting}
          className={`
            w-full p-3 rounded-lg font-semibold transition

            ${
              isSubmitting
                ? "bg-yellow-400/40 text-black"
                : "bg-yellow-400 text-black hover:scale-[1.02]"
            }
          `}
        >
          {isSubmitting ? "Creating..." : "Register"}
        </button>

        <div className="text-center mt-5 text-sm text-white/80">
          <Link href="/auth/login" className="hover:underline">
            Login
          </Link>
        </div>

      </div>
    </div>
  );
}