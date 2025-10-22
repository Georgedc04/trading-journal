"use client"

import { useTheme } from "next-themes"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from "recharts"
import {
  Rocket,
  TrendingUp,
  TrendingDown,
  Flame,
  Trophy,
  ThumbsUp,
} from "lucide-react"

type EquityChartProps = {
  data: { date: string; balance: number }[]
  accountSize: number
}

export default function EquityChart({ data, accountSize }: EquityChartProps) {
  const { theme } = useTheme()

  if (!data || data.length === 0) {
    return (
      <div
        className="p-4 rounded-lg text-center border shadow-md"
        style={{
          background: "var(--color-card)",
          borderColor: "var(--color-border)",
          color: "var(--color-text-light)",
        }}
      >
        No trade data yet — start trading to see your equity curve
        <TrendingUp className="inline ml-1 text-emerald-500" size={18} />
      </div>
    )
  }

  // ✅ Normalize data for visibility
  const baseAmount = accountSize / 10 || 1
  const normalizedData = data.map((d) => ({
    ...d,
    displayBalance: (d.balance - accountSize) / baseAmount,
  }))

  const last = data[data.length - 1]
  const lastBalance = last?.balance ?? accountSize
  const diff = lastBalance - accountSize
  const diffPercent = accountSize ? ((diff / accountSize) * 100).toFixed(2) : "0.00"
  const isDrawdown = lastBalance < accountSize

  // ✅ Theme-aware colors
  const color = theme === "light"
    ? {
        bg: "rgba(255,255,255,0.65)",
        grid: "#E5E7EB",
        line: isDrawdown ? "#E74C3C" : "#8B593E",
        dot: isDrawdown ? "#C0392B" : "#D7A86E",
        tooltipBg: "rgba(255,255,255,0.9)",
        tooltipText: "#111827",
      }
    : {
        bg: "linear-gradient(135deg, #0A0F1C, #111827)",
        grid: "#1e293b",
        line: isDrawdown ? "#f87171" : "#34d399",
        dot: isDrawdown ? "#fb7185" : "#86efac",
        tooltipBg: "#1e293b",
        tooltipText: "#e2e8f0",
      }

  const statusColor = isDrawdown
    ? theme === "light"
      ? "text-[#E74C3C]"
      : "text-rose-400"
    : theme === "light" 
    ? "text-[#2ECC71]"
    : "text-emerald-400"

  // ✅ React icons for performance stickers
  const StickerIcon = () =>
    isDrawdown ? (
      <Flame size={20} className="text-rose-500 animate-pulse" />
    ) : (
      <Rocket size={20} className="text-emerald-400 animate-bounce" />
    )

  const StatusBadge = () =>
    isDrawdown ? (
      <div className="flex items-center gap-1 text-xs sm:text-sm font-medium text-rose-500">
        <TrendingDown size={14} />
        <span>Drawdown: {diffPercent}%</span>
      </div>
    ) : (
      <div className="flex items-center gap-1 text-xs sm:text-sm font-medium text-emerald-500">
        <TrendingUp size={14} />
        <span>Profit: +{diffPercent}%</span>
      </div>
    )

  return (
   <div
      className="p-5 sm:p-6 rounded-2xl border shadow-xl backdrop-blur-md transition-all duration-300"
      style={{
        background: color.bg,
        borderColor: theme === "light" ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.1)",
      }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mb-3">
        <h2
          className="text-lg sm:text-xl font-semibold flex items-center gap-2"
          style={{ color: "var(--color-foreground)" }}
        >
          <Trophy size={20} className="text-amber-500" />
          Equity Curve
        </h2>

        <div className="flex items-center gap-2">
          <StickerIcon />
          <StatusBadge />
        </div>
      </div>

      {/* Chart */}
      <div className="h-60 sm:h-72 md:h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={normalizedData}
            margin={{ top: 10, right: 25, left: 0, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={color.grid} />

            <XAxis
              dataKey="date"
              stroke={theme === "light" ? "#4A3428" : "#9ca3af"}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={{
                stroke: theme === "light" ? "#D7A86E" : "#475569",
              }}
            />

            <YAxis
              stroke={theme === "light" ? "#4A3428" : "#9ca3af"}
              tick={{ fontSize: 12 }}
              tickFormatter={(v: number) => `${(v * baseAmount).toFixed(0)}`}
              axisLine={{
                stroke: theme === "light" ? "#D7A86E" : "#475569",
              }}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: color.tooltipBg,
                border: `1px solid ${color.grid}`,
                borderRadius: "8px",
                color: color.tooltipText,
              }}
              labelStyle={{
                color: theme === "light" ? "#8B593E" : "#94a3b8",
                fontWeight: 600,
              }}
              formatter={(value: number) => [
                `$${(value * baseAmount + accountSize).toFixed(2)}`,
                "Balance",
              ]}
            />

            <ReferenceLine
              y={0}
              stroke={theme === "light" ? "#D7A86E" : "#475569"}
              strokeDasharray="4 4"
              label={{
                value: "Start",
                fill: theme === "light" ? "#8B593E" : "#94a3b8",
                position: "insideRight",
                fontSize: 11,
              }}
            />

            {/* ✅ Sharper line with no curve smoothing */}
            <Line
              type="linear"
              dataKey="displayBalance"
              stroke={color.line}
              strokeWidth={3}
              dot={{
                r: 4,
                fill: theme === "light" ? "#FFF8F3" : "#1e293b",
                stroke: color.dot,
                strokeWidth: 2,
              }}
              activeDot={{
                r: 6,
                stroke: color.dot,
                strokeWidth: 2,
                fill: theme === "light" ? "#FFF8F3" : "#0f172a",
              }}
              isAnimationActive={true}
              animationDuration={700}
              animationEasing="ease-in-out"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Motivational footer badge */}
      <div className="mt-4 flex justify-center items-center gap-2 text-sm sm:text-base font-semibold">
        {isDrawdown ? (
          <>
            <Flame size={18} className="text-rose-500" />
            <span className="text-rose-500">Stay disciplined — every loss is data 🔥</span>
          </>
        ) : (
          <>
            <ThumbsUp size={18} className="text-emerald-500" />
            <span className="text-emerald-500">Excellent progress — consistency pays 💎</span>
          </>
        )}
      </div>
    </div>
  )
}
