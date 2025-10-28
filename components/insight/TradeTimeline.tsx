"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useTrades from "@/app/(dashboard)/performance/hook/useTrades";
import { TrendingUp, TrendingDown, Clock, Star, X } from "lucide-react";
import TradeDetails from "../TradeDetails";

export default function TradeTimeline() {
  const { trades, loading } = useTrades();
  const [selectedTrade, setSelectedTrade] = useState<any>(null);

  const sortedTrades = [...(trades || [])].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // 🎨 DC Trades Neon Palette
  const palette = {
    text: "#E2E8F0",
    winBg: "linear-gradient(145deg, rgba(16,185,129,0.2), rgba(16,185,129,0.1))",
    lossBg: "linear-gradient(145deg, rgba(244,63,94,0.25), rgba(136,19,55,0.1))",
    winText: "text-emerald-400",
    lossText: "text-rose-400",
    line: "from-cyan-400/60 to-sky-500/10",
    shadow: "0 0 15px rgba(56,189,248,0.15)",
  };

  // 🌀 Loading state
  if (loading)
    return (
      <div className="text-center text-sky-400 py-100 animate-pulse">
        Loading your trades...
      </div>
    );

  // 📭 Empty state
  if (!sortedTrades.length)
    return (
      <div className="text-center py-10 text-slate-400 italic">
        No trades yet — start your trading journey 🧭
      </div>
    );

  return (
    <section className="relative py-8 sm:py-10">
      <h2 className="text-2xl font-bold text-center mb-10 bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(56,189,248,0.3)]">
        📈 Trade Timeline
      </h2>

      <div className="relative w-full max-w-5xl mx-auto">
        {/* === Central Timeline Line === */}
        <div
          className={`absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b ${palette.line}`}
        ></div>

        {/* === Trades === */}
        <div className="space-y-10 sm:space-y-12">
          {sortedTrades.map((trade, i) => {
            const isWin = trade.result > 0;
            const side = i % 2 === 0 ? "left" : "right";

            return (
              <motion.div
                key={trade.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                viewport={{ once: true }}
                className={`relative flex ${
                  side === "left"
                    ? "justify-end pr-8 sm:pr-14"
                    : "justify-start pl-8 sm:pl-14"
                }`}
              >
                {/* === Node === */}
                <div
                  className={`absolute left-1/2 top-6 -translate-x-1/2 w-4 h-4 rounded-full border-2 ${
                    isWin ? "border-emerald-400" : "border-rose-400"
                  } shadow-lg`}
                  style={{
                    boxShadow: isWin
                      ? "0 0 10px rgba(16,185,129,0.6)"
                      : "0 0 10px rgba(244,63,94,0.6)",
                    background: isWin ? "#16A34A" : "#DC2626",
                  }}
                ></div>

                {/* === Card === */}
                <motion.div
                  whileHover={{ scale: 1.02, y: -3 }}
                  onClick={() => setSelectedTrade(trade)}
                  transition={{ type: "spring", stiffness: 130, damping: 14 }}
                  className={`cursor-pointer w-full sm:w-[46%] rounded-xl p-5 border backdrop-blur-xl shadow-lg transition-all ${
                    isWin
                      ? "border-emerald-400/30"
                      : "border-rose-400/30"
                  }`}
                  style={{
                    background: isWin ? palette.winBg : palette.lossBg,
                    boxShadow: palette.shadow,
                  }}
                >
                  {/* === Header === */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {isWin ? (
                        <TrendingUp size={16} className="text-emerald-400" />
                      ) : (
                        <TrendingDown size={16} className="text-rose-400" />
                      )}
                      <h3 className="font-semibold text-sky-100 text-sm">
                        {trade.pair} • {trade.direction}
                      </h3>
                    </div>
                    <div
                      className={`text-xs font-bold ${
                        isWin ? palette.winText : palette.lossText
                      }`}
                    >
                      {isWin ? "+" : ""}
                      {trade.result}
                    </div>
                  </div>

                  {/* === Meta Info === */}
                  <div className="text-[11px] flex flex-wrap gap-2 mb-1 text-sky-200/80">
                    <span className="flex items-center gap-1">
                      <Clock size={11} /> {trade.session || "Session?"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star size={11} /> {trade.quality}
                    </span>
                  </div>

                  {/* === Reason === */}
                  {trade.reason && (
                    <p className="mt-1 text-[11px] leading-snug text-slate-300/80">
                      🧠 {trade.reason}
                    </p>
                  )}

                  <p className="mt-1 text-[10px] text-right text-sky-400/70">
                    {new Date(trade.date).toLocaleDateString()}
                  </p>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* === Trade Detail Modal === */}
      <AnimatePresence>
        {selectedTrade && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-5xl"
            >
              <button
                onClick={() => setSelectedTrade(null)}
                className="absolute -top-5 -right-5 bg-gradient-to-r from-sky-500 to-cyan-400 text-white p-2 rounded-full shadow-md hover:opacity-90 transition-all"
              >
                <X size={18} />
              </button>

              <TradeDetails trade={selectedTrade} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
