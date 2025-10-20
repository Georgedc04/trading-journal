"use client";

import { JSX, useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
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
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (trades?.length >= 0) {
      setRefreshing(true);
      const timer = setTimeout(() => setRefreshing(false), 700);
      return () => clearTimeout(timer);
    }
  }, [JSON.stringify(trades)]);

  // 🧮 Stats Calculation
  const stats = useMemo(() => {
    if (!trades || trades.length === 0)
      return {
        total: 0,
        wins: 0,
        losses: 0,
        winRate: 0,
        avgRR: 0,
        best: 0,
        worst: 0,
        progress: 0,
      };

    const total = trades.length;
    const profits = trades.filter((t) => t.profitLoss > 0 || t.result > 0);
    const losses = trades.filter((t) => t.profitLoss < 0 || t.result < 0);
    const winRate = ((profits.length / total) * 100).toFixed(1);

    // 🧠 Avg R:R — skips invalid trades
    const rrList = trades
      .map((t) => {
        const entry = Number(t.entry);
        const sl = Number(t.stopLoss);
        const tp = Number(t.takeProfit);
        if (!entry || !sl || !tp || entry === sl) return null;

        const risk = Math.abs(sl - entry);
        const reward = Math.abs(tp - entry);
        return risk > 0 ? reward / risk : null;
      })
      .filter((v): v is number => !!v && isFinite(v));

    const avgRR =
      rrList.length > 0
        ? (rrList.reduce((a, b) => a + b, 0) / rrList.length).toFixed(2)
        : "—";

    const profitList = trades.map((t) => t.profitLoss ?? t.result ?? 0);
    const best = Math.max(...profitList);
    const worst = Math.min(...profitList);

    const acc = Number(accountSize) || 0;
    const target = Number(targetPercent) || 0;
    const totalGain = profitList.reduce((a, b) => a + b, 0);
    const progress = acc ? (totalGain / (acc * (target / 100))) * 100 : 0;

    return {
      total,
      wins: profits.length,
      losses: losses.length,
      winRate,
      avgRR,
      best,
      worst,
      progress,
    };
  }, [trades, accountSize, targetPercent]);

  const palette = isDark
    ? {
        bg: "#0B0F14",
        border: "rgba(56,189,248,0.15)",
        text: "#E2E8F0",
        accent: "#38BDF8",
        shadow: "rgba(56,189,248,0.25)",
        profit: "#22C55E",
        loss: "#EF4444",
      }
    : {
        bg: "#FFFFFF",
        border: "rgba(37,99,235,0.15)",
        text: "#1E293B",
        accent: "#2563EB",
        shadow: "rgba(37,99,235,0.25)",
        profit: "#16A34A",
        loss: "#DC2626",
      };

  const getBarColor = (value: number) =>
    value >= 0
      ? "linear-gradient(90deg, #38BDF8, #22C55E, #4ADE80)"
      : "linear-gradient(90deg, #F87171, #EF4444, #DC2626)";

  return (
    <div
      className={`mt-6 p-6 rounded-2xl border w-full max-w-5xl mx-auto transition-all duration-500 ${
        refreshing ? "opacity-70 scale-[0.99]" : "opacity-100 scale-100"
      }`}
      style={{
        background: isDark
          ? "linear-gradient(135deg, #0B0F14, #111827)"
          : "linear-gradient(135deg, #FFFFFF, #E0F2FE)",
        borderColor: palette.border,
        boxShadow: `0 8px 25px ${palette.shadow}`,
        color: palette.text,
      }}
    >
      {/* === Header === */}
      <div className="flex items-center justify-between mb-5">
        <h2
          className="text-xl font-bold flex items-center gap-2"
          style={{ color: palette.accent }}
        >
          <BarChart2 size={20} /> Performance Overview
        </h2>
        {refreshing && <Loader2 className="animate-spin text-sky-400 w-5 h-5" />}
      </div>

     {/* === Stats === */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard icon={<Activity size={18} />} label="Total Trades" value={stats.total} color={palette.text} />
          <StatCard icon={<TrendingUp size={18} />} label="Wins" value={stats.wins} color={palette.profit} />
          <StatCard icon={<TrendingDown size={18} />} label="Losses" value={stats.losses} color={palette.loss} />
          <StatCard icon={<Trophy size={18} />} label="Win Rate" value={`${stats.winRate}%`} color={palette.profit} />
          
        {/* 💎 Dynamic Avg R:R */}
        <div className="relative overflow-hidden rounded-lg">
          <StatCard
            icon={<BarChart2 size={18} />}
            label="Avg R:R"
            value={stats.avgRR}
            color={palette.accent}
          />

          {/* === Background fill bar === */}
          <div
            className="absolute bottom-0 left-0 h-[3px] transition-all duration-700 ease-in-out"
            style={{
              width: `${Math.min(Number(stats.avgRR) * 33, 100)}%`, // e.g. 3.0 RR ≈ full
              background:
                Number(stats.avgRR) <= 0
                  ? "gray"
                  : Number(stats.avgRR) >= 3
                  ? "#38BDF8"
                  : `linear-gradient(90deg, gray, #38BDF8 ${Number(
                      stats.avgRR
                    ) * 33}%)`,
              boxShadow:
                Number(stats.avgRR) >= 3
                  ? "0 0 12px #38BDF8"
                  : "0 0 4px rgba(156,163,175,0.5)",
            }}
          />
        </div>


  <StatCard
    icon={<Target size={18} />}
    label="Profit Target"
    value={`${Math.abs(stats.progress).toFixed(1)}%`}
    color={palette.accent}
  />
</div>


      {/* === Best / Worst === */}
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
            {stats.worst < 0 ? `${stats.worst.toFixed(2)}` : "—"}
          </span>
        </div>
      </div>

      {/* === Progress Bar === */}
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
            background: isDark ? "#0F172A" : "#E2E8F0",
            borderColor: palette.border,
          }}
        >
          <div
            className="h-full rounded-full transition-[width,background] duration-700 ease-out shadow-md"
            style={{
              width: `${Math.min(Math.abs(stats.progress), 100)}%`,
              background: getBarColor(stats.progress),
              boxShadow: `0 0 10px ${stats.progress >= 0 ? palette.profit : palette.loss}`,
            }}
          />
        </div>

        <div className="flex justify-between text-xs mt-1 text-gray-500 font-semibold">
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

// 🧱 StatCard
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
        borderColor: "rgba(255,255,255,0.1)",
        background: "rgba(56,189,248,0.05)",
      }}
    >
      <div className="p-2 rounded-md bg-black/10 text-sky-400">{icon}</div>
      <div>
        <p className="text-sm opacity-80">{label}</p>
        <p className="font-bold text-lg" style={{ color }}>
          {value}
        </p>
      </div>
    </div>
  );
}
