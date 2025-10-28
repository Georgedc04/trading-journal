"use client";

import { useState, useEffect } from "react";
import AnnouncementModal from "../components/AnnouncementModal";
import { Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  // 📦 Load announcements from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("announcements") || "[]");
    setAnnouncements(stored);
  }, []);

  // 🆕 Add new announcement
  const handleAdd = (newItem: any) => {
    const updated = [
      { ...newItem, date: new Date().toLocaleString() },
      ...announcements,
    ];
    setAnnouncements(updated);
    localStorage.setItem("announcements", JSON.stringify(updated));
  };

  // 🗑️ Delete announcement
  const handleDelete = (index: number) => {
    const updated = announcements.filter((_, i) => i !== index);
    setAnnouncements(updated);
    localStorage.setItem("announcements", JSON.stringify(updated));
  };

  return (
    <div className="text-gray-100">
      {/* === Header === */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-cyan-300">Announcements</h2>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-sky-500 to-cyan-400 hover:opacity-90 text-black font-semibold px-4 py-2 rounded-md transition-all shadow-md"
        >
          <Plus size={16} /> New Announcement
        </button>
      </div>

      {/* === Announcements List === */}
      {announcements.length > 0 ? (
        <div className="space-y-4">
          <AnimatePresence>
            {announcements.map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="border border-cyan-400/10 bg-[#111827] rounded-lg p-4 shadow hover:shadow-cyan-400/10 transition relative"
              >
                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(i)}
                  className="absolute top-3 right-3 text-red-400 hover:text-red-300 transition"
                  title="Delete announcement"
                >
                  <Trash2 size={16} />
                </button>

                <h3 className="text-cyan-300 font-semibold">{a.title}</h3>
                <p className="text-gray-300 text-sm mt-1">{a.message}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Posted on {a.date || "Unknown"} by Admin
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <p className="text-gray-400 text-center mt-10">
          No announcements yet.
        </p>
      )}

      {/* === Modal === */}
      {open && (
        <AnnouncementModal
          closeModal={() => setOpen(false)}
          onAdd={handleAdd}
        />
      )}
    </div>
  );
}
