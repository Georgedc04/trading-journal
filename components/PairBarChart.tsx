"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { BarChart2 } from "lucide-react";

export default function PairBarChart({ trades }: { trades: any[] }) {
  const data = useMemo(() => {
    if (!trades || trades.length === 0) return [];

    // ✅ Group total profit per pair
    const pairProfits: Record<string, number> = {};
    trades.forEach((t) => {
      const pair = t.pair || "Unknown";
      const profit = Number(t.result ?? t.profitLoss ?? 0);
      pairProfits[pair] = (pairProfits[pair] || 0) + profit;
    });

    // ✅ Convert to sorted array (best → worst)
    return Object.entries(pairProfits)
      .map(([pair, profit]) => ({ pair, profit }))
      .sort((a, b) => b.profit - a.profit);
  }, [trades]);

  if (data.length === 0)
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mt-8 p-6 rounded-2xl border shadow-md text-center text-slate-400 bg-[#0B0F14] border-sky-400/10"
      >
        <p>No trades yet — add some to visualize your pair performance 📊</p>
      </motion.div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="mt-8 p-6 rounded-2xl border shadow-lg w-full max-w-5xl mx-auto bg-[#0B0F14] border-sky-400/10"
      style={{
        boxShadow: "0 8px 25px rgba(56,189,248,0.15)",
      }}
    >
      {/* === Header === */}
      <div className="flex items-center gap-2 mb-6">
        <BarChart2 className="text-sky-400" size={22} />
        <h2 className="text-lg sm:text-xl font-semibold text-sky-400">
          Pair Profit Overview
        </h2>
      </div>

      {/* === Chart === */}
      <div className="w-full h-[400px] text-gray-100">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
            <XAxis
              dataKey="pair"
              tick={{ fill: "#94A3B8", fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: "rgba(56,189,248,0.15)" }}
            />
            <YAxis
              tick={{ fill: "#94A3B8", fontSize: 12 }}
              axisLine={{ stroke: "rgba(56,189,248,0.15)" }}
            />
            <Tooltip
              cursor={{ fill: "rgba(56,189,248,0.1)" }}
              contentStyle={{
                backgroundColor: "rgba(15,23,42,0.95)",
                border: "1px solid rgba(56,189,248,0.3)",
                borderRadius: "10px",
                color: "#E2E8F0",
                boxShadow: "0 4px 20px rgba(56,189,248,0.15)",
              }}
              formatter={(value: number) => [`$${value.toFixed(2)}`, "Profit"]}
            />

            <Bar
              dataKey="profit"
              radius={[6, 6, 0, 0]}
              barSize={45}
              isAnimationActive={true}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.profit >= 0
                      ? "url(#profitGradient)"
                      : "url(#lossGradient)"
                  }
                  style={{ transition: "fill 0.3s ease" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.filter = "brightness(1.15)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.filter = "brightness(1)")
                  }
                />
              ))}
            </Bar>

            {/* ✅ Gradients for profit/loss */}
            <defs>
              <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22C55E" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#0F766E" stopOpacity={0.5} />
              </linearGradient>
              <linearGradient id="lossGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#EF4444" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#7F1D1D" stopOpacity={0.5} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
