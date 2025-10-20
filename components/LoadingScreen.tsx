"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { getActiveColors } from "@/lib/colors"; // ✅ adjust path if needed

export default function LoadingScreen() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const colors = getActiveColors(isDark);

  const [visible, setVisible] = useState(false);

  // ✨ Smooth fade-in
  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center backdrop-blur-2xl`}
      style={{
        background: isDark
          ? "linear-gradient(135deg, rgba(10,10,10,0.92), rgba(17,24,39,0.9))"
          : "linear-gradient(135deg, rgba(255,248,243,0.95), rgba(250,250,250,0.9))",
        color: colors.text,
      }}
    >
      {/* Spinner with gradient ring */}
      <div className="relative flex items-center justify-center">
        <div
          className="absolute inset-0 rounded-full blur-md opacity-60 animate-pulse"
          style={{
            background: isDark
              ? "linear-gradient(90deg, #34D399, #38BDF8, #A78BFA)"
              : "linear-gradient(90deg, #8B593E, #D97706, #F59E0B)",
          }}
        />
        <div
          className="p-5 rounded-full shadow-lg"
          style={{
            background: isDark
              ? "linear-gradient(135deg, rgba(17,24,39,0.7), rgba(30,41,59,0.8))"
              : "linear-gradient(135deg, rgba(255,255,255,0.8), rgba(250,250,250,0.9))",
            border: `1px solid ${
              isDark ? "rgba(56,189,248,0.3)" : "rgba(139,89,62,0.3)"
            }`,
          }}
        >
          <Loader2
            className={`w-8 h-8 animate-spin ${
              isDark ? "text-emerald-400" : "text-[#8B593E]"
            }`}
          />
        </div>
      </div>

      {/* Subtext */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className={`mt-5 text-sm sm:text-base tracking-wide font-medium`}
        style={{
          color: isDark ? "#CBD5E1" : "#4A3428",
          textShadow: isDark
            ? "0 0 8px rgba(52,211,153,0.4)"
            : "0 0 6px rgba(139,89,62,0.2)",
        }}
      >
        Loading your data, please wait...
      </motion.p>
    </motion.div>
  );
}
