"use client";

import { useMemo } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { ChartColumn } from "lucide-react";
import useTrades from "../hook/useTrades"; // ✅ shared cached hook

export default function Discipline3DChartSection() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { trades, loading } = useTrades();

  // 🎨 Neon palette (more “teen” and 3D)
  const palette = useMemo(
    () =>
      isDark
        ? {
            bg: "radial-gradient(circle at top left, #0F172A 0%, #020617 100%)",
            border: "rgba(56,189,248,0.3)",
            grid: "rgba(255,255,255,0.1)",
            text: "#E2E8F0",
            good: "#00FF88",
            caution: "#FACC15",
            bad: "#FF4D4D",
            shadow: "0 0 20px rgba(56,189,248,0.4)",
            glow: "rgba(0,255,200,0.15)",
          }
        : {
            bg: "radial-gradient(circle at top left, #F0F9FF 0%, #DBEAFE 100%)",
            border: "rgba(37,99,235,0.25)",
            grid: "rgba(0,0,0,0.08)",
            text: "#1E293B",
            good: "#16A34A",
            caution: "#EAB308",
            bad: "#DC2626",
            shadow: "0 0 15px rgba(37,99,235,0.2)",
            glow: "rgba(37,99,235,0.15)",
          },
    [isDark]
  );

  // 🧮 Prepare daily trade counts
  const chartData = useMemo(() => {
    if (!Array.isArray(trades) || trades.length === 0) return [];
    const grouped: Record<string, { date: string; count: number }> = {};
    trades.forEach((trade) => {
      const date = new Date(trade.date).toLocaleDateString();
      if (!grouped[date]) grouped[date] = { date, count: 0 };
      grouped[date].count += 1;
    });
    return Object.values(grouped).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [trades]);

  // 🎯 3D gradient color logic
  const getColor = (count: number) => {
    if (count <= 2)
      return "url(#barGood)";
    if (count === 3)
      return "url(#barCaution)";
    return "url(#barBad)";
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="relative w-full max-w-5xl mx-auto rounded-2xl p-6 border backdrop-blur-md mt-10 overflow-hidden"
      style={{
        background: palette.bg,
        borderColor: palette.border,
        boxShadow: palette.shadow,
      }}
    >
      {/* 💫 Animated Glow */}
      <motion.div
        className="absolute rounded-full blur-[90px]"
        style={{
          background: palette.glow,
          width: "250px",
          height: "250px",
          top: "20%",
          left: "70%",
          transform: "translate(-50%, -50%)",
        }}
        animate={{
          opacity: [0.1, 0.25, 0.1],
          scale: [1, 1.3, 1],
        }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
      />

      {/* === Header === */}
      <div className="flex items-center gap-2 mb-4">
        <ChartColumn size={22} color={palette.good} />
        <h2 className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent drop-shadow-md">
          Daily Trading Discipline
        </h2>
      </div>

      <p className="text-sm mb-4 opacity-75">
        Stay cool. Stay smart. Keep it under <b>3 trades/day</b> 💎
      </p>

      {/* ⚡ Skeleton shimmer */}
      {loading ? (
        <div className="h-[350px] w-full rounded-xl animate-pulse bg-gradient-to-r from-slate-200/10 to-slate-400/20" />
      ) : chartData.length === 0 ? (
        <p className="text-center text-sm opacity-70">No trade data available.</p>
      ) : (
        <div className="w-full h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barSize={30}>
              {/* 💡 3D Gradient Layers */}
              <defs>
                <linearGradient id="barGood" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00FFAA" stopOpacity={1} />
                  <stop offset="100%" stopColor="#008855" stopOpacity={0.3} />
                </linearGradient>
                <linearGradient id="barCaution" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FFD600" stopOpacity={1} />
                  <stop offset="100%" stopColor="#B45309" stopOpacity={0.5} />
                </linearGradient>
                <linearGradient id="barBad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF4D4D" stopOpacity={1} />
                  <stop offset="100%" stopColor="#7F1D1D" stopOpacity={0.3} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke={palette.grid} />
              <XAxis
                dataKey="date"
                stroke={palette.text}
                tick={{ fill: palette.text, fontSize: 12 }}
                tickMargin={8}
              />
              <YAxis
                stroke={palette.text}
                tick={{ fill: palette.text, fontSize: 12 }}
                domain={[0, 8]}
              />
              <Tooltip
                contentStyle={{
                  background: isDark ? "#1E293B" : "rgba(37,99,235,0.2)",
                  border: `1px solid ${palette.border}`,
                  borderRadius: "10px",
                  color: palette.text,
                  boxShadow: "0 0 15px rgba(0,255,200,0.2)",
                }}
                labelStyle={{ fontWeight: 600 }}
              />

              {/* 🧊 3D Bars with Hover Lift */}
              <Bar
                dataKey="count"
                name="Trades Taken"
                radius={[8, 8, 4, 4]}
                style={{ filter: "drop-shadow(0 5px 10px rgba(0,0,0,0.5))" }}
              >
                {chartData.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={getColor(entry.count)}
                    style={{
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      (e.target as SVGElement).style.transform = "scale(1.1)";
                      (e.target as SVGElement).style.filter =
                        "drop-shadow(0 0 15px rgba(0,255,200,0.6))";
                    }}
                    onMouseLeave={(e) => {
                      (e.target as SVGElement).style.transform = "scale(1)";
                      (e.target as SVGElement).style.filter =
                        "drop-shadow(0 5px 10px rgba(0,0,0,0.4))";
                    }}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* === Legend === */}
      <div className="flex justify-center gap-6 mt-6 text-sm font-medium">
        {[
          { color: palette.good, label: "1–2 Trades (Disciplined)" },
          { color: palette.caution, label: "3 Trades (Borderline)" },
          { color: palette.bad, label: "4+ Trades (Overtrading)" },
        ].map(({ color, label }, i) => (
          <span key={i} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full shadow-md"
              style={{ background: color }}
            ></span>
            <span className="opacity-80">{label}</span>
          </span>
        ))}
      </div>
    </motion.section>
  );
}
