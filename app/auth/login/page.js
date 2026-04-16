"use client";

import LoginForm from "./LoginForm";
import Image from "next/image";
import { Landmark } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-yellow-900 via-amber-800 to-black text-white">

      {/* LEFT SIDE */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-8">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="hidden md:flex w-1/2 flex-col items-center justify-center px-10 bg-[#0f1720] border-l border-gray-800">

        {/* BANNER */}
        <div className="w-full mb-6">
          <div className="bg-yellow-600/90 text-sm px-4 py-2 rounded-md text-white text-center flex items-center justify-center gap-2">
            <Landmark size={18} />
            Welcome to the new TN CyberTech Banking Online Banking
          </div>
        </div>

        {/* IMAGE */}
        <div className="w-full max-w-md mb-6">
          <Image
            src="/Bank.jpg"
            alt="Banking"
            width={500}
            height={300}
            className="rounded-lg object-cover"
          />
        </div>

        {/* TEXT */}
        <div className="text-center">
          <h3 className="text-lg font-semibold">
            TN CyberTech Bank Online Banking
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            The future of banking.
          </p>
        </div>

      </div>

    </div>
  );
}