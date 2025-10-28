"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendingUp } from "lucide-react";

type Props = {
  trades: any[];
  accountSize: number;
};

export default function TradingProgressChart({ trades, accountSize }: Props) {
  const data = useMemo(() => {
    if (!trades || trades.length === 0) return [];

    let balance = accountSize;
    return trades.map((t, i) => {
      const result = Number(t.result ?? t.profitLoss ?? 0);
      balance += result;
      return {
        id: i + 1,
        pair: t.pair || "Unknown",
        result,
        balance: Number(balance.toFixed(2)),
        date: new Date(t.date).toLocaleDateString(),
      };
    });
  }, [trades, accountSize]);

  if (data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 rounded-2xl border text-center text-gray-400 mt-8 bg-[#0B0F14] border-slate-700 shadow-md"
      >
        📉 No trades yet — your journey starts with the first entry.
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="mt-8 p-6 rounded-2xl border shadow-lg w-full max-w-5xl mx-auto bg-[#0B0F14] border-slate-700"
      style={{
        boxShadow: "0 8px 25px rgba(0,0,0,0.6)",
      }}
    >
      {/* === Header === */}
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="text-sky-400" size={22} />
        <h2 className="text-lg sm:text-xl font-semibold text-sky-400">
          Trading Progress Chart
        </h2>
      </div>

      {/* === Chart === */}
      <div className="w-full h-[380px] text-gray-100">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22C55E" stopOpacity={0.9} />
                <stop offset="95%" stopColor="#22C55E" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="colorLoss" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
            <XAxis
              dataKey="id"
              tick={{ fontSize: 12, fill: "#94A3B8" }}
              label={{
                value: "Trade #",
                position: "insideBottom",
                offset: -5,
                fill: "#CBD5E1",
              }}
              stroke="#334155"
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#94A3B8" }}
              label={{
                value: "Balance",
                angle: -90,
                position: "insideLeft",
                fill: "#CBD5E1",
              }}
              stroke="#334155"
            />
            <Tooltip
              contentStyle={{
                background: "rgba(15,23,42,0.95)",
                border: "1px solid rgba(56,189,248,0.3)",
                borderRadius: "10px",
                color: "#fff",
              }}
              formatter={(value: any, name: any) => {
                if (name === "balance") return [`$${value}`, "Balance"];
                if (name === "result") return [`$${value}`, "Result"];
                return [value];
              }}
              labelFormatter={(label) => `Trade #${label}`}
            />
            <Legend
              verticalAlign="top"
              height={36}
              wrapperStyle={{ color: "#E2E8F0" }}
            />

            {/* 📈 Balance Curve */}
            <Line
              type="monotone"
              dataKey="balance"
              stroke="url(#colorBalance)"
              strokeWidth={3}
              dot={false}
              name="Balance Curve"
            />

            {/* 🔵 Individual Trade Results */}
            <Line
              type="monotone"
              dataKey="result"
              stroke="url(#colorLoss)"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
              name="Trade Result"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
