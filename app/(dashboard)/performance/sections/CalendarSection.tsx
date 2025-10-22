"use client";

import { useTheme } from "next-themes";
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
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState<any | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = theme === "dark";
  const palette = isDark
    ? {
        bg: "radial-gradient(circle at top left, #0F172A 0%, #020617 100%)",
        card: "radial-gradient(circle at top right, #0F172A 0%, #020617 80%)",
        border: "#000000",
        text: "#E2E8F0",
        accent: "#38BDF8",
        profit: "#22C55E",
        loss: "#EF4444",
      }
    : {
        bg: "#f8fafc",
        card: "#ffffff",
        border: "#2563EB",
        text: "#1E293B",
        accent: "#2563EB",
        profit: "#16A34A",
        loss: "#DC2626",
      };

  // --- Calendar setup ---
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = currentDate.toLocaleString("default", { month: "long" });

  // Group trades
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
            background: isDark ? "#0F172A" : "#e2e8f0",
          }}
        >
          {day}
        </div>
      ))}

      {/* Day Cells */}
      {daysArray.map((day, i) => {
        const dateKey = day ? new Date(year, month, day).toDateString() : "";
        const trades = tradesByDate[dateKey] || [];
        const todayKey = new Date().toDateString();
        const isToday = dateKey === todayKey;

        return (
          <div
            key={i}
            className="flex flex-col items-center justify-start border text-center relative transition-all duration-300 hover:scale-[1.02] overflow-hidden"
            style={{
              borderColor: palette.border,
              aspectRatio: "1 / 1",
              background: day ? palette.card : "transparent",
              boxShadow: isToday
                ? `0  5px ${palette.accent}70, inset 0 0 6px ${palette.accent}50`
                : "none",
            }}
          >
            {/* === Animated Pin for Today === */}
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
               <MapPin
                    className="
                      text-blue-500 
                      drop-shadow-sm
                      w-4 h-4
                      sm:w-4 sm:h-4
                      md:w-6 md:h-6
                      lg:w-7 lg:h-7
                    "
                    style={{
                      color: palette.accent,
                    }}
                  />
              </motion.div>
            )}

            {/* === Day Number === */}
            {day && (
              <div className="text-[10px] sm:text-lg font-semibold mt-1 self-end pr-1 z-10">
                {day}
              </div>
            )}

            {/* === Trade Tags === */}
            <div className="flex flex-col items-center justify-center flex-1 gap-[2px] sm:gap-1 z-10">
              {trades.map((trade, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  className="text-[7px] sm:text-[9px] md:text-[10px] lg:text-xs px-[2px] sm:px-1.5 md:px-2 py-[1px] sm:py-[2px] rounded-md font-semibold cursor-pointer text-center leading-tight whitespace-nowrap"
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

  // --- Return Section ---
  return (
    <>
      {/* === Calendar Card === */}
      <motion.div
        className="rounded-2xl p-3 sm:p-4 md:p-6 border shadow-lg w-full max-w-6xl mx-auto transition-all duration-300"
        style={{
          background: palette.card,
          borderColor: palette.border,
          color: palette.text,
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between border-b pb-2 mb-3"
          style={{ borderColor: palette.border }}
        >
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold uppercase">
            {monthName} {year}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentDate(new Date(year, month - 1))}
              className="px-2 py-1 border rounded text-xs sm:text-sm"
              style={{ color: palette.accent, borderColor: palette.border }}
            >
              Prev
            </button>
            <button
              onClick={() => setCurrentDate(new Date(year, month + 1))}
              className="px-2 py-1 border rounded text-xs sm:text-sm"
              style={{ color: palette.accent, borderColor: palette.border }}
            >
              Next
            </button>
            <button
              onClick={() => setIsFullScreen(true)}
              className="p-2 border rounded hover:scale-110 transition-transform"
              style={{ color: palette.accent, borderColor: palette.border }}
            >
              <Maximize2 size={18} />
            </button>
          </div>
        </div>

        <CalendarGrid />
      </motion.div>

      {/* === Fullscreen Mode === */}
      <AnimatePresence>
        {isFullScreen && (
          <motion.div
            className="fixed inset-0 z-[9998] flex items-center justify-center backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              background: isDark
                ? "rgba(0,0,0,0.9)"
                : "rgba(255,255,255,0.9)",
            }}
          >
            <div
              className="relative w-full h-full flex items-center justify-center"
              style={{ background: "transparent" }}
            >
              <button
                onClick={() => setIsFullScreen(false)}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full"
                style={{
                  color: palette.accent,
                  background: "rgba(255,255,255,0.05)",
                }}
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

      {/* === Trade Modal === */}
      <AnimatePresence>
        {selectedTrade && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedTrade(null)}
            style={{
              background: isDark
                ? "rgba(0,0,0,0.6)"
                : "rgba(255,255,255,0.6)",
            }}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-[90%] max-w-md sm:max-w-lg rounded-2xl p-4 sm:p-8 border shadow-2xl relative"
              style={{
                background: palette.card,
                borderColor: palette.border,
                color: palette.text,
              }}
            >
              <button
                onClick={() => setSelectedTrade(null)}
                className="absolute top-3 right-3 p-2 rounded-full"
                style={{
                  color: palette.accent,
                  background: "rgba(255,255,255,0.05)",
                }}
              >
                <X size={18} />
              </button>

              <h2
                className="text-lg sm:text-xl font-semibold mb-4 text-center"
                style={{ color: palette.accent }}
              >
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
                <div className="pt-2 border-t border-dashed">
                  <strong>Reason:</strong>
                  <p className="mt-1 text-xs opacity-80 leading-relaxed">
                    {selectedTrade.reason}
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
