"use client"

import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from "@fullcalendar/interaction"
import { Maximize2, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { COLORS } from "@/lib/TradeCalender"

interface TradeCalendarProps {
  trades: {
    date: string
    result: number
    reason?: string
  }[]
  accountSize?: number
}

export default function TradeCalendarPro({
  trades,
  accountSize = 10000,
}: TradeCalendarProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [selectedTrade, setSelectedTrade] = useState<any | null>(null)

  useEffect(() => setMounted(true), [])
  if (!mounted) return <div style={{ height: "70vh" }} />

  const isDark = theme === "dark"
  const palette = isDark ? COLORS.dark : COLORS.light

  const events = trades.map((t) => ({
    title: `${t.result > 0 ? "🟢 Profit" : "🔴 Loss"}\nView Trade`,
    start: t.date,
    allDay: true,
    backgroundColor: "transparent",
    borderColor: "transparent",
    textColor: t.result > 0 ? palette.profit : palette.loss,
    extendedProps: {
      profit: t.result,
      reason: t.reason || "No reason provided",
      percent: ((t.result / accountSize) * 100).toFixed(2),
      date: new Date(t.date).toISOString().split("T")[0],
    },
  }))

  const handleEventClick = (info: any) => {
    const { profit, reason, percent, date } = info.event.extendedProps
    setSelectedTrade({ profit, reason, percent, date })
  }

  const calendarView = (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full h-full"
    >
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        height="100%"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "",
        }}
        events={events}
        eventClick={handleEventClick}
        eventDisplay="block"
      />
    </motion.div>
  )

  return (
    <>
      {/* === Main Calendar Card === */}
      <motion.div
        className="rounded-xl shadow-lg p-6 w-full max-w-6xl mx-auto border relative overflow-hidden"
        style={{
          background: palette.bg,
          borderColor: palette.border,
          color: palette.text,
          boxShadow: `0 4px 30px ${palette.cardGlow}`,
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2
            className="text-lg sm:text-xl font-semibold"
            style={{ color: palette.accent }}
          >
            Trade Performance Calendar
          </h2>

          <button
            onClick={() => setIsFullScreen(true)}
            className="p-2 rounded-lg border hover:scale-105 transition-transform duration-300"
            style={{
              borderColor: palette.border,
              color: palette.accent,
              background: "transparent",
            }}
          >
            <Maximize2 size={18} />
          </button>
        </div>

        <div className="w-full h-[70vh]">{calendarView}</div>
      </motion.div>

      {/* === Fullscreen Mode === */}
      {isFullScreen && (
        <motion.div
          className="fixed inset-0 z-[9998] flex flex-col items-center justify-center p-6 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          style={{
            background: isDark ? "rgba(0,0,0,0.9)" : "rgba(255,255,255,0.9)",
            color: palette.text,
          }}
        >
          <button
            onClick={() => setIsFullScreen(false)}
            className="absolute top-6 right-6 p-2 rounded-full hover:scale-110 transition-transform duration-300"
            style={{
              color: palette.accent,
              background: isDark
                ? "rgba(255,255,255,0.1)"
                : "rgba(0,0,0,0.05)",
            }}
          >
            <X size={20} />
          </button>

          <h3
            className="text-lg sm:text-xl font-semibold mb-4"
            style={{ color: palette.accent }}
          >
            Fullscreen Calendar
          </h3>

          <div
            className="w-full h-[85vh] rounded-xl border overflow-hidden"
            style={{
              borderColor: palette.border,
              background: palette.bg,
              boxShadow: `0 0 25px ${palette.cardGlow}`,
            }}
          >
            {calendarView}
          </div>
        </motion.div>
      )}

      {/* === Trade Detail Modal === */}
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
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              className="w-[90%] max-w-lg rounded-2xl p-6 sm:p-8 border shadow-2xl"
              style={{
                background: palette.surface,
                borderColor: palette.border,
                boxShadow: `0 0 25px ${palette.cardGlow}`,
                color: palette.text,
              }}
            >
              <button
                onClick={() => setSelectedTrade(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:scale-110 transition-transform"
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

              <div className="space-y-3 text-sm sm:text-base">
                <div className="flex justify-between items-center">
                  <strong>Status:</strong>
                  <span
                    className="font-semibold"
                    style={{
                      color:
                        selectedTrade.profit > 0
                          ? palette.profit
                          : palette.loss,
                    }}
                  >
                    {selectedTrade.profit > 0 ? "🟢 Profit" : "🔴 Loss"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <strong>Amount:</strong>
                  <span
                    className="font-semibold"
                    style={{
                      color:
                        selectedTrade.profit > 0
                          ? palette.profit
                          : palette.loss,
                    }}
                  >
                    {selectedTrade.profit > 0 ? "+" : "-"}$
                    {Math.abs(selectedTrade.profit).toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <strong>Percentage:</strong>
                  <span>{selectedTrade.percent}%</span>
                </div>

                <div className="flex justify-between items-center">
                  <strong>Date:</strong>
                  <span>{selectedTrade.date}</span>
                </div>

                <div className="pt-2">
                  <strong>Reason:</strong>
                  <p className="mt-1 text-sm opacity-80 leading-relaxed border-t border-dashed pt-2">
                    {selectedTrade.reason}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === Calendar Styles === */}
      <style jsx global>{`
        .fc .fc-toolbar-title {
          color: ${palette.accent};
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .fc-col-header-cell {
          background: ${isDark
            ? "rgba(56,189,248,0.05)"
            : "rgba(37,99,235,0.05)"};
          color: ${palette.accent};
          font-weight: 600;
          padding: 10px 0;
          border-bottom: 1px solid ${palette.border};
          text-transform: uppercase;
          font-size: 0.8rem;
          letter-spacing: 1px;
        }

        .fc-daygrid-day {
          border: none;
          border-radius: 12px;
          background: ${isDark
            ? "rgba(15,23,42,0.85)"
            : "rgba(255,255,255,0.95)"};
          transition: all 0.3s ease;
          box-shadow: inset 0 0 0 1px ${palette.border};
        }

        .fc-daygrid-day:hover {
          background: ${isDark
            ? "rgba(56,189,248,0.08)"
            : "rgba(37,99,235,0.08)"};
          box-shadow: 0 0 10px ${palette.cardGlow};
          transform: scale(1.01);
        }

        .fc-daygrid-day-number {
          color: ${palette.text};
          font-weight: 500;
          font-size: 0.9rem;
        }

        .fc-event {
          border-radius: 10px !important;
          font-weight: 600;
          padding: 5px 8px !important;
          font-size: 0.8rem;
          text-align: center;
          background: ${isDark
            ? "rgba(56,189,248,0.08)"
            : "rgba(37,99,235,0.08)"} !important;
          border: 1px solid ${palette.border} !important;
          box-shadow: 0 2px 10px ${palette.cardGlow};
          transition: all 0.25s ease;
          cursor: pointer !important;
        }

        .fc-event:hover {
          transform: scale(1.03);
          background: ${isDark
            ? "rgba(56,189,248,0.12)"
            : "rgba(37,99,235,0.12)"} !important;
          box-shadow: 0 0 15px ${palette.cardGlow};
        }

        .fc-theme-standard .fc-scrollgrid {
          background: ${palette.bg};
          border: none;
          border-radius: 16px;
        }

        .fc-day-today {
          background: ${isDark
            ? "rgba(56,189,248,0.1)"
            : "rgba(37,99,235,0.1)"} !important;
          box-shadow: inset 0 0 0 2px ${palette.border} !important;
          border-radius: 12px !important;
        }
      `}</style>
    </>
  )
}
