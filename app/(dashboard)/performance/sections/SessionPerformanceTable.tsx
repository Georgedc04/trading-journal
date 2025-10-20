"use client";

import React, { useMemo } from "react";
import { useTheme } from "next-themes";
import useTrades from "../hook/useTrades";
import { motion } from "framer-motion";

type SessionName = "London" | "New York" | "Asian";

export default function SessionPerformanceTable() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { trades } = useTrades();

  // 🎯 Palette matching your donut charts
  const palette = {
    bg: isDark ? "rgba(6,8,15,0.6)" : "rgba(255,255,255,0.9)",
    text: isDark ? "#E6EEF7" : "#0f172a",
    border: isDark ? "rgba(56,189,248,0.15)" : "rgba(37,99,235,0.15)",
    win: isDark ? "#22c55e" : "#16A34A",
    loss: isDark ? "#ef4444" : "#DC2626",
    barBg: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
  };

  // 🧮 Compute per-session stats
  const sessions = useMemo(() => {
    const base = {
      London: { wins: 0, losses: 0, total: 0 },
      "New York": { wins: 0, losses: 0, total: 0 },
      Asian: { wins: 0, losses: 0, total: 0 },
    } as Record<SessionName, { wins: number; losses: number; total: number }>;

    trades?.forEach((t) => {
      const session = (t.session || "London") as SessionName;
      const isWin = (t.result ?? t.profitLoss ?? 0) > 0;
      base[session].total++;
      if (isWin) base[session].wins++;
      else base[session].losses++;
    });

    return base;
  }, [trades]);

  // 📊 Make data array for rendering
  const rows = Object.entries(sessions).map(([session, stats]) => {
    const winRate =
      stats.total > 0 ? Math.round((stats.wins / stats.total) * 100) : 0;
    return { session, ...stats, winRate };
  });

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      viewport={{ once: true }}
      className="w-full max-w-4xl mx-auto mt-10"
      style={{
        background: palette.bg,
        borderRadius: "1rem",
        border: `1px solid ${palette.border}`,
        boxShadow: isDark
          ? "0 8px 25px rgba(56,189,248,0.1)"
          : "0 8px 25px rgba(37,99,235,0.08)",
        overflow: "hidden",
      }}
    >
      <div className="p-5 border-b" style={{ borderColor: palette.border }}>
        <h2
          className="text-xl font-semibold bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent"
        >
          Session Performance Summary
        </h2>
        <p className="text-sm opacity-70" style={{ color: palette.text }}>
          Compare your trading discipline across sessions 🚀
        </p>
      </div>

      {/* === Table === */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr
              className="text-left text-xs uppercase tracking-wide"
              style={{ color: palette.text, opacity: 0.6 }}
            >
              <th className="px-6 py-3">Session</th>
              <th className="px-6 py-3 text-center">Trades</th>
              <th className="px-6 py-3 text-center">Wins</th>
              <th className="px-6 py-3 text-center">Losses</th>
              <th className="px-6 py-3 text-center">Win Rate</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r, i) => (
              <tr
                key={i}
                className={`transition-all duration-300 ${
                  isDark
                    ? "hover:bg-slate-800/50"
                    : "hover:bg-slate-100/60"
                }`}
                style={{ color: palette.text }}
              >
                <td className="px-6 py-4 font-medium">{r.session}</td>
                <td className="px-6 py-4 text-center">{r.total}</td>
                <td className="px-6 py-4 text-center" style={{ color: palette.win }}>
                  {r.wins}
                </td>
                <td className="px-6 py-4 text-center" style={{ color: palette.loss }}>
                  {r.losses}
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <span className="font-semibold">{r.winRate}%</span>
                    <div
                      className="w-24 h-2 rounded-full overflow-hidden"
                      style={{ background: palette.barBg }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${r.winRate}%`,
                          background:
                            r.winRate > 60
                              ? palette.win
                              : r.winRate >= 40
                              ? "#EAB308"
                              : palette.loss,
                        }}
                      ></div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.section>
  );
}
