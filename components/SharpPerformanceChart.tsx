"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";

type Props = {
  trades: any[];
  accountSize?: number;
};

export default function SharpPerformanceChart({ trades, accountSize = 10000 }: Props) {
  const data = useMemo(() => {
    if (!trades || trades.length === 0) return [];

    let cumulative = accountSize;
    const points = trades
      .map((t) => {
        const result = Number(t.result ?? t.profitLoss ?? 0);
        cumulative += result;
        return {
          date: new Date(t.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          equity: Number(cumulative.toFixed(2)),
        };
      })
      .slice(-50); // keep recent 50 trades for clarity

    return points;
  }, [trades, accountSize]);

  if (data.length === 0)
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-8 p-6 rounded-2xl border text-center text-gray-400 backdrop-blur-md"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(56,189,248,0.05))",
          borderColor: "rgba(56,189,248,0.2)",
        }}
      >
        ⚠️ No trades yet — your sharp performance will appear here once you start trading.
      </motion.div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="mt-8 p-6 rounded-2xl border shadow-lg backdrop-blur-md w-full max-w-5xl mx-auto"
      style={{
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(56,189,248,0.05))",
        borderColor: "rgba(56,189,248,0.2)",
        boxShadow: "0 6px 30px rgba(56,189,248,0.15)",
      }}
    >
      {/* === Header === */}
      <div className="flex items-center gap-2 mb-6">
        <Activity className="text-sky-400" size={22} />
        <h2 className="text-lg sm:text-xl font-semibold text-sky-400">
          Sharp Performance Chart
        </h2>
      </div>

      {/* === Chart === */}
      <div className="w-full h-[380px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 20, left: 10, bottom: 10 }}
          >
            <defs>
              <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22C55E" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#15803D" stopOpacity={0.2} />
              </linearGradient>
              <linearGradient id="lossGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#EF4444" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#7F1D1D" stopOpacity={0.2} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="rgba(56,189,248,0.1)" />
            <XAxis
              dataKey="date"
              tick={{ fill: "#94A3B8", fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: "rgba(56,189,248,0.2)" }}
            />
            <YAxis
              tick={{ fill: "#94A3B8", fontSize: 12 }}
              axisLine={{ stroke: "rgba(56,189,248,0.2)" }}
              domain={["auto", "auto"]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(17,25,40,0.9)",
                border: "1px solid rgba(56,189,248,0.3)",
                borderRadius: "10px",
                color: "#E2E8F0",
              }}
              labelStyle={{ color: "#38BDF8", fontWeight: 600 }}
              formatter={(v: any) => [`$${v.toFixed(2)}`, "Equity"]}
            />

            <Line
              type="monotone"
              dataKey="equity"
              stroke={`url(#${data[data.length - 1].equity >= accountSize ? "profitGradient" : "lossGradient"})`}
              strokeWidth={3}
              dot={{ r: 2, fill: "#38BDF8" }}
              activeDot={{
                r: 6,
                stroke: "#38BDF8",
                strokeWidth: 2,
                fill: "#fff",
              }}
              name="Equity"
              animationDuration={800}
              animationEasing="ease-in-out"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
