"use client";

import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";
import { DollarSign, CalendarDays } from "lucide-react";

type Props = {
  trades: any[];
};

export default function TradingRevenueChart({ trades }: Props) {
  const [filter, setFilter] = useState<"day" | "week" | "month">("day");

  // ✅ Prepare data dynamically
  const data = useMemo(() => {
    if (!trades || trades.length === 0) return [];

    const grouped: Record<string, number> = {};

    trades.forEach((t) => {
      const date = new Date(t.date);
      const profit = Number(t.result ?? t.profitLoss ?? 0);

      let key = date.toLocaleDateString(); // Default: daily
      if (filter === "week") key = `Week ${getWeekNumber(date)}`;
      if (filter === "month")
        key = `${date.toLocaleString("default", { month: "short" })} ${date.getFullYear()}`;

      grouped[key] = (grouped[key] || 0) + profit;
    });

    // Convert to array
    return Object.entries(grouped).map(([label, value]) => ({
      label,
      revenue: Number(value.toFixed(2)),
    }));
  }, [trades, filter]);

  // ✅ Detect if revenue is overall positive or negative
  const totalRevenue = useMemo(
    () => data.reduce((sum, d) => sum + d.revenue, 0),
    [data]
  );

  const isLoss = totalRevenue < 0;

  if (data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 rounded-2xl border text-center text-gray-400 mt-8 bg-[#0B0F14] border-slate-700 shadow-md"
      >
        📊 No trading data yet — start trading to see your revenue growth!
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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <DollarSign
            className={isLoss ? "text-rose-500" : "text-emerald-400"}
            size={22}
          />
          <h2
            className={`text-lg sm:text-xl font-semibold ${
              isLoss ? "text-rose-500" : "text-emerald-400"
            }`}
          >
            Trading Revenue Chart
          </h2>
        </div>

        {/* === Filter Buttons === */}
        <div className="flex gap-2 items-center text-sm font-medium">
          <CalendarDays size={16} className="opacity-60 text-gray-300" />
          {["day", "week", "month"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-3 py-1.5 rounded-md transition-all ${
                filter === f
                  ? isLoss
                    ? "bg-rose-500 text-white shadow-md"
                    : "bg-emerald-500 text-white shadow-md"
                  : "bg-slate-800 text-gray-400 hover:text-emerald-400"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* === Chart === */}
      <div className="w-full h-[380px] text-gray-100">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
            <defs>
              <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22C55E" stopOpacity={0.9} />
                <stop offset="95%" stopColor="#22C55E" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="lossGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.9} />
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 12, fill: "#94A3B8" }}
              stroke="#334155"
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#94A3B8" }}
              stroke="#334155"
            />
            <Tooltip
              contentStyle={{
                background: "rgba(15,23,42,0.95)",
                border: `1px solid ${isLoss ? "rgba(239,68,68,0.5)" : "rgba(34,197,94,0.5)"}`,
                borderRadius: "10px",
                color: "#fff",
              }}
              formatter={(value: any) => [`$${value}`, "Revenue"]}
            />

            <Line
              type="monotone"
              dataKey="revenue"
              stroke={`url(#${isLoss ? "lossGradient" : "profitGradient"})`}
              strokeWidth={3}
              dot={{
                r: 3,
                fill: isLoss ? "#EF4444" : "#22C55E",
              }}
              activeDot={{
                r: 6,
                stroke: isLoss ? "#EF4444" : "#22C55E",
                strokeWidth: 2,
              }}
              name="Revenue"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

/* Helper — Week Number Calculation */
function getWeekNumber(date: Date) {
  const onejan = new Date(date.getFullYear(), 0, 1);
  const millisecsInDay = 86400000;
  return Math.ceil(
    ((date.getTime() - onejan.getTime()) / millisecsInDay + onejan.getDay() + 1) / 7
  );
}
