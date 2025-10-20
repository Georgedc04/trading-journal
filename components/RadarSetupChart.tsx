"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { motion } from "framer-motion";

type SetupData = {
  setup: string;
  percentage: number;
};

export default function RadarSetupChart({ setups }: { setups: SetupData[] }) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 🧱 Prevent hydration mismatch
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="w-full h-[380px] flex items-center justify-center text-sm opacity-70">
        Loading radar chart...
      </div>
    );
  }

  const isDark = theme === "dark";

  // 🎨 Theme palette
  const palette = isDark
    ? {
        text: "#E2E8F0",
        accent: "#38BDF8",
        fill: "rgba(56,189,248,0.35)",
        grid: "rgba(255,255,255,0.15)",
        glow: "rgba(56,189,248,0.4)",
      }
    : {
        text: "#1E293B",
        accent: "#2563EB",
        fill: "rgba(37,99,235,0.25)",
        grid: "rgba(0,0,0,0.1)",
        glow: "rgba(37,99,235,0.35)",
      };

  // ✅ Safe fallback data
  const formattedData =
    setups && setups.length > 0
      ? setups
      : [
          { setup: "A+", percentage: 85 },
          { setup: "A", percentage: 70 },
          { setup: "B", percentage: 55 },
          { setup: "C", percentage: 40 },
        ];

  const topSetup =
    formattedData.length > 0
      ? formattedData.reduce((a, b) =>
          a.percentage >= b.percentage ? a : b
        )
      : { setup: "—", percentage: 0 };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true }}
      className="relative w-full h-[380px] flex flex-col items-center justify-center rounded-2xl p-5 border shadow-lg backdrop-blur-md overflow-hidden"
      style={{
        background: isDark
          ? "linear-gradient(135deg, #0B0F14, #111827)"
          : "linear-gradient(135deg, #FFFFFF, #E0F2FE)",
        borderColor: palette.grid,
      }}
    >
      {/* === Title === */}
      <h3
        className="text-lg sm:text-xl font-semibold mb-4 text-center"
        style={{ color: palette.accent }}
      >
        Setup Performance Radar
      </h3>

      {/* === Glowing Pulse === */}
      <motion.div
        className="absolute rounded-full blur-[90px]"
        style={{
          background: palette.glow,
          width: "180px",
          height: "180px",
          top: "45%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          opacity: 0.25,
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.35, 0.15],
        }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
      />

      {/* === Radar Chart === */}
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={formattedData}>
          <PolarGrid stroke={palette.grid} />
          <PolarAngleAxis
            dataKey="setup"
            stroke={palette.text}
            tick={{ fill: palette.text, fontSize: 13 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            stroke={palette.grid}
            tick={{ fill: palette.text, fontSize: 11 }}
          />
          <Radar
            name="Setup Efficiency"
            dataKey="percentage"
            stroke={palette.accent}
            strokeWidth={2.5}
            fill={palette.fill}
            fillOpacity={0.6}
          />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            contentStyle={{
              background: isDark ? "#1E293B" : "#F9FAFB",
              border: "none",
              borderRadius: "10px",
              color: palette.text,
              fontSize: "13px",
              boxShadow: `0 0 15px ${palette.fill}`,
            }}
          />
        </RadarChart>
      </ResponsiveContainer>

      {/* === Top Setup Label === */}
      <motion.div
        className="relative mt-6 text-sm sm:text-base font-medium text-center px-4 py-2 rounded-md backdrop-blur-lg shadow-md border inline-block"
        style={{
          background: isDark
            ? "rgba(56,189,248,0.1)"
            : "rgba(37,99,235,0.1)",
          color: palette.accent,
          borderColor: palette.grid,
        }}
        animate={{
          opacity: [0.7, 1, 0.7],
          scale: [1, 1.05, 1],
        }}
        transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
      >
        🔥 Top Setup: <b>{topSetup.setup}</b> — {topSetup.percentage}%
      </motion.div>
    </motion.div>
  );
}
