"use client";

import { motion } from "framer-motion";
import { TrendingDown, TrendingUp, AlertTriangle } from "lucide-react";

type RiskReport = {
  totalPnL?: number;
  dailyPnL?: number;
  goal?: number;
  winRate?: number;
  maxDrawdown?: number;
  totalTrades?: number;
};

export default function RiskMonitor({ report }: { report?: RiskReport }) {
  // 🧠 Safe defaults
  const dailyPnL = Number(report?.dailyPnL ?? 0);
  const goal = Math.max(Number(report?.goal ?? 1), 1); // avoid /0
  const winRate = Number(report?.winRate ?? 0);
  const maxDrawdown = Number(report?.maxDrawdown ?? 0);
  const totalTrades = Number(report?.totalTrades ?? 0);

  const riskUsed = Math.min((Math.abs(dailyPnL) / goal) * 100, 100);
  const isOverLimit = dailyPnL <= -goal;
  const safe = dailyPnL > -goal / 2 && dailyPnL >= 0;

  // 🌈 Dynamic color glow
  const barColor = isOverLimit
    ? "#EF4444"
    : safe
    ? "#22C55E"
    : "#FACC15";

  // 🎨 DC Trades Neon Palette
  const palette = {
    bg: "linear-gradient(145deg, rgba(11,15,20,0.95), rgba(17,24,39,0.95))",
    border: "rgba(56,189,248,0.25)",
    text: "#E2E8F0",
    accent: "#38BDF8",
    shadow: "0 0 25px rgba(56,189,248,0.15)",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 rounded-2xl border shadow-lg backdrop-blur-xl transition-all"
      style={{
        background: palette.bg,
        borderColor: palette.border,
        boxShadow: palette.shadow,
        color: palette.text,
      }}
    >
      {/* === Header === */}
      <h2 className="font-semibold text-lg flex items-center gap-2 mb-5 bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
        📊 Live Risk Monitor
      </h2>

      {/* === Risk Bar === */}
      <div className="mb-5">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-sky-300">Daily PnL:</span>
          <span
            className={`font-semibold ${
              dailyPnL >= 0 ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            ${dailyPnL.toFixed(2)}
          </span>
        </div>

        <div
          className="relative h-3 rounded-full overflow-hidden border backdrop-blur-sm"
          style={{
            background: "rgba(255,255,255,0.06)",
            borderColor: "rgba(56,189,248,0.15)",
          }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{
              width: `${riskUsed}%`,
              background: `linear-gradient(90deg, ${barColor}, #38BDF8)`,
              boxShadow: `0 0 12px ${barColor}`,
            }}
            initial={{ width: 0 }}
            animate={{ width: `${riskUsed}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>

        <div className="text-xs text-slate-400 mt-2">
          {isOverLimit
            ? "⚠️ Daily risk limit breached!"
            : `Using ${riskUsed.toFixed(1)}% of max loss ($${goal})`}
        </div>
      </div>

      {/* === Mini Stats === */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        {/* Win Rate */}
        <div className="p-3 rounded-xl border text-center transition-all hover:scale-105"
          style={{
            borderColor: "rgba(56,189,248,0.15)",
            background: "rgba(17,24,39,0.7)",
            boxShadow: "0 0 15px rgba(56,189,248,0.05)",
          }}>
          <TrendingUp className="mx-auto text-emerald-400" />
          <p className="text-xs mt-1 text-slate-400">Win Rate</p>
          <p className="text-base font-semibold text-emerald-300">
            {winRate.toFixed(1)}%
          </p>
        </div>

        {/* Drawdown */}
        <div className="p-3 rounded-xl border text-center transition-all hover:scale-105"
          style={{
            borderColor: "rgba(56,189,248,0.15)",
            background: "rgba(17,24,39,0.7)",
            boxShadow: "0 0 15px rgba(56,189,248,0.05)",
          }}>
          <AlertTriangle className="mx-auto text-yellow-400" />
          <p className="text-xs mt-1 text-slate-400">Drawdown</p>
          <p className="text-base font-semibold text-yellow-300">
            {maxDrawdown.toFixed(1)}%
          </p>
        </div>

        {/* Trades */}
        <div className="p-3 rounded-xl border text-center transition-all hover:scale-105"
          style={{
            borderColor: "rgba(56,189,248,0.15)",
            background: "rgba(17,24,39,0.7)",
            boxShadow: "0 0 15px rgba(56,189,248,0.05)",
          }}>
          <TrendingDown className="mx-auto text-cyan-400" />
          <p className="text-xs mt-1 text-slate-400">Trades</p>
          <p className="text-base font-semibold text-cyan-300">
            {totalTrades}
          </p>
        </div>
      </div>

      {/* === Footer Note === */}
      <div className="mt-5 text-sm text-center text-sky-300/80 italic">
        {isOverLimit
          ? "🚨 You've exceeded your daily risk limit. Stop trading for the day."
          : safe
          ? "✅ Safe zone. Maintain discipline and trade your plan."
          : "⚠️ Caution — nearing daily drawdown limit."}
      </div>
    </motion.div>
  );
}
