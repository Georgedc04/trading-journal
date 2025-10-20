"use client";

import { useTheme } from "next-themes";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Trophy,
  Rocket,
  Flame,
  ThumbsUp,
} from "lucide-react";

type EquityChartProps = {
  data: { date: string; balance: number }[];
  accountSize: number;
};

export default function EquityChart({ data, accountSize }: EquityChartProps) {
  const { theme } = useTheme();

  if (!data || data.length === 0) {
    return (
      <div
        className="p-4 rounded-xl text-center border backdrop-blur-md shadow-md"
        style={{
          background:
            theme === "light"
              ? "rgba(255,255,255,0.7)"
              : "rgba(15,23,42,0.4)",
          borderColor: theme === "light" ? "#E2E8F0" : "#334155",
          color: theme === "light" ? "#475569" : "#94A3B8",
        }}
      >
        No trade data yet — start trading to see your equity curve{" "}
        <TrendingUp className="inline ml-1 text-emerald-500" size={18} />
      </div>
    );
  }

  // ✅ Normalize data for visual consistency
  const baseAmount = accountSize / 10 || 1;
  const normalizedData = data.map((d) => ({
    ...d,
    displayBalance: (d.balance - accountSize) / baseAmount,
  }));

  const last = data[data.length - 1];
  const lastBalance = last?.balance ?? accountSize;
  const diff = lastBalance - accountSize;
  const diffPercent = accountSize
    ? ((diff / accountSize) * 100).toFixed(2)
    : "0.00";
  const isDrawdown = lastBalance < accountSize;

  // 🎨 Theme-based color system
  const color = theme === "light"
    ? {
        bg: "rgba(255,255,255,0.65)",
        line: isDrawdown ? "#EF4444" : "#10B981",
        gradientStart: isDrawdown ? "#FCA5A5" : "#6EE7B7",
        gradientEnd: isDrawdown ? "#FEE2E2" : "#D1FAE5",
        text: "#1E293B",
        grid: "#E5E7EB",
        tooltipBg: "rgba(255,255,255,0.9)",
        tooltipText: "#111827",
      }
    : {
        bg: "rgba(17,25,40,0.55)",
        line: isDrawdown ? "#F87171" : "#34D399",
        gradientStart: isDrawdown ? "#7F1D1D" : "#064E3B",
        gradientEnd: isDrawdown ? "#991B1B" : "#065F46",
        text: "#E2E8F0",
        grid: "#1E293B",
        tooltipBg: "rgba(30,41,59,0.9)",
        tooltipText: "#F8FAFC",
      };

  return (
    <div
      className="p-5 sm:p-6 rounded-2xl border shadow-xl backdrop-blur-md transition-all duration-300"
      style={{
        background: color.bg,
        borderColor: theme === "light" ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.1)",
      }}
    >
      {/* === Header === */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
        <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2 text-amber-500">
          <Trophy size={20} /> Equity Curve
        </h2>

        <div
          className={`flex items-center gap-2 font-medium ${
            isDrawdown ? "text-rose-400" : "text-emerald-400"
          }`}
        >
          {isDrawdown ? (
            <>
              <TrendingDown size={16} /> Drawdown: {diffPercent}%
            </>
          ) : (
            <>
              <TrendingUp size={16} /> Profit: +{diffPercent}%
            </>
          )}
        </div>
      </div>

      {/* === Chart === */}
      <div className="h-64 sm:h-72 md:h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={normalizedData} margin={{ top: 10, right: 25, left: 0, bottom: 10 }}>
            {/* Gradient Fill */}
            <defs>
              <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={color.gradientStart}
                  stopOpacity={0.35}
                />
                <stop
                  offset="100%"
                  stopColor={color.gradientEnd}
                  stopOpacity={0.05}
                />
              </linearGradient>
            </defs>

            {/* Clean Grid Lines */}
            <XAxis
              dataKey="date"
              stroke={color.text}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke={color.text}
              tick={{ fontSize: 12 }}
              tickFormatter={(v: number) => `$${(v * baseAmount + accountSize).toFixed(0)}`}
              axisLine={false}
              tickLine={false}
            />
            <ReferenceLine
              y={0}
              stroke={color.grid}
              strokeDasharray="3 3"
              label={{
                value: "Start",
                fill: color.text,
                fontSize: 11,
                position: "insideRight",
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: color.tooltipBg,
                border: `1px solid ${color.grid}`,
                borderRadius: "10px",
                color: color.tooltipText,
                boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
              }}
              labelStyle={{
                color: color.text,
                fontWeight: 600,
              }}
              formatter={(value: number) => [
                `$${(value * baseAmount + accountSize).toFixed(2)}`,
                "Balance",
              ]}
            />

            {/* Area Line (soft glow) */}
            <Area
              type="monotone"
              dataKey="displayBalance"
              stroke={color.line}
              fill="url(#equityGradient)"
              strokeWidth={3}
              dot={false}
              isAnimationActive={true}
              animationDuration={900}
              animationEasing="ease-in-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* === Motivational Footer === */}
      <div className="mt-4 flex justify-center items-center gap-2 text-sm sm:text-base font-medium">
        {isDrawdown ? (
          <>
            <Flame size={18} className="text-rose-400" />
            <span className="text-rose-400">
              Stay consistent — every setback refines your edge.
            </span>
          </>
        ) : (
          <>
            <Rocket size={18} className="text-emerald-400" />
            <span className="text-emerald-400">
              Excellent momentum — keep your risk steady 🚀
            </span>
          </>
        )}
      </div>
    </div>
  );
}
