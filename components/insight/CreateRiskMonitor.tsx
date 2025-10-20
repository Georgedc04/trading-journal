"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Save } from "lucide-react";
import { useTheme } from "next-themes";

export default function CreateRiskMonitor({
  onGoalChange,
}: {
  onGoalChange?: (goal: number) => void;
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [riskGoal, setRiskGoal] = useState<number>(200);
  const [saved, setSaved] = useState(false);

  // Load saved goal from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("riskGoal");
    if (stored) {
      setRiskGoal(Number(stored));
      if (onGoalChange) onGoalChange(Number(stored));
    }
  }, [onGoalChange]);

  const handleSave = () => {
    localStorage.setItem("riskGoal", String(riskGoal));
    if (onGoalChange) onGoalChange(riskGoal);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const palette = {
    bg: isDark
      ? "linear-gradient(145deg, rgba(15,23,42,0.9), rgba(8,47,73,0.6))"
      : "linear-gradient(145deg, rgba(240,249,255,0.95), rgba(224,242,254,0.9))",
    border: isDark ? "rgba(56,189,248,0.2)" : "rgba(37,99,235,0.2)",
    text: isDark ? "#E2E8F0" : "#1E293B",
    label: isDark ? "rgba(203,213,225,0.8)" : "rgba(30,41,59,0.7)",
    inputBg: isDark ? "rgba(15,23,42,0.9)" : "rgba(255,255,255,0.9)",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.4 }}
      className="p-5 rounded-2xl border shadow-lg backdrop-blur-xl"
      style={{
        background: palette.bg,
        borderColor: palette.border,
        boxShadow: `0 0 25px ${isDark ? "rgba(56,189,248,0.1)" : "rgba(37,99,235,0.1)"}`,
        color: palette.text,
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Shield className={isDark ? "text-cyan-400" : "text-sky-600"} />
        <h2
          className="font-semibold text-lg"
          style={{ color: isDark ? "#7DD3FC" : "#0369A1" }}
        >
          Risk Goal Settings
        </h2>
      </div>

      <p
        className="text-sm mb-4"
        style={{ color: palette.label }}
      >
        Define your{" "}
        <span className={isDark ? "text-cyan-400" : "text-sky-700 font-medium"}>
          maximum daily loss
        </span>{" "}
        to stay within your trading plan.
      </p>

      {/* Input */}
      <div className="flex items-center gap-3">
        <label className="text-sm" style={{ color: palette.label }}>
          Max Loss ($):
        </label>
        <input
          type="number"
          value={riskGoal}
          onChange={(e) => setRiskGoal(Number(e.target.value))}
          className="w-24 px-2 py-1 rounded-md border text-center outline-none focus:ring-2"
          style={{
            background: palette.inputBg,
            color: palette.text,
            borderColor: palette.border,
            boxShadow: `0 0 5px ${palette.border}`,
          }}
        />
      </div>

      {/* Save button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleSave}
        className="mt-5 w-full flex items-center justify-center gap-2 py-2 rounded-md font-semibold shadow-md transition"
        style={{
          background: isDark
            ? "linear-gradient(to right, #0EA5E9, #22D3EE)"
            : "linear-gradient(to right, #38BDF8, #0EA5E9)",
          color: "#000",
        }}
      >
        <Save size={16} />
        {saved ? "Saved!" : "Save Goal"}
      </motion.button>

      <div
        className="mt-3 text-xs text-center"
        style={{ color: isDark ? "#7DD3FC" : "#0369A1", opacity: 0.7 }}
      >
        💡 This goal updates your live Risk Monitor automatically.
      </div>
    </motion.div>
  );
}
