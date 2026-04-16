"use client";

import { Search, X } from "lucide-react";
import { useState, useEffect } from "react";

export default function SearchBar({ placeholder = "Search...", onSearch, className = "", initialValue = "" }) {
  const [query, setQuery] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);

  // Sync with external initialValue changes
  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.(query);
  };

  const handleClear = () => {
    setQuery("");
    onSearch?.("");
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div
        className={`
          flex items-center gap-2
          bg-white/10
          backdrop-blur-md
          border rounded-lg
          px-3 py-2
          transition-all duration-300
          ${isFocused 
            ? "border-blue-400 shadow-md shadow-blue-500/20" 
            : "border-gray-600/50 hover:border-gray-500"
          }
        `}
      >
        <Search 
          size={18} 
          className={`
            transition-colors duration-300
            ${isFocused ? "text-blue-400" : "text-gray-400"}
          `} 
        />
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="
            bg-transparent
            text-white
            placeholder-gray-400
            outline-none
            w-48
            text-sm
          "
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="
              p-0.5 rounded-full
              hover:bg-white/10
              transition-all duration-200
            "
          >
            <X size={14} className="text-gray-400 hover:text-white" />
          </button>
        )}
      </div>
    </form>
  );
}