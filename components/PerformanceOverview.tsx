"use client";

import { JSX, useEffect, useMemo, useState } from "react";
import {
  Skull,
  Trophy,
  TrendingUp,
  TrendingDown,
  BarChart2,
  Activity,
  Target,
  Loader2,
} from "lucide-react";

type Props = {
  trades: any[];
  accountSize: number | string;
  targetPercent: number | string;
};

export default function PerformanceOverview({
  trades,
  accountSize,
  targetPercent,
}: Props) {
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (trades?.length >= 0) {
      setRefreshing(true);
      const timer = setTimeout(() => setRefreshing(false), 700);
      return () => clearTimeout(timer);
    }
  }, [JSON.stringify(trades)]);

  // === Stats Calculation ===
  const stats = useMemo(() => {
    if (!trades || trades.length === 0)
      return {
        total: 0,
        wins: 0,
        losses: 0,
        winRate: 0,
        bestPair: "—",
        best: 0,
        worst: 0,
        progress: 0,
      };

    const total = trades.length;
    const profits = trades.filter((t) => (t.result ?? 0) > 0);
    const losses = trades.filter((t) => (t.result ?? 0) < 0);
    const winRate = total > 0 ? ((profits.length / total) * 100).toFixed(1) : "0.0";

    // Best pair
    const pairProfits: Record<string, number> = {};
    trades.forEach((t) => {
      const pair = t.pair || "Unknown";
      const profit = Number(t.result ?? 0);
      pairProfits[pair] = (pairProfits[pair] || 0) + profit;
    });
    const sorted = Object.entries(pairProfits).sort((a, b) => b[1] - a[1]);
    const bestPair = sorted[0]?.[1] > 0 ? sorted[0][0] : "—";

    const profitsList = trades.map((t) => Number(t.result ?? 0));
    const best = Math.max(...profitsList.filter((v) => v > 0), 0);
    const worst = Math.min(...profitsList.filter((v) => v < 0), 0);

    const acc = Number(accountSize) || 0;
    const target = Number(targetPercent) || 0;
    const totalGain = profitsList.reduce((a, b) => a + b, 0);
    const targetValue = acc * (target / 100);
    const progress = targetValue ? (totalGain / targetValue) * 100 : 0;

    return { total, wins: profits.length, losses: losses.length, winRate, bestPair, best, worst, progress };
  }, [trades, accountSize, targetPercent]);

  // === Neon palette ===
  const palette = {
    bg: "linear-gradient(145deg, #0B0F14, #111827)",
    border: "rgba(56,189,248,0.25)",
    text: "#E2E8F0",
    accent: "#38BDF8",
    shadow: "0 0 25px rgba(56,189,248,0.15)",
    profit: "#00FF88",
    loss: "#FF4D4D",
  };

  const getBarColor = (value: number) =>
    value >= 0
      ? "linear-gradient(90deg, #00FFD1, #00FF88, #38BDF8)"
      : "linear-gradient(90deg, #FF6B6B, #FF4D4D, #DC2626)";

  return (
    <div
      className={`mt-6 p-6 rounded-2xl border w-full max-w-5xl mx-auto transition-all duration-500 ${
        refreshing ? "opacity-70 scale-[0.99]" : "opacity-100 scale-100"
      }`}
      style={{
        background: palette.bg,
        borderColor: palette.border,
        boxShadow: palette.shadow,
        color: palette.text,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold flex items-center gap-2 text-sky-400">
          <BarChart2 size={20} /> Performance Overview
        </h2>
        {refreshing && <Loader2 className="animate-spin text-sky-400 w-5 h-5" />}
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard icon={<Activity size={18} />} label="Total Trades" value={stats.total} color={palette.text} />
        <StatCard icon={<TrendingUp size={18} />} label="Wins" value={stats.wins} color={palette.profit} />
        <StatCard icon={<TrendingDown size={18} />} label="Losses" value={stats.losses} color={palette.loss} />
        <StatCard icon={<Trophy size={18} />} label="Win Rate" value={`${stats.winRate}%`} color={palette.profit} />
        <StatCard icon={<BarChart2 size={18} />} label="Best Pair" value={stats.bestPair} color={palette.accent} />
        <StatCard icon={<Target size={18} />} label="Profit Target" value={`${Math.abs(stats.progress).toFixed(1)}%`} color={palette.accent} />
      </div>

      {/* Best / Worst */}
      <div className="mt-6 flex flex-wrap gap-6 text-sm sm:text-base">
        <div className="flex items-center gap-2">
          <Trophy className="text-yellow-400 w-5 h-5" />
          <span className="font-semibold">Best Trade:</span>
          <span style={{ color: palette.profit }}>
            {stats.best > 0 ? `+${stats.best.toFixed(2)}` : "—"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Skull className="text-rose-500 w-5 h-5" />
          <span className="font-semibold">Worst Trade:</span>
          <span style={{ color: palette.loss }}>
            {stats.worst < 0 ? stats.worst.toFixed(2) : "—"}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="flex justify-between text-sm font-medium mb-1">
          <span>Performance vs Target</span>
          <span
            className="font-semibold"
            style={{
              color: stats.progress >= 0 ? palette.profit : palette.loss,
            }}
          >
            {stats.progress >= 0
              ? `+${stats.progress.toFixed(1)}% Gain`
              : `${stats.progress.toFixed(1)}% Drawdown`}
          </span>
        </div>

        <div
          className="relative h-5 w-full rounded-full overflow-hidden border backdrop-blur-sm"
          style={{
            background: "#0F172A",
            borderColor: palette.border,
          }}
        >
          <div
            className="h-full rounded-full transition-[width,background] duration-700 ease-out shadow-md"
            style={{
              width: `${Math.min(Math.abs(stats.progress), 100)}%`,
              background: getBarColor(stats.progress),
              boxShadow: `0 0 10px ${
                stats.progress >= 0 ? palette.profit : palette.loss
              }`,
            }}
          />
        </div>

        <div className="flex justify-between text-xs mt-1 text-gray-400 font-semibold">
          <span>0%</span>
          <span>
            {stats.progress >= 0
              ? `Target ${targetPercent}%`
              : `Drawdown ${targetPercent}%`}
          </span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
}

// === Stat Card ===
function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: JSX.Element;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div
      className="flex items-center gap-3 p-3 rounded-lg border shadow-sm backdrop-blur-md transition-all hover:scale-[1.03] hover:shadow-lg"
      style={{
        borderColor: "rgba(56,189,248,0.25)",
        background: "rgba(56,189,248,0.05)",
      }}
    >
      <div className="p-2 rounded-md bg-black/20 text-sky-400">{icon}</div>
      <div>
        <p className="text-sm opacity-80">{label}</p>
        <p className="font-bold text-lg" style={{ color }}>
          {value}
        </p>
      </div>
    </div>
  );
}
