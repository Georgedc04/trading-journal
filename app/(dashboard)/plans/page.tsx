"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";

// Lazy load PlanUpgrade to improve performance
const PlanUpgrade = dynamic(() => import("@/components/PlanUpgrade"), {
  ssr: false,
});

export default function PlanPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0B0F14] to-[#111827] text-gray-100 p-6"
    >
      <div className="w-full max-w-6xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-cyan-400 mb-8">
          Manage Your Trading Journal Subscription
        </h1>

        {/* ✅ Import and render PlanUpgrade component */}
        <PlanUpgrade />
      </div>
    </motion.div>
  );
}
