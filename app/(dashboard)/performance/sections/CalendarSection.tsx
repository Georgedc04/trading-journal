"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Maximize2, X } from "lucide-react";

export default function CalendarSection({
  trades,
  accountSize,
}: {
  trades: { date: string; result: number; reason?: string }[];
  accountSize: number;
}) {
  const [mounted, setMounted] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState<any | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  // 🎨 Pure Dark Neon Theme
  const palette = {
    bg: "radial-gradient(circle at top left, #0B0F14 0%, #111827 100%)",
    card: "linear-gradient(145deg, #0F172A 0%, #0B0F14 100%)",
    border: "#000000",
    text: "#E2E8F0",
    accent: "#38BDF8",
    profit: "#00FF88",
    loss: "#FF4D4D",
  };

  // --- Calendar setup ---
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = currentDate.toLocaleString("default", { month: "long" });

  // --- Group trades by date ---
  const tradesByDate: Record<string, any[]> = {};
  trades.forEach((t) => {
    const key = new Date(t.date).toDateString();
    tradesByDate[key] = tradesByDate[key] || [];
    tradesByDate[key].push(t);
  });

  const daysArray = Array.from({ length: firstDay + daysInMonth }, (_, i) => {
    const day = i - firstDay + 1;
    return day > 0 ? day : null;
  });

  // --- Calendar Grid ---
  const CalendarGrid = ({ fullscreen = false }: { fullscreen?: boolean }) => (
    <div
      className={`grid grid-cols-7 ${
        fullscreen ? "aspect-square w-full max-w-[90vh]" : "w-full"
      } border rounded-xl overflow-hidden`}
      style={{
        borderColor: palette.border,
        background: palette.bg,
        boxShadow: "0 0 25px rgba(56,189,248,0.1)",
      }}
    >
      {/* Weekday Header */}
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
        <div
          key={day}
          className="flex items-center justify-center font-bold text-xs sm:text-sm py-2 border-b"
          style={{
            color: palette.accent,
            borderColor: palette.border,
            background: "rgba(56,189,248,0.05)",
          }}
        >
          {day}
        </div>
      ))}

      {/* Day Cells */}
      {daysArray.map((day, i) => {
        const dateKey = day ? new Date(year, month, day).toDateString() : "";
        const dayTrades = tradesByDate[dateKey] || [];
        const todayKey = new Date().toDateString();
        const isToday = dateKey === todayKey;

        return (
          <div
            key={i}
            className="flex flex-col items-center justify-start border text-center relative transition-all duration-300 hover:scale-[1.03] overflow-hidden"
            style={{
              borderColor: palette.border,
              aspectRatio: "1 / 1",
              background: day ? palette.card : "transparent",
              boxShadow: isToday
                ? `0 0 15px ${palette.accent}40, inset 0 0 10px ${palette.accent}40`
                : "none",
            }}
          >
            {/* 🔹 Animated Pin for Today */}
            {isToday && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{
                  y: [0, -8, 0],
                  rotate: [-10, 10, -10],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <MapPin className="text-sky-400 w-6 h-6 drop-shadow-md" />
              </motion.div>
            )}

            {/* 🔸 Day Number */}
            {day && (
              <div className="text-[10px] sm:text-lg font-semibold mt-1 self-end pr-1 z-10 text-slate-300">
                {day}
              </div>
            )}

            {/* 💹 Trade Tags */}
            <div className="flex flex-col items-center justify-center flex-1 gap-[3px] z-10">
              {dayTrades.map((trade, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  className="text-[8px] sm:text-xs px-1.5 py-[2px] rounded-md font-semibold cursor-pointer"
                  style={{
                    background:
                      trade.result > 0
                        ? `${palette.profit}22`
                        : `${palette.loss}22`,
                    color: trade.result > 0 ? palette.profit : palette.loss,
                    border: `1px solid ${
                      trade.result > 0 ? palette.profit : palette.loss
                    }`,
                  }}
                  onClick={() =>
                    setSelectedTrade({
                      ...trade,
                      date: new Date(trade.date).toLocaleDateString(),
                      percent: ((trade.result / accountSize) * 100).toFixed(2),
                    })
                  }
                >
                  {trade.result > 0 ? "🟢 Profit" : "🔴 Loss"}
                </motion.div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <>
      {/* 🗓 Calendar Card */}
      <motion.div
        className="rounded-2xl p-4 sm:p-6 border shadow-lg w-full max-w-6xl mx-auto transition-all duration-300"
        style={{
          background: palette.card,
          borderColor: palette.border,
          color: palette.text,
          boxShadow: "0 0 30px rgba(56,189,248,0.15)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between border-b pb-3 mb-4"
          style={{ borderColor: palette.border }}
        >
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-sky-400">
            {monthName} {year}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentDate(new Date(year, month - 1))}
              className="px-2 py-1 border rounded text-xs sm:text-sm hover:bg-sky-500/10"
              style={{ color: palette.accent, borderColor: palette.border }}
            >
              Prev
            </button>
            <button
              onClick={() => setCurrentDate(new Date(year, month + 1))}
              className="px-2 py-1 border rounded text-xs sm:text-sm hover:bg-sky-500/10"
              style={{ color: palette.accent, borderColor: palette.border }}
            >
              Next
            </button>
            <button
              onClick={() => setIsFullScreen(true)}
              className="p-2 border rounded hover:bg-sky-500/10"
              style={{ color: palette.accent, borderColor: palette.border }}
            >
              <Maximize2 size={18} />
            </button>
          </div>
        </div>

        <CalendarGrid />
      </motion.div>

      {/* 🔳 Fullscreen Calendar */}
      <AnimatePresence>
        {isFullScreen && (
          <motion.div
            className="fixed inset-0 z-[9998] flex items-center justify-center backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ background: "rgba(0,0,0,0.9)" }}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              <button
                onClick={() => setIsFullScreen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-sky-400/10 text-sky-400 hover:scale-110 transition-transform"
              >
                <X size={20} />
              </button>

              <div className="w-full max-w-[90vh] aspect-square">
                <CalendarGrid fullscreen />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 💬 Trade Modal */}
      <AnimatePresence>
        {selectedTrade && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedTrade(null)}
            style={{ background: "rgba(0,0,0,0.7)" }}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-[90%] max-w-md rounded-2xl p-6 border shadow-2xl relative"
              style={{
                background: palette.card,
                borderColor: palette.border,
                color: palette.text,
                boxShadow: "0 0 25px rgba(56,189,248,0.2)",
              }}
            >
              <button
                onClick={() => setSelectedTrade(null)}
                className="absolute top-3 right-3 p-2 rounded-full bg-sky-400/10 text-sky-400"
              >
                <X size={18} />
              </button>

              <h2 className="text-xl font-semibold mb-4 text-center text-sky-400">
                Trade Details
              </h2>

              <div className="space-y-2 text-sm sm:text-base">
                <div className="flex justify-between">
                  <strong>Status:</strong>
                  <span
                    style={{
                      color:
                        selectedTrade.result > 0
                          ? palette.profit
                          : palette.loss,
                    }}
                  >
                    {selectedTrade.result > 0 ? "🟢 Profit" : "🔴 Loss"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <strong>Amount:</strong>
                  <span>
                    {selectedTrade.result > 0 ? "+" : "-"}$
                    {Math.abs(selectedTrade.result).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <strong>Percentage:</strong>
                  <span>{selectedTrade.percent}%</span>
                </div>
                <div className="flex justify-between">
                  <strong>Date:</strong>
                  <span>{selectedTrade.date}</span>
                </div>
                <div className="pt-2 border-t border-dashed border-sky-400/30">
                  <strong>Reason:</strong>
                  <p className="mt-1 text-xs opacity-80 leading-relaxed">
                    {selectedTrade.reason || "No reason provided."}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
