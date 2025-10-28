"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";
import useTrades from "../hook/useTrades";

export default function BuySellAreaChartSection() {
  const { trades, loading } = useTrades();

  // 🎨 Fixed dark theme palette
  const palette = {
    bg: "linear-gradient(135deg, #0B0F14, #111827)",
    border: "rgba(56,189,248,0.25)",
    text: "#E2E8F0",
    buy: "#22C55E",
    sell: "#EF4444",
    grid: "rgba(255,255,255,0.08)",
    shadow: "0 8px 25px rgba(56,189,248,0.15)",
  };

  // 🧮 Compute chart data
  const chartData = useMemo(() => {
    if (!Array.isArray(trades) || trades.length === 0) return [];

    const grouped: Record<string, { date: string; buys: number; sells: number }> = {};
    trades.forEach((trade) => {
      const date = new Date(trade.date).toLocaleDateString();
      if (!grouped[date]) grouped[date] = { date, buys: 0, sells: 0 };

      if (trade.direction === "Buy") grouped[date].buys += 1;
      if (trade.direction === "Sell") grouped[date].sells += 1;
    });

    return Object.values(grouped).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [trades]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="w-full max-w-5xl mx-auto rounded-2xl p-6 border shadow-md mt-10"
      style={{
        background: palette.bg,
        borderColor: palette.border,
        boxShadow: palette.shadow,
      }}
    >
      {/* === Header === */}
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp size={22} color={palette.buy} />
        <TrendingDown size={22} color={palette.sell} />
        <h2 className="text-xl sm:text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-red-500">
          Buy vs Sell Overview
        </h2>
      </div>

      {/* === Chart Section === */}
      {loading ? (
        <div className="h-[350px] w-full rounded-xl animate-pulse bg-gradient-to-r from-slate-800/20 to-slate-700/20" />
      ) : chartData.length === 0 ? (
        <p className="text-center text-sm text-slate-400">No trade data available.</p>
      ) : (
        <div className="w-full h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="buyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={palette.buy} stopOpacity={0.7} />
                  <stop offset="100%" stopColor={palette.buy} stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="sellGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={palette.sell} stopOpacity={0.7} />
                  <stop offset="100%" stopColor={palette.sell} stopOpacity={0.05} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke={palette.grid} />
              <XAxis
                dataKey="date"
                tick={{ fill: palette.text, fontSize: 12 }}
                tickMargin={8}
                axisLine={{ stroke: "rgba(56,189,248,0.2)" }}
              />
              <YAxis
                tick={{ fill: palette.text, fontSize: 12 }}
                axisLine={{ stroke: "rgba(56,189,248,0.2)" }}
              />
              <Tooltip
                contentStyle={{
                  background: "rgba(15,23,42,0.95)",
                  border: `1px solid ${palette.border}`,
                  borderRadius: "10px",
                  color: palette.text,
                  boxShadow: "0 4px 20px rgba(56,189,248,0.15)",
                }}
              />
              <Legend
                verticalAlign="top"
                height={30}
                wrapperStyle={{ color: "#CBD5E1", fontSize: 13 }}
              />

              {/* === Buy Line === */}
              <Area
                type="monotone"
                dataKey="buys"
                name="Buys"
                stroke={palette.buy}
                fill="url(#buyGradient)"
                strokeWidth={2}
                activeDot={{ r: 5 }}
              />

              {/* === Sell Line === */}
              <Area
                type="monotone"
                dataKey="sells"
                name="Sells"
                stroke={palette.sell}
                fill="url(#sellGradient)"
                strokeWidth={2}
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.section>
  );
}
