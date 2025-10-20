"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { X } from "lucide-react";

export default function AccountDetailsModal({
  accountSize,
  targetPercent,
  setAccountSize,
  setTargetPercent,
  onClose,
}: {
  accountSize: number | string;
  targetPercent: number | string;
  setAccountSize: (v: number | string) => void;
  setTargetPercent: (v: number | string) => void;
  onClose: () => void;
}) {
  const [localAccountSize, setLocalAccountSize] = useState(accountSize || "");
  const [localTargetPercent, setLocalTargetPercent] = useState(targetPercent || "");
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    setLocalAccountSize(accountSize);
    setLocalTargetPercent(targetPercent);
  }, [accountSize, targetPercent]);

  const handleSave = () => {
    if (!localAccountSize || !localTargetPercent) {
      alert("⚠️ Please fill in both fields.");
      return;
    }
    setAccountSize(localAccountSize);
    setTargetPercent(localTargetPercent);
    localStorage.setItem(
      "accountDetails",
      JSON.stringify({
        accountSize: localAccountSize,
        targetPercent: localTargetPercent,
      })
    );
    onClose();
  };

  const palette = isDark
    ? {
        bg: "linear-gradient(145deg, #0B0F14 0%, #111827 100%)",
        border: "rgba(56,189,248,0.25)",
        text: "#E2E8F0",
        accent: "#38BDF8",
        shadow: "0 0 30px rgba(56,189,248,0.25)",
        inputBg: "#0F172A",
      }
    : {
        bg: "linear-gradient(145deg, #F9FAFB 0%, #E0F2FE 100%)",
        border: "rgba(37,99,235,0.25)",
        text: "#1E293B",
        accent: "#2563EB",
        shadow: "0 0 25px rgba(37,99,235,0.25)",
        inputBg: "#FFFFFF",
      };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="relative w-80 rounded-2xl p-6 border shadow-xl"
        style={{
          background: palette.bg,
          borderColor: palette.border,
          boxShadow: palette.shadow,
          color: palette.text,
        }}
      >
        {/* ✖ Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-full transition-all hover:scale-110"
          style={{
            background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
            color: palette.accent,
          }}
        >
          <X size={18} />
        </button>

        {/* 🧾 Header */}
        <h2
          className="text-xl font-bold mb-5 text-center bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent"
        >
          Account Details
        </h2>

        {/* 🧮 Input Fields */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium opacity-80">
              Account Size ($)
            </label>
            <input
              inputMode="numeric"
              value={localAccountSize}
              placeholder="Enter your account size"
              onChange={(e) => setLocalAccountSize(e.target.value)}
              className="mt-1 w-full p-2 rounded-md outline-none focus:ring-2 transition-all"
              style={{
                background: palette.inputBg,
                border: `1px solid ${palette.border}`,
                color: palette.text,
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            />
          </div>

          <div>
            <label className="text-sm font-medium opacity-80">
              Profit Target (%)
            </label>
            <input
              inputMode="numeric"
              value={localTargetPercent}
              placeholder="Enter profit target"
              onChange={(e) => setLocalTargetPercent(e.target.value)}
              className="mt-1 w-full p-2 rounded-md outline-none focus:ring-2 transition-all"
              style={{
                background: palette.inputBg,
                border: `1px solid ${palette.border}`,
                color: palette.text,
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            />
          </div>
        </div>

        {/* 🔘 Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-3 py-2 rounded-md font-medium transition-all"
            style={{
              background: "transparent",
              color: palette.text,
              border: `1px solid ${palette.border}`,
            }}
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-md font-semibold shadow-md transition-all hover:scale-105"
            style={{
              background: `linear-gradient(90deg, ${palette.accent}, #22C55E)`,
              color: "#fff",
              boxShadow: "0 0 15px rgba(56,189,248,0.4)",
            }}
          >
            Save
          </button>
        </div>
      </motion.div>
    </div>
  );
}
