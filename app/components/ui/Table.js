"use client";

import { useState, useMemo, isValidElement } from "react";

export default function Table({ columns, data, searchQuery = "" }) {
  const [visibleRows, setVisibleRows] = useState(5);

  const safeStringify = (value) => {
    if (value === null || value === undefined) return "";
    try {
      const seen = new WeakSet();
      return JSON.stringify(value, (key, val) => {
        if (typeof val === "object" && val !== null) {
          if (seen.has(val)) return "[Circular]";
          seen.add(val);

          // Avoid trying to serialize React internals (elements, contexts, etc.)
          if (val?.$$typeof) return "[ReactElement]";
          if (val?._context || val?.Provider || val?.Consumer) return "[ReactObject]";
        }
        if (typeof val === "function") return "[Function]";
        return val;
      });
    } catch (e) {
      return "[Object]";
    }
  };

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    const lowerQuery = searchQuery.toLowerCase();
    return data.filter((row) => {
      try {
        // Search the whole row (stringified) so nested or unexpected keys are included
        return safeStringify(row).toLowerCase().includes(lowerQuery);
      } catch (e) {
        // Fallback to original per-column search if stringify fails
        return columns.some((col) => String(row[col.key]).toLowerCase().includes(lowerQuery));
      }
    });
  }, [data, columns, searchQuery]);

  const handleSeeMore = () => {
    setVisibleRows(10);
  };

  const handleSeeLess = () => {
    setVisibleRows(5);
  };

  return (
    <div className="relative w-full">

      {/* OUTER DEPTH BASE */}
      <div className="absolute inset-0 translate-y-4 scale-[0.99] bg-black/40 blur-2xl rounded-2xl" />

      {/* GLOW AURA */}
      <div className="absolute inset-0 bg-yellow-500/10 blur-3xl rounded-2xl opacity-70" />

      {/* MAIN TABLE CONTAINER */}
      <div className="relative bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.25)] border border-gray-100 p-4 transition-all duration-300 hover:shadow-[0_25px_80px_rgba(0,0,0,0.4)] hover:-translate-y-1">

        {/* SCROLL AREA */}
        <div className="max-h-[320px] overflow-y-auto custom-scroll">

          {/* SEARCH RESULTS INFO */}
          {searchQuery && (
            <div className="mb-3 px-3 py-2 bg-yellow-50 rounded-lg text-sm text-yellow-700">
              Found {filteredData.length} result{filteredData.length !== 1 ? "s" : ""} for {"\""}{searchQuery}{"\""}
            </div>
          )}

          <table className="w-full text-sm text-left border-separate border-spacing-y-2">

            {/* HEADER */}
            <thead className="sticky top-0 z-10">
              <tr className="bg-yellow-600 text-white text-xs uppercase shadow-md">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-4 py-3 font-semibold tracking-wide first:rounded-l-xl last:rounded-r-xl"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>

            {/* BODY */}
            <tbody className="text-black">

              {filteredData.length > 0 ? (
                filteredData.slice(0, visibleRows).map((row, index) => (
                  <tr
                    key={index}
                    className="bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-[3px] hover:bg-yellow-50 rounded-xl border-b border-black/20 last:border-b-0"
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className="px-4 py-3 first:rounded-l-xl last:rounded-r-xl border-t border-b border-black/20"
                      >
                        {(() => {
                          if (typeof col.render === "function") return col.render(row);
                          const val = row[col.key];
                          if (val === null || val === undefined || val === "") return "-";
                          if (isValidElement(val)) return val;
                          if (Array.isArray(val)) return val.join(", ");
                          if (typeof val === "object") return safeStringify(val) || "[Object]";
                          return String(val);
                        })()}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="text-center py-10 text-gray-400"
                  >
                    {searchQuery
                      ? <>No results found for {"\""}{searchQuery}{"\""}</>
                      : "No data available"}
                  </td>
                </tr>
              )}

            </tbody>

          </table>
        </div>

        {/* SEE MORE / SEE LESS */}
        <div className="flex justify-center gap-3 mt-4">
          {visibleRows < filteredData.length && (
            <button
              onClick={handleSeeMore}
              className="px-5 py-2 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-700 text-white text-sm font-medium shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95"
            >
              See more
            </button>
          )}

          {visibleRows > 5 && (
            <button
              onClick={handleSeeLess}
              className="px-5 py-2 rounded-full bg-gray-600 text-white text-sm font-medium shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95"
            >
              See less
            </button>
          )}
        </div>

      </div>

      {/* CUSTOM SCROLLBAR */}
      <style jsx>{`
        .custom-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 215, 0, 0.5);
          border-radius: 10px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>

    </div>
  );
}