"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Save } from "lucide-react";

export default function CreateRiskMonitor({
  onGoalChange,
}: {
  onGoalChange?: (goal: number) => void;
}) {
  const [riskGoal, setRiskGoal] = useState<number>(200);
  const [saved, setSaved] = useState(false);

  // ✅ Load saved goal from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("riskGoal");
    if (stored) {
      setRiskGoal(Number(stored));
      onGoalChange?.(Number(stored));
    }
  }, [onGoalChange]);

  const handleSave = () => {
    localStorage.setItem("riskGoal", String(riskGoal));
    onGoalChange?.(riskGoal);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  // 🎨 DC Trades Neon Palette
  const palette = {
    bg: "linear-gradient(145deg, rgba(11,15,20,0.95), rgba(17,24,39,0.95))",
    border: "rgba(56,189,248,0.25)",
    accent: "#38BDF8",
    text: "#E2E8F0",
    label: "rgba(148,163,184,0.8)",
    shadow: "0 0 25px rgba(56,189,248,0.15)",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.4 }}
      className="p-6 rounded-2xl border backdrop-blur-xl shadow-lg"
      style={{
        background: palette.bg,
        borderColor: palette.border,
        boxShadow: palette.shadow,
        color: palette.text,
      }}
    >
      {/* === Header === */}
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-400/20 shadow-inner">
          <Shield size={18} className="text-sky-400" />
        </div>
        <h2 className="font-semibold text-lg bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
          Risk Goal Settings
        </h2>
      </div>

      <p className="text-sm mb-5 text-slate-400 leading-relaxed">
        Define your <span className="text-sky-400 font-medium">maximum daily loss</span> to stay
        within your trading plan.
      </p>

      {/* === Input === */}
      <div className="flex items-center gap-3">
        <label className="text-sm text-slate-400">Max Loss ($):</label>
        <input
          type="number"
          value={riskGoal}
          onChange={(e) => setRiskGoal(Number(e.target.value))}
          className="w-28 px-2 py-1.5 rounded-md border text-center font-semibold outline-none focus:ring-2 focus:ring-sky-400 transition-all"
          style={{
            background: "rgba(15,23,42,0.8)",
            color: palette.text,
            borderColor: palette.border,
            boxShadow: "0 0 6px rgba(56,189,248,0.15)",
          }}
        />
      </div>

      {/* === Save Button === */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleSave}
        className="mt-6 w-full flex items-center justify-center gap-2 py-2 rounded-md font-semibold shadow-md text-black transition-all hover:opacity-90 active:scale-95"
        style={{
          background: "linear-gradient(90deg, #38BDF8, #06B6D4)",
          boxShadow: "0 0 20px rgba(56,189,248,0.3)",
        }}
      >
        <Save size={16} />
        {saved ? "Saved!" : "Save Goal"}
      </motion.button>

      <div className="mt-3 text-xs text-center text-sky-400/70">
        💡 This goal updates your live Risk Monitor automatically.
      </div>
    </motion.div>
  );
}
