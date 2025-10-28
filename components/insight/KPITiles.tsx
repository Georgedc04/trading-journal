"use client";

import { motion } from "framer-motion";

export default function KPITiles({ report, loading }: any) {
  // 🧠 Fixed Neon Palette (always dark)
  const palette = {
    bg: "linear-gradient(145deg, rgba(11,15,20,0.95), rgba(17,24,39,0.95))",
    border: "rgba(56,189,248,0.25)",
    text: "#E2E8F0",
    sub: "rgba(148,163,184,0.75)",
    glow: "rgba(56,189,248,0.2)",
  };

  // 🌀 Loading Skeleton
  if (loading)
    return (
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-20 rounded-xl animate-pulse"
            style={{
              background: "rgba(17,24,39,0.6)",
              boxShadow: "0 0 15px rgba(56,189,248,0.05)",
            }}
          />
        ))}
      </div>
    );

  // 📊 KPI Data
  const tiles = [
    { label: "Total Trades", value: report.total ?? 0 },
    { label: "Win Rate", value: `${report.winRate ?? 0}%` },
    { label: "Avg Win", value: `$${report.avgWin?.toFixed?.(2) || 0}` },
    { label: "Avg Loss", value: `$${report.avgLoss?.toFixed?.(2) || 0}` },
    { label: "Expectancy", value: `$${report.expectancy?.toFixed?.(2) || 0}` },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {tiles.map((it, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06, duration: 0.35 }}
          whileHover={{ scale: 1.04, y: -3 }}
          className="p-4 rounded-xl border shadow-md backdrop-blur-xl transition-all"
          style={{
            background: palette.bg,
            borderColor: palette.border,
            boxShadow: `0 0 25px ${palette.glow}`,
            color: palette.text,
          }}
        >
          <div
            className="text-xs uppercase tracking-wide font-medium mb-1"
            style={{ color: palette.sub }}
          >
            {it.label}
          </div>

          <div
            className="text-lg font-bold bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent"
            style={{
              textShadow: "0 0 8px rgba(56,189,248,0.3)",
            }}
          >
            {it.value}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
