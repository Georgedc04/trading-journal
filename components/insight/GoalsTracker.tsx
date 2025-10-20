"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Target, TrendingUp } from "lucide-react";

export default function GoalsTracker({ report }: any) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const target = report?.goals?.winRateTarget ?? 60;
  const current = report?.goals?.currentWinRate ?? 0;
  const progress = Math.min(100, (current / target) * 100 || 0);

  const palette = {
    bg: isDark
      ? "linear-gradient(145deg, rgba(15,23,42,0.8), rgba(7,89,133,0.5))"
      : "linear-gradient(145deg, rgba(240,249,255,0.95), rgba(186,230,253,0.8))",
    border: isDark ? "rgba(56,189,248,0.2)" : "rgba(37,99,235,0.2)",
    text: isDark ? "#E2E8F0" : "#1E293B",
    sub: isDark ? "#94A3B8" : "#334155",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.4 }}
      className="rounded-xl p-5 border shadow-lg backdrop-blur-xl"
      style={{
        background: palette.bg,
        borderColor: palette.border,
        boxShadow: `0 0 25px ${isDark ? "rgba(56,189,248,0.1)" : "rgba(37,99,235,0.1)"}`,
      }}
    >
      {/* 🔹 Header */}
      <div className="flex items-center gap-2 mb-4">
        <Target className={isDark ? "text-cyan-400" : "text-sky-600"} />
        <h2
          className="font-semibold text-lg"
          style={{
            color: isDark ? "#7DD3FC" : "#0369A1",
          }}
        >
          Goals Tracker
        </h2>
      </div>

      {/* 🔹 Stats */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-sm" style={{ color: palette.sub }}>
            Target Win Rate
          </div>
          <div className="text-lg font-semibold text-sky-300">{target}%</div>
        </div>
        <div className="text-right">
          <div className="text-sm" style={{ color: palette.sub }}>
            Current
          </div>
          <div
            className={`text-lg font-semibold ${
              current >= target ? "text-emerald-400" : "text-cyan-300"
            }`}
          >
            {current.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* 🔹 Progress Bar */}
      <div
        className="w-full h-3 rounded-full overflow-hidden"
        style={{
          background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
        }}
      >
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-300"
          style={{ width: `${progress}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>

      {/* 🔹 Footer message */}
      <div
        className="flex items-center justify-between mt-3 text-xs"
        style={{ color: palette.sub }}
      >
        <span>
          {progress >= 100
            ? "🎯 Goal achieved! Time to raise the bar."
            : "Keep refining your strategy — consistency wins."}
        </span>

        <TrendingUp
          size={14}
          className={
            progress >= 100
              ? "text-emerald-400 animate-pulse"
              : "text-cyan-400 opacity-80"
          }
        />
      </div>
    </motion.div>
  );
}
