"use client";

import { motion } from "framer-motion";
import { Target, TrendingUp } from "lucide-react";

export default function GoalsTracker({ report }: any) {
  const target = report?.goals?.winRateTarget ?? 60;
  const current = report?.goals?.currentWinRate ?? 0;
  const progress = Math.min(100, (current / target) * 100 || 0);

  // 🎨 DC Trades Neon Palette
  const palette = {
    bg: "linear-gradient(145deg, rgba(11,15,20,0.95), rgba(17,24,39,0.95))",
    border: "rgba(56,189,248,0.25)",
    accent: "#38BDF8",
    text: "#E2E8F0",
    sub: "rgba(148,163,184,0.75)",
    shadow: "0 0 25px rgba(56,189,248,0.15)",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl p-6 border backdrop-blur-xl shadow-lg transition-all"
      style={{
        background: palette.bg,
        borderColor: palette.border,
        boxShadow: palette.shadow,
        color: palette.text,
      }}
    >
      {/* === Header === */}
      <div className="flex items-center gap-2 mb-5">
        <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-400/20 shadow-inner">
          <Target size={18} className="text-sky-400" />
        </div>
        <h2 className="text-lg font-semibold bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
          Goals Tracker
        </h2>
      </div>

      {/* === Win Rate Info === */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-slate-400">Target Win Rate</p>
          <p className="text-lg font-semibold text-sky-300">{target}%</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-400">Current</p>
          <p
            className={`text-lg font-semibold ${
              current >= target ? "text-emerald-400" : "text-cyan-300"
            }`}
          >
            {current.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* === Progress Bar === */}
      <div
        className="w-full h-3 rounded-full overflow-hidden border"
        style={{
          borderColor: "rgba(56,189,248,0.2)",
          background: "rgba(255,255,255,0.08)",
          boxShadow: "inset 0 0 10px rgba(56,189,248,0.1)",
        }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{
            background:
              "linear-gradient(90deg, #22C55E, #38BDF8, #06B6D4)",
            width: `${progress}%`,
            boxShadow: "0 0 15px rgba(56,189,248,0.4)",
          }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>

      {/* === Footer === */}
      <div className="flex items-center justify-between mt-4 text-xs text-slate-400">
        <span className="italic">
          {progress >= 100
            ? "🎯 Goal achieved! Time to raise the bar."
            : "Keep refining your edge — consistency compounds."}
        </span>
        <TrendingUp
          size={14}
          className={`${
            progress >= 100
              ? "text-emerald-400 animate-pulse"
              : "text-cyan-400 opacity-80"
          }`}
        />
      </div>
    </motion.div>
  );
}
