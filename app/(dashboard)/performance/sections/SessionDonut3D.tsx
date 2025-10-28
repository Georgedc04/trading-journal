// components/SessionDonut3D.tsx
"use client";

import React, { useMemo } from "react";
import { useTheme } from "next-themes";
import useTrades from "../hook/useTrades"; // match your hook path
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { motion } from "framer-motion";

type SessionName = "London" | "New York" | "Asian";

const SESSION_ORDER: SessionName[] = ["London", "New York", "Asian"];

/**
 * SessionDonut3D
 * - Shows 3 faux-3D donut charts for three trading sessions
 * - Pulls trades from useTrades (cached hook)
 * - Simulates depth with gradients and an SVG "inner-shadow" filter
 */
export default function SessionDonut3D() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { trades, loading } = useTrades();

  // Prepare counts per session and results breakdown (wins/losses)
  const sessionsData = useMemo(() => {
    const base = {
      London: { wins: 0, losses: 0, total: 0 },
      "New York": { wins: 0, losses: 0, total: 0 },
      Asian: { wins: 0, losses: 0, total: 0 },
    } as Record<SessionName, { wins: number; losses: number; total: number }>;

    if (!Array.isArray(trades) || trades.length === 0) {
      return base;
    }

    for (const t of trades) {
      const session = (t.session || "London") as SessionName;
      const isWin = (t.result ?? t.profitLoss ?? 0) > 0;
      if (!base[session]) base[session] = { wins: 0, losses: 0, total: 0 };
      base[session].total += 1;
      if (isWin) base[session].wins += 1;
      else base[session].losses += 1;
    }

    return base;
  }, [trades]);

  // Visual palette tuned for dark/light
  const palette = {
    bg: isDark ? "rgba(6,8,15,0.6)" : "rgba(6,8,15,0.6)",
    cardBorder: isDark ? "rgba(56,189,248,0.12)" : "rgba(56,189,248,0.12)",
    winGradientStart: isDark ? "#22c55e" : "#22c55e",
    winGradientEnd: isDark ? "#06b6d4" : "#06b6d4",
    lossGradientStart: isDark ? "#fb7185" : "#ef4444",
    lossGradientEnd: isDark ? "#ef4444" : "#ef4444",
    accentGlow: isDark ? "rgba(56,189,248,0.08)" : "rgba(56,189,248,0.08)",
    text: isDark ? "#E6EEF7" : "#E6EEF7",
  };

  // For each session produce data array suitable for recharts
  const makeChartData = (s: SessionName) => {
    const stat = sessionsData[s];
    if (!stat) return [{ name: "No trades", value: 1, type: "empty" }];
    if (stat.total === 0)
      return [{ name: "No trades", value: 1, type: "empty" }];

    return [
      { name: "Wins", value: stat.wins, type: "win" },
      { name: "Losses", value: stat.losses, type: "loss" },
    ];
  };

  // tooltip formatter
  const tooltipFormatter = (value: number, name: string, entry: any) => {
    return [`${value}`, `${name}`];
  };

  // Small helper to compute percent text
  const percentText = (s: SessionName) => {
    const st = sessionsData[s];
    if (!st || st.total === 0) return "—";
    const pct = Math.round((st.wins / st.total) * 100);
    return `${pct}% W`;
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      viewport={{ once: true }}
      className="w-full max-w-6xl mx-auto"
    >
      <div
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-stretch"
        style={{ color: palette.text }}
      >
        {/* inline SVG filters + gradients shared for 3 charts */}
        <svg width="0" height="0" style={{ position: "absolute" }}>
          <defs>
            {/* subtle inner shadow filter for '3D' effect */}
            <filter id="innerShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feOffset dx="0" dy="2" result="offsetBlur" />
              <feComposite operator="out" in="SourceGraphic" in2="offsetBlur" result="inverse" />
              <feFlood floodColor="#000" floodOpacity={isDark ? 0.45 : 0.08} result="color" />
              <feComposite operator="in" in="color" in2="inverse" result="shadow" />
              <feComposite operator="over" in="shadow" in2="SourceGraphic" />
            </filter>

            {/* gradient sets for wins/losses */}
            <linearGradient id="gradWin" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor={palette.winGradientStart} />
              <stop offset="100%" stopColor={palette.winGradientEnd} />
            </linearGradient>

            <linearGradient id="gradLoss" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor={palette.lossGradientStart} />
              <stop offset="100%" stopColor={palette.lossGradientEnd} />
            </linearGradient>

            {/* rim highlight to emulate curved top */}
            <radialGradient id="rim" cx="30%" cy="20%" r="70%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.5" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.0)" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>

        {SESSION_ORDER.map((session) => {
          const data = makeChartData(session);
          const total = data.reduce((s, d) => s + d.value, 0);
          const hasReal = !(data.length === 1 && data[0].type === "empty");

          return (
            <motion.div
              key={session}
              className="rounded-2xl p-4 border shadow-sm flex flex-col items-center"
              style={{
                background: palette.bg,
                borderColor: palette.cardBorder,
                boxShadow: `0 6px 20px ${palette.accentGlow}`,
              }}
              whileHover={{ scale: hasReal ? 1.02 : 1 }}
            >
              <div className="w-full flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-sm font-semibold " style={{ color: palette.text }}>
                    {session}
                  </h4>
                  <p className="text-xs opacity-80" style={{ color: palette.text }}>
                    {hasReal ? `${total} trades` : "No trades"}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-sm font-bold" style={{ color: palette.text }}>
                    {percentText(session as SessionName)}
                  </div>
                  <div className="text-xs opacity-75">win rate</div>
                </div>
              </div>

              <div className="w-full h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    {/* Slight circle behind to emphasize depth */}
                    <circle cx="50%" cy="50%" r="40%" fill="rgba(0,0,0,0.03)" />

                    <Pie
                      data={data}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius="58%"
                      outerRadius="80%"
                      paddingAngle={4}
                      stroke="transparent"
                      startAngle={90}
                      endAngle={450}
                      isAnimationActive={!loading}
                    >
                      {data.map((entry, idx) => {
                        if (entry.type === "empty") {
                          return (
                            <Cell
                              key={idx}
                              fill={isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.04)"}
                            />
                          );
                        }
                        return (
                          <Cell
                            key={idx}
                            fill={entry.type === "win" ? "url(#gradWin)" : "url(#gradLoss)"}
                            stroke="rgba(255,255,255,0.06)"
                            strokeWidth={0.6}
                          />
                        );
                      })}
                    </Pie>

                    {/* top rim highlight layer */}
                    <Pie
                      data={[{ name: "rim", value: 1 }]}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      innerRadius="78%"
                      outerRadius="82%"
                      stroke="none"
                    >
                      <Cell key="rim" fill="url(#rim)" />
                    </Pie>

                    <Tooltip
                      formatter={tooltipFormatter}
                      contentStyle={{
                        background: isDark ? "#fff" : "#fff",
                        border: "1px solid rgba(0,0,0,0.06)",
                        boxShadow: `0 6px 20px ${isDark ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.06)"}`,
                        color: palette.text,
                        borderRadius: 10,
                        padding: "8px 10px",
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      align="center"
                      wrapperStyle={{ fontSize: 12, marginTop: 6, color: palette.text }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-3 w-full flex justify-center gap-3 text-xs">
                    <div className="flex items-center gap-2">
                        <span
                        className="w-3 h-3 rounded-full"
                        style={{
                            background: `linear-gradient(135deg, ${palette.winGradientStart}, ${palette.winGradientEnd})`,
                        }}
                        />
                        <span className="opacity-85">Wins</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span
                        className="w-3 h-3 rounded-full"
                        style={{
                            background: `linear-gradient(135deg, ${palette.lossGradientStart}, ${palette.lossGradientEnd})`,
                        }}
                        />
                        <span className="opacity-85">Losses</span>
                    </div>
                    </div>

            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
