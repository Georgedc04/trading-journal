"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import {
  Settings,
  Wallet,
  Target,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import AccountDetailsModal from "./AccountDetailsModal";

type Props = {
  accountSize: number | string;
  targetPercent: number | string;
  setAccountSize: (v: number | string) => void;
  setTargetPercent: (v: number | string) => void;
  balance: number;
};

export default function AccountHeader({
  accountSize,
  targetPercent,
  setAccountSize,
  setTargetPercent,
  balance,
}: Props) {
  const [showModal, setShowModal] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // ✅ Persist account data
  useEffect(() => {
    if (accountSize && targetPercent) {
      localStorage.setItem(
        "accountDetails",
        JSON.stringify({ accountSize, targetPercent })
      );
    }
  }, [accountSize, targetPercent]);

  // ✅ Load saved details
  useEffect(() => {
    const saved = localStorage.getItem("accountDetails");
    if (saved) {
      const { accountSize, targetPercent } = JSON.parse(saved);
      setAccountSize(accountSize);
      setTargetPercent(targetPercent);
    }
  }, [setAccountSize, setTargetPercent]);

  const isProfit = Number(balance) > Number(accountSize);
  const diff = Number(accountSize)
    ? ((Number(balance) - Number(accountSize)) / Number(accountSize)) * 100
    : 0;
  const diffText = `${diff > 0 ? "+" : ""}${diff.toFixed(2)}%`;

  const palette = isDark
    ? {
        bg: "linear-gradient(145deg, #0B0F14, #111827)",
        border: "rgba(56,189,248,0.25)",
        text: "#E2E8F0",
        accent: "#38BDF8",
        profit: "#22C55E",
        loss: "#EF4444",
        shadow: "0 8px 20px rgba(56,189,248,0.15)",
        button: "from-sky-500 to-cyan-400",
      }
    : {
        bg: "linear-gradient(145deg, #F9FAFB, #E0F2FE)",
        border: "rgba(37,99,235,0.25)",
        text: "#1E293B",
        accent: "#2563EB",
        profit: "#16A34A",
        loss: "#DC2626",
        shadow: "0 8px 20px rgba(37,99,235,0.15)",
        button: "from-blue-600 to-sky-400",
      };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col sm:flex-row flex-wrap justify-between items-start sm:items-center gap-4 p-5 rounded-2xl border shadow-md transition-all duration-300"
      style={{
        background: palette.bg,
        borderColor: palette.border,
        boxShadow: palette.shadow,
        color: palette.text,
      }}
    >
      {/* === Account Summary === */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Wallet
            size={20}
            className={isDark ? "text-sky-400" : "text-blue-600"}
          />
          <span className="opacity-80">Current Balance:</span>
          <span
            className="font-bold"
            style={{
              color: isProfit ? palette.profit : palette.loss,
            }}
          >
            ${isNaN(balance) ? "0.00" : balance.toFixed(2)}
          </span>
        </div>

        {accountSize && targetPercent && (
          <div className="text-sm flex flex-wrap items-center gap-4 mt-2 opacity-90">
            <div className="flex items-center gap-1">
              <Wallet size={14} className="opacity-70" />
              <span>Account Size:</span>
              <span className="font-medium">${accountSize}</span>
            </div>

            <div className="flex items-center gap-1">
              <Target size={14} className="opacity-70" />
              <span>Target:</span>
              <span
                className="font-medium"
                style={{ color: palette.accent }}
              >
                {targetPercent}%
              </span>
            </div>

            <div className="flex items-center gap-1">
              {isProfit ? (
                <TrendingUp size={14} color={palette.profit} />
              ) : (
                <TrendingDown size={14} color={palette.loss} />
              )}
              <span
                className="font-semibold"
                style={{
                  color: isProfit ? palette.profit : palette.loss,
                }}
              >
                {diffText}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* === Settings Button === */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowModal(true)}
        className={`flex items-center gap-2 font-semibold px-4 py-2 rounded-lg text-white shadow-lg bg-gradient-to-r ${palette.button} transition-all`}
        style={{
          boxShadow: isDark
            ? "0 4px 5px rgba(56,189,248,0.3)"
            : "0 4px 2px rgba(37,99,235,0.3)",
        }}
      >
        <Settings size={18} />
        {accountSize && targetPercent
          ? "Edit Account Details"
          : "Enter Account Details"}
      </motion.button>

      {/* === Modal === */}
      {showModal && (
        <AccountDetailsModal
          accountSize={accountSize}
          targetPercent={targetPercent}
          setAccountSize={setAccountSize}
          setTargetPercent={setTargetPercent}
          onClose={() => setShowModal(false)}
        />
      )}
    </motion.div>
  );
}
