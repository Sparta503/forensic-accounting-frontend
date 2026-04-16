"use client";

import { Zap } from "lucide-react";

export default function Card({
  title,
  value,
  icon: Icon,
  color = "blue",
}) {
  const colors = {
    blue: "from-blue-500/80 to-blue-700/80",
    red: "from-red-500/80 to-red-700/80",
    green: "from-green-500/80 to-green-700/80",
    yellow: "from-yellow-400/80 to-yellow-600/80",
    purple: "from-purple-500/80 to-purple-700/80",
  };

  return (
    <div className="relative w-full max-w-[220px] h-32 group perspective-1000">

      {/* 🌑 3D BASE SHADOW */}
      <div
        className="
          absolute inset-0
          translate-y-4
          translate-z-[-20px]
          scale-[0.95]
          rounded-3xl
          bg-black/15
          blur-2xl
          transition-all duration-300
          group-hover:translate-y-6
          group-hover:blur-xl
        "
      />

      {/* AMBIENT GLOW */}
      <div
        className="
          absolute inset-0
          translate-y-1
          rounded-3xl
          bg-gradient-to-r from-yellow-400/30 to-amber-500/30
          blur-3xl
          opacity-40
          transition-opacity duration-300
          group-hover:opacity-70
        "
      />

      {/* GLASS CARD WITH 3D TRANSFORM */}
      <div
        className={`
          relative overflow-hidden
          bg-gradient-to-br ${colors[color]}
          backdrop-blur-2xl
          text-white
          rounded-3xl
          h-32
          p-4

          border border-white/30
          border-t-white/50
          border-l-white/40

          shadow-[0_10px_40px_rgba(0,0,0,0.2)]
          transition-all duration-500 ease-out

          group-hover:-translate-y-4
          group-hover:rotate-x-[-8deg]
          group-hover:rotate-y-[5deg]
          group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)]
        `}
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {/* CARD THICKNESS - RIGHT & BOTTOM EDGES */}
        <div
          className="
            absolute 
            top-[2px] right-[-3px] bottom-[-3px] left-[2px]
            rounded-3xl
            bg-gradient-to-br from-black/40 to-black/60
            pointer-events-none
          "
          style={{ transform: 'translateZ(-10px)' }}
        />

        {/* GLASS EDGE HIGHLIGHT */}
        <div
          className="
            absolute inset-0
            rounded-3xl
            bg-gradient-to-br from-white/40 via-transparent to-black/10
            pointer-events-none
            border border-white/20
          "
        />

        {/* TOP LIGHT REFLECTION */}
        <div
          className="
            absolute top-0 left-0 right-0
            h-1/2
            bg-gradient-to-b from-white/35 to-transparent
            rounded-t-3xl
            pointer-events-none
          "
        />

        {/* BOTTOM SHADOW GRADIENT */}
        <div
          className="
            absolute bottom-0 left-0 right-0
            h-1/4
            bg-gradient-to-t from-black/15 to-transparent
            rounded-b-3xl
            pointer-events-none
          "
        />

        {/* ICON TOP RIGHT - 3D POP */}
        {Icon && (
          <div 
            className="absolute top-3 right-3 opacity-95 animate-flicker"
            style={{ transform: 'translateZ(35px)' }}
          >
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm border border-white/10">
              <Icon size={18} />
            </div>
          </div>
        )}

        {/* CONTENT */}
        <div className="relative flex flex-col justify-between h-full" style={{ transform: 'translateZ(25px)' }}>

          {/* TITLE */}
          <p className="text-white/90 text-sm tracking-wide font-medium drop-shadow-md">
            {title}
          </p>

          {/* VALUE */}
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 opacity-95 animate-flicker text-yellow-300" />

            <h2 className="text-3xl font-bold tracking-wide drop-shadow-lg">
              {value}
            </h2>
          </div>

        </div>
      </div>

      {/* ⚡ FLICKER */}
      <style jsx>{`
        @keyframes flicker {
          0%, 18%, 22%, 25%, 53%, 57%, 100% {
            opacity: 1;
          }
          20%, 24%, 55% {
            opacity: 0.4;
          }
        }

        .animate-flicker {
          animation: flicker 2.8s infinite;
        }

        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
}