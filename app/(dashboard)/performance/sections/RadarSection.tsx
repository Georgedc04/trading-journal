"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import RadarSetupChart from "@/components/RadarSetupChart";
import useTrades from "../hook/useTrades";

export default function RadarSection() {
  const { trades, loading } = useTrades();
  const [mounted, setMounted] = useState(false);

  // 🧱 Prevent hydration mismatch
  useEffect(() => setMounted(true), []);

  // 🧮 Calculate setup performance data
  const setupData = useMemo(() => {
    if (!trades || trades.length === 0) return [];

    const grouped: Record<string, number> = {};

    // ✅ Count trades per quality/setup
    for (const t of trades) {
      const setup = (t.quality?.trim() || "Unknown").toUpperCase();
      grouped[setup] = (grouped[setup] || 0) + 1;
    }

    const total = trades.length;
    const entries = Object.entries(grouped)
      .map(([setup, count]) => ({
        setup,
        percentage: Number(((count / total) * 100).toFixed(1)),
      }))
      .filter((s) => ["A+", "A", "B", "C"].includes(s.setup));

    // ✅ Maintain consistent order: A+ → A → B → C
    const order = ["A+", "A", "B", "C"];
    return order.map(
      (s) => entries.find((e) => e.setup === s) || { setup: s, percentage: 0 }
    );
  }, [trades]);

  if (!mounted) {
    return (
      <div className="w-full h-[380px] flex items-center justify-center text-sm opacity-70">
        Loading radar chart...
      </div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center py-8"
    >
      {/* Header */}
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-xl sm:text-2xl font-bold mb-4 bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent"
      >
        Setup Efficiency Overview
      </motion.h2>

      {/* Chart or Fallbacks */}
      {loading ? (
        <p className="text-sm opacity-70 animate-pulse">
          Fetching setup data from your journal...
        </p>
      ) : setupData.length === 0 ? (
        <p className="text-sm opacity-70">
          No trades available yet — start logging your setups to view analytics.
        </p>
      ) : (
        <RadarSetupChart setups={setupData} />
      )}
    </motion.section>
  );
}
