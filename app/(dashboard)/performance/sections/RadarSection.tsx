"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import RadarSetupChart from "@/components/RadarSetupChart";
import useTrades from "../hook/useTrades";

export default function RadarSection() {
  const { trades, loading } = useTrades();
  const [mounted, setMounted] = useState(false);

  // ✅ Always call hooks before any returns
  useEffect(() => setMounted(true), []);

  // ✅ Compute setup data safely
  const setupData = useMemo(() => {
    if (!trades || trades.length === 0) return [];

    const grouped: Record<string, number> = {};
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

    const order = ["A+", "A", "B", "C"];
    return order.map(
      (s) => entries.find((e) => e.setup === s) || { setup: s, percentage: 0 }
    );
  }, [trades]);

  // ✅ Rendering phase (no hooks below this point)
  if (!mounted) {
    return (
      <div className="w-full h-[380px] flex items-center justify-center text-sm text-gray-500">
        Loading radar analytics...
      </div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center py-10 px-4 text-gray-100 bg-[#0B0F14]/10"
    >
     

      {/* Chart */}
      {loading ? (
        <p className="text-sm text-gray-400 animate-pulse">
          Fetching setup data from your journal...
        </p>
      ) : setupData.length === 0 ? (
        <p className="text-sm text-gray-500">
          No trades available yet — start journaling to view analytics.
        </p>
      ) : (
        <RadarSetupChart setups={setupData} />
      )}
    </motion.section>
  );
}
