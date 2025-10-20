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
  // ✅ Safely handle undefined or missing props
  const dailyPnL = Number(report?.dailyPnL ?? 0);
  const goal = Number(report?.goal ?? 1); // prevent division by zero
  const winRate = Number(report?.winRate ?? 0);
  const maxDrawdown = Number(report?.maxDrawdown ?? 0);
  const totalTrades = Number(report?.totalTrades ?? 0);

  const riskUsed = Math.min((Math.abs(dailyPnL) / goal) * 100, 100);
  const isOverLimit = dailyPnL <= -goal;
  const safe = dailyPnL > -goal / 2 && dailyPnL >= 0;

  // Dynamic colors
  const barColor = isOverLimit
    ? "#EF4444"
    : safe
    ? "#22C55E"
    : "#FACC15";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-5 rounded-2xl border shadow-lg backdrop-blur-xl bg-gradient-to-br from-slate-900/30 to-cyan-900/10 border-cyan-500/20"
    >
      <h2 className="font-semibold text-lg text-sky-300 mb-3 flex items-center gap-2">
        📊 Live Risk Monitor
      </h2>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-cyan-300">Daily PnL:</span>
          <span
            className={`font-semibold ${
              dailyPnL >= 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            ${dailyPnL.toFixed(2)}
          </span>
        </div>
        <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${riskUsed}%`, backgroundColor: barColor }}
            transition={{ duration: 0.6 }}
            className="h-full rounded-full"
          />
        </div>
        <div className="text-xs text-sky-200 mt-1">
          {isOverLimit
            ? "⚠️ Daily risk limit breached!"
            : `Using ${riskUsed.toFixed(1)}% of max loss ($${goal})`}
        </div>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-3 gap-4 text-center mt-5">
        <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-700/30">
          <TrendingUp className="mx-auto text-green-400" />
          <div className="text-xs mt-1 text-sky-200">Win Rate</div>
          <div className="text-base font-semibold text-green-300">
            {winRate.toFixed(1)}%
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-700/30">
          <AlertTriangle className="mx-auto text-yellow-400" />
          <div className="text-xs mt-1 text-sky-200">Drawdown</div>
          <div className="text-base font-semibold text-yellow-300">
            {maxDrawdown.toFixed(1)}%
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-700/30">
          <TrendingDown className="mx-auto text-cyan-400" />
          <div className="text-xs mt-1 text-sky-200">Trades</div>
          <div className="text-base font-semibold text-cyan-300">
            {totalTrades}
          </div>
        </div>
      </div>

      {/* Final summary note */}
      <div className="mt-4 text-sm text-center opacity-75 text-sky-100">
        {isOverLimit
          ? "🚨 You’ve exceeded your risk limit. Stop trading for the day."
          : safe
          ? "✅ You’re within safe risk range. Keep executing with discipline."
          : "⚠️ Watch out — you’re nearing your daily max loss threshold."}
      </div>
    </motion.div>
  );
}
