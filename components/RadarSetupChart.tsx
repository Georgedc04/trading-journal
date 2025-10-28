"use client";

import { useEffect, useState } from "react";
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
  const [mounted, setMounted] = useState(false);

  // ✅ Prevent hydration mismatch
  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return (
      <div className="w-full h-[380px] flex items-center justify-center text-sm text-gray-500">
        Loading radar chart...
      </div>
    );
  }

  // 🌙 Force Dark Mode as Default
  const isDark = true;

  // 🎨 Theme Palette (Dark only)
  const palette = {
    text: "#E2E8F0",
    accent: "#38BDF8",
    fill: "rgba(56,189,248,0.35)",
    grid: "rgba(255,255,255,0.1)",
    glow: "rgba(56,189,248,0.4)",
  };

  // ✅ Safe Fallback Data
  const formattedData =
    setups && setups.length > 0
      ? setups
      : [
          { setup: "A+", percentage: 85 },
          { setup: "A", percentage: 72 },
          { setup: "B", percentage: 58 },
          { setup: "C", percentage: 45 },
        ];

  // 🔥 Find Top Performing Setup
  const topSetup =
    formattedData.length > 0
      ? formattedData.reduce((a, b) => (a.percentage >= b.percentage ? a : b))
      : { setup: "—", percentage: 0 };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true }}
      className="relative w-full h-[380px] flex flex-col items-center justify-center rounded-2xl p-5 border border-cyan-400/20 shadow-[0_0_25px_rgba(56,189,248,0.1)] backdrop-blur-md overflow-hidden bg-gradient-to-br from-[#0B0F14] to-[#111827]"
    >
      {/* === Title === */}
      <h3
        className="text-lg sm:text-xl font-semibold mb-4 text-center"
        style={{ color: palette.accent }}
      >
        Setup Performance Radar
      </h3>

      {/* === Background Glow === */}
      <motion.div
        className="absolute rounded-full blur-[100px]"
        style={{
          background: palette.glow,
          width: "200px",
          height: "200px",
          top: "45%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          opacity: 0.2,
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.15, 0.3, 0.15],
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
              background: "#0B1220",
              border: "1px solid rgba(56,189,248,0.3)",
              borderRadius: "10px",
              color: palette.text,
              fontSize: "13px",
              boxShadow: `0 0 15px ${palette.glow}`,
            }}
          />
        </RadarChart>
      </ResponsiveContainer>

      {/* === Top Setup Label === */}
      <motion.div
        className="relative mt-6 text-sm sm:text-base font-medium text-center px-4 py-2 rounded-md backdrop-blur-lg shadow-md border border-cyan-400/20 inline-block"
        style={{
          background: "rgba(56,189,248,0.1)",
          color: palette.accent,
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
