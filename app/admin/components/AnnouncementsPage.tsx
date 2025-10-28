"use client";

import { useState, useEffect } from "react";
import AnnouncementModal from "./AnnouncementModal";
import { Plus } from "lucide-react";

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Later replace with API: /api/admin/announcements
    const stored = JSON.parse(localStorage.getItem("announcements") || "[]");
    setAnnouncements(stored);
  }, []);

  const handleAdd = (newItem: any) => {
    const updated = [newItem, ...announcements];
    setAnnouncements(updated);
    localStorage.setItem("announcements", JSON.stringify(updated));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-cyan-300">Announcements</h2>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-4 py-2 rounded-md transition-all"
        >
          <Plus size={16} /> New Announcement
        </button>
      </div>

      {announcements.length > 0 ? (
        <div className="space-y-4">
          {announcements.map((a, i) => (
            <div
              key={i}
              className="border border-cyan-400/10 bg-[#111827] rounded-lg p-4 shadow hover:shadow-cyan-400/10 transition"
            >
              <h3 className="text-cyan-300 font-semibold">{a.title}</h3>
              <p className="text-gray-300 text-sm mt-1">{a.message}</p>
              <p className="text-xs text-gray-500 mt-2">
                Posted on {a.date} by Admin
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No announcements yet.</p>
      )}

      {open && <AnnouncementModal closeModal={() => setOpen(false)} onAdd={handleAdd} />}
    </div>
  );
}
