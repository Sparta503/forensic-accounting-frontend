"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getUserFromToken } from "../../lib/auth";
import { Shield, User } from "lucide-react";
import SearchBar from "../ui/searchbar";

export default function Navbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [role, setRole] = useState("Loading...");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");

  useEffect(() => {
    const user = getUserFromToken();

    console.log("USER:", user);

    if (user && user.role) {
      setRole(user.role);
    } else {
      setRole("Unknown");
    }
  }, []);

  return (
    <div
      className="
        h-16
        bg-gradient-to-r from-yellow-900 via-amber-900 to-black
        backdrop-blur-xl
        text-white
        flex items-center justify-between 
        px-6
        shadow-lg shadow-yellow-500/10 border-b border-yellow-400/30
        transition-all duration-300
      "
    >
      {/* LEFT */}
      <h2
        className="
          font-semibold flex items-center gap-3 text-xl tracking-wide text-yellow-100
          transition-all duration-300
          hover:translate-y-[-1px]
          hover:text-yellow-300
        "
      >
        <Shield
          size={22}
          className="
            text-yellow-400
            transition-all duration-300
            hover:scale-110
            hover:text-yellow-300
          "
        />
        Forensic Accounting Information System
      </h2>

      {/* CENTER - SEARCH */}
      <SearchBar 
        placeholder="Search reports, users..." 
        initialValue={searchQuery}
        onSearch={(query) => {
          setSearchQuery(query);
          const params = new URLSearchParams(searchParams.toString());
          if (query) {
            params.set("search", query);
          } else {
            params.delete("search");
          }
          router.push(`${window.location.pathname}?${params.toString()}`, { scroll: false });
        }}
      />

      {/* RIGHT */}
      <div className="flex items-center gap-4">

        <div
          className="
            flex items-center gap-2
            transition-all duration-300
            hover:translate-y-[-1px]
          "
        >
          <User
            size={18}
            className="
              text-yellow-300
              opacity-80
              transition-all duration-300
              hover:opacity-100
              hover:scale-110
            "
          />

          {/* ROLE BADGE */}
          <div
            className="
              px-4 py-1.5 
              rounded-full 
              bg-yellow-400/20 
              backdrop-blur-sm
              border border-yellow-400 
              text-yellow-300 
              text-sm 
              font-semibold 
              tracking-wide
              transition-all duration-300
              
              hover:bg-yellow-400/30
              hover:scale-105
              hover:shadow-md
              hover:shadow-yellow-500/20
              hover:-translate-y-0.5
            "
          >
            {role}
          </div>
        </div>

      </div>
    </div>
  );
}