"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import useTrades from "@/app/(dashboard)/performance/hook/useTrades";
import { TrendingUp, TrendingDown, Clock, Star, X } from "lucide-react";
import TradeDetails from "../TradeDetails";

export default function TradeTimeline() {
  const { trades, loading } = useTrades();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [selectedTrade, setSelectedTrade] = useState<any>(null);

  const sortedTrades = [...(trades || [])].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const palette = {
    text: isDark ? "#E2E8F0" : "#1E293B",
    line: isDark
      ? "from-cyan-400/60 to-sky-500/10"
      : "from-blue-400/60 to-sky-300/20",
    winBg: isDark
      ? "from-emerald-800/50 to-emerald-700/30"
      : "from-green-200/70 to-emerald-100/50",
    lossBg: isDark
      ? "from-rose-800/50 to-rose-700/30"
      : "from-rose-200/70 to-red-100/50",
    winText: isDark ? "text-emerald-300" : "text-green-700",
    lossText: isDark ? "text-rose-300" : "text-red-700",
  };

  if (loading)
    return (
      <div className="text-center text-sky-400 py-10 animate-pulse">
        Loading your trades...
      </div>
    );

  if (!sortedTrades.length)
    return (
      <div
        className="text-center py-10"
        style={{ color: palette.text, opacity: 0.8 }}
      >
        No trades yet. Start logging your journey 🧭
      </div>
    );

  return (
    <section className="relative py-8 sm:py-10">
      <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent mb-8">
        📈 Trade Timeline
      </h2>

      <div className="relative w-full max-w-4xl mx-auto">
        {/* Center vertical line */}
        <div
          className={`absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b ${palette.line}`}
        ></div>

        <div className="space-y-7 sm:space-y-9">
          {sortedTrades.map((trade, i) => {
            const isWin = trade.result > 0;
            const side = i % 2 === 0 ? "left" : "right";

            return (
              <motion.div
                key={trade.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                viewport={{ once: true }}
                className={`relative flex ${
                  side === "left"
                    ? "justify-end pr-6 sm:pr-14"
                    : "justify-start pl-6 sm:pl-14"
                }`}
              >
                {/* Dot connector */}
                <div
                  className={`absolute left-1/2 top-5 -translate-x-1/2 w-3.5 h-3.5 rounded-full shadow-md ${
                    isWin
                      ? "bg-emerald-400 shadow-emerald-400/40"
                      : "bg-rose-400 shadow-rose-400/40"
                  }`}
                ></div>

                {/* Card */}
                <motion.div
                  whileHover={{ scale: 1.01, y: -2 }}
                  onClick={() => setSelectedTrade(trade)} // ✅ click opens modal
                  transition={{ type: "spring", stiffness: 120, damping: 16 }}
                  className={`cursor-pointer w-full sm:w-[46%] rounded-xl p-4 sm:p-5 border backdrop-blur-lg shadow-md ${
                    isWin
                      ? `border-emerald-400/30 bg-gradient-to-br ${palette.winBg}`
                      : `border-rose-400/30 bg-gradient-to-br ${palette.lossBg}`
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      {isWin ? (
                        <TrendingUp className="text-emerald-400" size={16} />
                      ) : (
                        <TrendingDown className="text-rose-400" size={16} />
                      )}
                      <h3
                        className={`font-semibold text-[13px] sm:text-sm ${
                          isDark ? "text-sky-100" : "text-slate-800"
                        }`}
                      >
                        {trade.pair} • {trade.direction}
                      </h3>
                    </div>
                    <div
                      className={`text-xs font-semibold ${
                        isWin ? palette.winText : palette.lossText
                      }`}
                    >
                      {isWin ? "+" : ""}
                      {trade.result}
                    </div>
                  </div>

                  <div
                    className={`text-[11px] flex flex-wrap gap-2 mb-1 ${
                      isDark ? "text-sky-100/90" : "text-slate-700 opacity-90"
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      <Clock size={11} /> {trade.session || "Session?"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star size={11} /> {trade.quality}
                    </span>
                  </div>

                  {trade.reason && (
                    <p
                      className={`mt-1 text-[11px] leading-snug ${
                        isDark
                          ? "text-slate-200 opacity-80"
                          : "text-slate-800 opacity-80"
                      }`}
                    >
                      🧠 {trade.reason}
                    </p>
                  )}

                  <p
                    className={`mt-1 text-[10px] text-right ${
                      isDark
                        ? "text-sky-300/70"
                        : "text-slate-600 opacity-70"
                    }`}
                  >
                    {new Date(trade.date).toLocaleDateString()}
                  </p>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* === Modal for trade details === */}
      <AnimatePresence>
        {selectedTrade && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-5xl"
            >
              <button
                onClick={() => setSelectedTrade(null)}
                className="absolute -top-4 -right-4 bg-gradient-to-r from-sky-500 to-cyan-400 text-white p-2 rounded-full shadow-lg hover:opacity-90 transition-all"
              >
                <X size={18} />
              </button>

              {/* ✅ Your Trade Detail Card */}
              <TradeDetails trade={selectedTrade} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
