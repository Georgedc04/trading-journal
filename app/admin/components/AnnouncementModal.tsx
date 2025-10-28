"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Megaphone } from "lucide-react";

export default function AnnouncementModal({
  closeModal,
  onAdd,
}: {
  closeModal: () => void;
  onAdd: (a: any) => void;
}) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (!title.trim() || !message.trim()) return alert("Please fill in all fields.");
    const newItem = {
      title,
      message,
      date: new Date().toLocaleString(),
    };
    onAdd(newItem);
    closeModal();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.25 }}
        className="w-[90%] max-w-md rounded-2xl shadow-2xl border border-cyan-400/20 bg-[#0E1522] p-6 text-gray-100"
      >
        <div className="flex items-center gap-2 mb-4">
          <Megaphone size={22} className="text-cyan-400" />
          <h2 className="text-xl font-semibold">New Announcement</h2>
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Announcement title"
            className="w-full px-3 py-2 bg-[#1a2233] border border-cyan-400/20 rounded-md focus:ring-2 focus:ring-cyan-400 outline-none text-sm"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-1">Message</label>
          <textarea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message..."
            className="w-full px-3 py-2 bg-[#1a2233] border border-cyan-400/20 rounded-md focus:ring-2 focus:ring-cyan-400 outline-none text-sm"
          />
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={closeModal}
            className="px-4 py-2 text-sm rounded-md border border-cyan-400/20 hover:bg-gray-700/30"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-semibold rounded-md bg-gradient-to-r from-sky-500 to-cyan-400 text-black hover:opacity-90"
          >
            Post
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
