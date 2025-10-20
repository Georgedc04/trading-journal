"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { PlusCircle, BookOpen } from "lucide-react";
import { useTheme } from "next-themes";

export default function JournalModal({
  closeModal,
  refreshJournals,
  setToast,
}: any) {
  const { theme } = useTheme();
  const [journalName, setJournalName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    if (!journalName.trim() || !accountName.trim())
      return alert("Please enter both Journal Name and Account Name.");

    try {
      setSaving(true);
      const res = await fetch("/api/journals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: journalName, accountName }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);
      setToast(`✅ Journal "${data.journal.name}" for "${accountName}" created!`);
      await refreshJournals();
      closeModal();
    } catch (err) {
      console.error("Create Journal Error:", err);
      alert("Error creating journal. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // 🎨 Theme-aware styles
  const isDark = theme === "dark";
  const bgColor = isDark ? "bg-[#18202f]" : "bg-white";
  const borderColor = isDark ? "border-gray-700" : "border-gray-300";
  const textColor = isDark ? "text-gray-100" : "text-gray-900";
  const inputBg = isDark ? "bg-[#243046]" : "bg-gray-100";

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
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className={`w-[90%] max-w-md rounded-2xl shadow-2xl border ${borderColor} ${bgColor} p-6 ${textColor}`}
      >
        {/* === Header === */}
        <div className="flex items-center gap-2 mb-5">
          <PlusCircle size={22} className="text-sky-400" />
          <h2 className="text-xl font-semibold">Create New Journal</h2>
        </div>

        {/* === Account Name === */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Account Name</label>
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-sky-400" />
            <input
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="Enter account name..."
              className={`w-full p-2.5 rounded-md border ${borderColor} ${inputBg} focus:ring-2 focus:ring-sky-400 focus:outline-none placeholder-gray-400 text-sm`}
            />
          </div>
        </div>

        {/* === Journal Name === */}
        <div>
          <label className="block text-sm font-medium mb-1">Journal Name</label>
          <input
            type="text"
            value={journalName}
            onChange={(e) => setJournalName(e.target.value)}
            placeholder="Enter journal name..."
            className={`w-full p-2.5 rounded-md border ${borderColor} ${inputBg} focus:ring-2 focus:ring-sky-400 focus:outline-none placeholder-gray-400 text-sm`}
          />
        </div>

        {/* === Buttons === */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={closeModal}
            disabled={saving}
            className={`px-4 py-2 text-sm rounded-md border ${borderColor} hover:bg-gray-500/10 transition-all`}
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={saving}
            className={`px-4 py-2 text-sm font-medium rounded-md text-white shadow transition-all duration-200 ${
              saving
                ? "bg-sky-400 cursor-not-allowed"
                : "bg-sky-500 hover:bg-sky-600"
            }`}
          >
            {saving ? "Creating..." : "Create"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
