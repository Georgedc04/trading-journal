"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Megaphone, X, Sparkles } from "lucide-react";

export default function DashboardAnnouncements() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [hasNew, setHasNew] = useState(false);

  useEffect(() => {
    // Later replace this with: fetch("/api/announcements")
    const stored = JSON.parse(localStorage.getItem("announcements") || "[]");
    setAnnouncements(stored);

    if (stored.length > 0) setHasNew(true);
  }, []);

  const handleOpen = () => {
    setOpen(true);
    setHasNew(false);
  };

  return (
    <>
     {/* === Floating Notification Icon === */}
            <motion.button
            onClick={handleOpen}
            whileHover={{ scale: 1.08 }}
            className="fixed bottom-6 right-6 p-4 rounded-full z-50 
                        backdrop-blur-2xl bg-[#0B0F14]/70 border border-cyan-400/20 
                        shadow-[0_0_5px_rgba(56,189,248,0.25)] transition-all 
                        hover:shadow-[0_0_5px_rgba(56,189,248,0.4)]"
            >
            <Megaphone size={22} className="text-cyan-300 drop-shadow-[0_0_8px_rgba(56,189,248,0.6)]" />

            {/* ✅ Sticker (outer-colored glow ping) */}
            {hasNew && (
                <>
                <span className="absolute top-1 right-1 w-3 h-3 rounded-full bg-gradient-to-r from-cyan-400 to-sky-500 shadow-[0_0_10px_rgba(56,189,248,0.8)]"></span>
                <span className="absolute top-1 right-1 w-3 h-3 rounded-full bg-gradient-to-r from-cyan-400 to-sky-500 animate-ping opacity-70"></span>
                </>
            )}
            </motion.button>


      {/* === Notification Panel === */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-20 right-6 w-80 sm:w-96 bg-[#0E1522]/95 border border-cyan-400/20 rounded-2xl p-5 shadow-[0_0_25px_rgba(56,189,248,0.2)] backdrop-blur-2xl z-50"
          >
            {/* === Header === */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Megaphone className="text-cyan-400 w-5 h-5" />
                <h2 className="text-sm font-semibold text-cyan-300">
                  Announcements
                </h2>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-cyan-300 transition"
              >
                <X size={16} />
              </button>
            </div>

            {/* === Content === */}
            {announcements.length > 0 ? (
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {announcements.map((a, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border border-cyan-400/10 rounded-lg p-3 bg-[#111827] hover:bg-cyan-400/5 transition-all"
                  >
                    <h3 className="text-sm font-semibold text-cyan-300">
                      {a.title}
                    </h3>
                    <p className="text-gray-300 text-xs mt-1">{a.message}</p>
                    <p className="text-[11px] text-gray-500 mt-1">📅 {a.date}</p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400 py-6 text-sm">
                No announcements yet 🎯
              </div>
            )}

            {/* === Glow Line === */}
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="mt-4 h-[2px] w-full bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-400 rounded-full"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
