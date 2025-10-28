"use client";

import React, { useMemo } from "react";
import useTrades from "../hook/useTrades";
import { motion } from "framer-motion";

type SessionName = "London" | "New York" | "Asian";

export default function SessionPerformanceTable() {
  const { trades } = useTrades();

  // 🎨 Dark Mode Palette
  const palette = {
    bg: "rgba(11,15,20,0.85)",
    text: "#E2E8F0",
    border: "rgba(56,189,248,0.15)",
    win: "#22c55e",
    loss: "#ef4444",
    barBg: "rgba(255,255,255,0.08)",
  };

  // 🧮 Compute session stats
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

  // 📊 Format data for table
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
      className="w-full max-w-4xl mx-auto mt-10 text-slate-200"
      style={{
        background: palette.bg,
        borderRadius: "1rem",
        border: `1px solid ${palette.border}`,
        boxShadow: "0 8px 25px rgba(56,189,248,0.15)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div className="p-5 border-b border-sky-400/10">
        <h2 className="text-xl font-semibold bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
          Session Performance Summary
        </h2>
        <p className="text-sm opacity-70 text-slate-400">
          Compare your trading discipline across sessions 🚀
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-slate-400">
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
                className="transition-all duration-300 hover:bg-sky-500/5"
              >
                <td className="px-6 py-4 font-medium text-slate-200">{r.session}</td>
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
