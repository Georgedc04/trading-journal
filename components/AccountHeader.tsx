"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
  const [loading, setLoading] = useState(true);

  // ✅ Simulate loading delay for smooth skeletons
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // ✅ Save account data
  useEffect(() => {
    if (accountSize && targetPercent) {
      localStorage.setItem(
        "accountDetails",
        JSON.stringify({ accountSize, targetPercent })
      );
    }
  }, [accountSize, targetPercent]);

  // ✅ Load saved data
  useEffect(() => {
    const saved = localStorage.getItem("accountDetails");
    if (saved) {
      const { accountSize, targetPercent } = JSON.parse(saved);
      setAccountSize(accountSize);
      setTargetPercent(targetPercent);
    }
  }, [setAccountSize, setTargetPercent]);

  const acc = Number(accountSize);
  const bal = Number(balance);
  const diff = acc ? ((bal - acc) / acc) * 100 : 0;
  const diffText = `${diff > 0 ? "+" : ""}${diff.toFixed(2)}%`;
  const isProfit = bal > acc;
  const isLoss = bal < acc;
  const isNeutral = bal === acc;

  const palette = {
    bg: "linear-gradient(145deg, #0B0F14, #111827)",
    border: "rgba(56,189,248,0.25)",
    text: "#E2E8F0",
    accent: "#38BDF8",
    profit: "#00FF88",
    loss: "#FF4D4D",
    neutral: "#FACC15",
    shadow: "0 0 25px rgba(56,189,248,0.15)",
  };

  const balanceColor = isProfit
    ? palette.profit
    : isLoss
    ? palette.loss
    : palette.neutral;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col sm:flex-row flex-wrap justify-between items-start sm:items-center gap-4 p-5 rounded-2xl border shadow-lg transition-all duration-300"
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
          <Wallet size={20} className="text-sky-400" />
          <span className="opacity-80">Current Balance:</span>
          {loading ? (
            <span className="animate-pulse bg-slate-700 h-5 w-20 rounded-md"></span>
          ) : (
            <span className="font-bold" style={{ color: balanceColor }}>
              ${isNaN(balance) ? "0.00" : balance.toFixed(2)}
            </span>
          )}
        </div>

        <div className="text-sm flex flex-wrap items-center gap-4 mt-2 opacity-90">
          <div className="flex items-center gap-1">
            <Wallet size={14} className="text-sky-400 opacity-80" />
            <span>Account Size:</span>
            {loading ? (
              <span className="animate-pulse bg-slate-700 h-4 w-16 rounded-md"></span>
            ) : (
              <span className="font-medium text-slate-100">
                ${accountSize}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <Target size={14} className="text-cyan-400 opacity-80" />
            <span>Target:</span>
            {loading ? (
              <span className="animate-pulse bg-slate-700 h-4 w-10 rounded-md"></span>
            ) : (
              <span className="font-medium text-sky-400">{targetPercent}%</span>
            )}
          </div>

          {!loading && (
            <div className="flex items-center gap-1">
              {isProfit ? (
                <TrendingUp color={palette.profit} size={14} />
              ) : isLoss ? (
                <TrendingDown color={palette.loss} size={14} />
              ) : (
                <TrendingUp color={palette.neutral} size={14} />
              )}
              <span className="font-semibold" style={{ color: balanceColor }}>
                {diffText}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* === Settings Button === */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 font-semibold px-4 py-2 rounded-lg text-black shadow-md bg-gradient-to-r from-sky-500 to-cyan-400 hover:opacity-90 transition-all"
        style={{
          boxShadow: "0 0 20px rgba(56,189,248,0.4)",
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
