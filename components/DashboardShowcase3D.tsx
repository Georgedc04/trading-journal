"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTheme } from "next-themes";
import { DollarSign } from "lucide-react";

export default function DashboardShowcase3D() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const palette = {
    frame: isDark ? "#0F172A" : "#FFFFFF",
    chin: isDark ? "#1E293B" : "#E5E7EB",
    screenBorder: isDark ? "#111827" : "#D1D5DB",
    wire: isDark ? "#38BDF8" : "#3B82F6",
    glow: isDark ? "#38BDF8" : "#38BDF8",
    money: isDark ? "#22C55E" : "#16A34A",
    gold: isDark ? "#FACC15" : "#EAB308",
    text: isDark ? "#E2E8F0" : "#1E293B",
  };

  return (
    <section
      className="relative flex flex-col items-center justify-center py-16 overflow-hidden px-4 sm:px-6 lg:px-12"
      style={{
        background: "transparent",
      }}
    >
      {/* 🧠 Title */}
      <div className="relative z-20 text-center mb-10 px-4">
        <h2 className="text-xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent leading-tight">
        Journal Dashboard Display
        </h2>
      </div>

      {/* 💻 iMac */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative flex flex-col items-center z-10 pb-10 w-full max-w-[900px] mb-30"
        style={{ perspective: "1200px" }}
      >
        {/* 🖥 iMac Frame */}
        <motion.div
          className="relative rounded-xl overflow-hidden shadow-sm border w-full max-w-[850px]"
          style={{
            aspectRatio: "16 / 9",
            background: palette.frame,
            borderColor: palette.screenBorder,
            boxShadow: `0 1px 5px ${palette.glow}`,
          }}
          whileHover={{ rotateY: 0.2, rotateX: -0.1, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 150, damping: 18 }}
        >
          {/* Inner Screen */}
          <div
            className="absolute inset-[10px] sm:inset-[12px] rounded-lg overflow-hidden"
            style={{
              background: "#FF6A37",
              boxShadow: `inset 0 0 5px rgba(0,0,0,0.25)`,
            }}
          >
            <Image
              src="/images/dashboard-screenshot.png"
              alt="Dashboard Screenshot"
              fill
              style={{
                objectFit: "cover",
                borderRadius: "0.5rem",
              }}
              priority
            />
          </div>

          {/* iMac chin */}
          <div
            className="absolute bottom-0 w-full h-[40px] sm:h-[55px] rounded-b-xl flex items-center justify-center"
            style={{
              background: `linear-gradient(180deg, ${palette.chin} 0%, #FF6A37 100%)`,
            }}
          >
            <div
              className="w-10 sm:w-12 h-[3px] sm:h-[4px] rounded-full"
              style={{
                background: palette.wire,
                boxShadow: `0 0 0.5px ${palette.glow}`,
              }}
            ></div>
          </div>
        </motion.div>

        {/* 🧍 iMac Stand */}
        <motion.div
          className="w-[140px] sm:w-[200px] h-[10px] sm:h-[14px] mt-6 sm:mt-10 rounded-full"
          style={{
            background: `linear-gradient(90deg, rgba(156,163,175,0.3), #FF6A37, rgba(156,163,175,0.3))`,
            boxShadow: `0 1px 10px ${palette.glow}`,
          }}
          animate={{ opacity: [0.8, 0.6, 0.8] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        />
      </motion.div>

      {/* ⚡ Energy wire connecting from center to bag */}
      <svg
        className="absolute bottom-[1rem] sm:bottom-[2rem] left-1/2 -translate-x-1/2 z-10 w-[90vw] max-w-[480px] h-auto"
        viewBox="0 0 480 220"
      >
        {/* Base glowing wire */}
        <path
          id="energyPath"
          d="M0 140 Q120 80, 240 140 T480 140"
          stroke={palette.wire}
          strokeWidth="3"
          fill="transparent"
          strokeLinecap="round"
          style={{
            filter: "drop-shadow(0 0 10px #0EA5E9)",
            opacity: 0.4,
          }}
        />

        {/* Energy pulse */}
        <motion.circle
          r="8"
          fill="#38BDF8"
          style={{
            filter: "drop-shadow(0 0 16px #38BDF8)",
          }}
          animate={{ scale: [0.8, 1.4, 0.8], opacity: [0.6, 1, 0.6] }}
          transition={{
            repeat: Infinity,
            duration: 1.2,
            ease: "easeInOut",
          }}
        >
          <animateMotion dur="2.8s" repeatCount="indefinite" rotate="auto">
            <mpath xlinkHref="#energyPath" />
          </animateMotion>
        </motion.circle>

        {/* Flowing glow tail */}
        <motion.path
          d="M0 140 Q120 80, 240 140 T480 140"
          stroke="url(#glowGradient)"
          strokeWidth="6"
          fill="transparent"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1] }}
          transition={{
            duration: 2.8,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />

        {/* Gradient for energy tail */}
        <defs>
          <linearGradient id="glowGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0" />
            <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </section>
  );
}
