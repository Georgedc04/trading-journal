"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";

export default function KPITiles({ report, loading }: any) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const palette = {
    bg: isDark
      ? "linear-gradient(145deg, rgba(15,23,42,0.9), rgba(2,6,23,0.7))"
      : "linear-gradient(145deg, rgba(240,249,255,0.9), rgba(224,242,254,0.8))",
    border: isDark ? "rgba(56,189,248,0.2)" : "rgba(37,99,235,0.2)",
    text: isDark ? "#E2E8F0" : "#1E293B",
    sub: isDark ? "#94A3B8" : "#334155",
    glow: isDark ? "rgba(56,189,248,0.2)" : "rgba(37,99,235,0.15)",
  };

  if (loading)
    return (
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-20 rounded-xl animate-pulse"
            style={{
              background: isDark ? "rgba(30,41,59,0.4)" : "rgba(226,232,240,0.6)",
            }}
          />
        ))}
      </div>
    );

  const tiles = [
    { label: "Total Trades", value: report.total },
    { label: "Win Rate", value: `${report.winRate}%` },
    { label: "Avg Win", value: `$${report.avgWin.toFixed?.(2) || 0}` },
    { label: "Avg Loss", value: `$${report.avgLoss.toFixed?.(2) || 0}` },
    { label: "Expectancy", value: `$${report.expectancy.toFixed?.(2) || 0}` },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {tiles.map((it, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, duration: 0.3 }}
          whileHover={{ scale: 1.03, y: -2 }}
          className="p-4 rounded-xl border shadow-md backdrop-blur-xl"
          style={{
            background: palette.bg,
            borderColor: palette.border,
            boxShadow: `0 0 20px ${palette.glow}`,
            color: palette.text,
          }}
        >
          <div
            className="text-xs uppercase tracking-wide font-medium"
            style={{ color: palette.sub }}
          >
            {it.label}
          </div>
          <div
            className="text-lg font-bold mt-1"
            style={{
              background: isDark
                ? "linear-gradient(to right, #38BDF8, #22C55E)"
                : "linear-gradient(to right, #0284C7, #16A34A)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {it.value}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
