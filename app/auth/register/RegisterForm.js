"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiRegister } from "../../lib/apiClient";

import { Shield, User, Eye, Mail, Lock, Building2 } from "lucide-react";

export default function RegisterForm() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState("admin");
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    await new Promise((r) => setTimeout(r, 120));

    setErrorMessage("");

    const baseVariants = [
      selectedRole,
      selectedRole.toUpperCase(),
      selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1),
    ];

    const roleSynonyms = {
      management: ["manager", "managers", "mgmt"],
      auditor: ["audit", "auditing"],
      admin: ["administrator"],
    };

    const roleVariants = [
      ...baseVariants,
      ...((roleSynonyms[selectedRole] || []).flatMap((v) => [v, v.toUpperCase(), v.charAt(0).toUpperCase() + v.slice(1)])),
    ];

    let lastError = null;
    for (const roleValue of roleVariants) {
      try {
        await apiRegister({
          email: data.email,
          password: data.password,
          role: roleValue,
        });
        lastError = null;
        break;
      } catch (e) {
        lastError = e;
      }
    }

    if (lastError) {
      setErrorMessage(lastError.message || "Registration failed");
      return;
    }

    // Show success feedback
    setIsSuccess(true);

    // Redirect after showing success message
    setTimeout(() => {
      router.push(
        `/auth/login?registered=1&role=${encodeURIComponent(selectedRole)}`
      );
    }, 2000);
  };

  const roles = [
    { name: "admin", label: "Admin", icon: Shield },
    { name: "auditor", label: "Auditor", icon: Eye },
    { name: "management", label: "Management", icon: Building2 },
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
                onClick={() => !isSubmitting && !isSuccess && setSelectedRole(role.name)}
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

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* EMAIL */}
          <div className="relative mb-4">
            <Mail className="absolute left-3 top-3 text-yellow-300" size={18} />
            <input
              type="email"
              placeholder="Email"
              disabled={isSubmitting || isSuccess}
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
              disabled={isSubmitting || isSuccess}
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

          {/* SUCCESS MESSAGE */}
          {isSuccess && (
            <div className="mb-4 p-3 bg-green-500/20 border border-green-400/50 rounded-lg text-center">
              <p className="text-green-300 font-semibold">
                ✅ Successfully Registered as {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}!
              </p>
              <p className="text-green-200/70 text-sm mt-1">
                Redirecting to login...
              </p>
            </div>
          )}

          {errorMessage && !isSuccess && (
            <div className="mb-4 p-3 bg-red-500/15 border border-red-400/40 rounded-lg text-center">
              <p className="text-red-200 text-sm">{errorMessage}</p>
            </div>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={isSubmitting || isSuccess}
            className={`
              w-full p-3 rounded-lg font-semibold transition

              ${
                isSubmitting || isSuccess
                  ? "bg-yellow-400/40 text-black cursor-not-allowed"
                  : "bg-yellow-400 text-black hover:scale-[1.02]"
              }
            `}
          >
            {isSubmitting ? "Creating..." : isSuccess ? "Registered!" : "Register"}
          </button>
        </form>

        <div className="text-center mt-5 text-sm text-white/80">
          <Link href="/auth/login" className="hover:underline">
            Login
          </Link>
        </div>

      </div>
    </div>
  );
}