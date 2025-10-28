"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { PlusCircle, BookOpen } from "lucide-react";

/* -------------------- Upgrade Modal -------------------- */
function UpgradeModal({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#0B0F14] text-gray-100 rounded-2xl p-6 shadow-xl border border-cyan-500/30 max-w-sm w-full text-center"
      >
        <h2 className="text-lg font-bold mb-2 text-cyan-400">Upgrade Required</h2>
        <p className="text-gray-300 mb-5">{message}</p>

        <div className="flex justify-center gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
          >
            Close
          </button>
          <a
            href="/plans"
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold hover:opacity-90"
          >
            Upgrade Plan
          </a>
        </div>
      </motion.div>
    </div>
  );
}

/* -------------------- Main Modal -------------------- */
export default function JournalModal({ closeModal, refreshJournals, setToast }: any) {
  const [journalName, setJournalName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [saving, setSaving] = useState(false);
  const [upgradeMessage, setUpgradeMessage] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!journalName.trim() || !accountName.trim()) {
      setUpgradeMessage("Please enter both Journal Name and Account Name.");
      return;
    }

    try {
      setSaving(true);
      const res = await fetch("/api/journals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: journalName, accountName }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 403 || res.status === 409) {
          // show upgrade modal
          setUpgradeMessage(data.error);
        } else {
          setUpgradeMessage(data.error || "Error creating journal.");
        }
        return;
      }

      setToast(`✅ Journal "${data.journal.name}" for "${accountName}" created!`);
      await refreshJournals();
      closeModal();
    } catch (err) {
      console.error("Create Journal Error:", err);
      setUpgradeMessage("Error creating journal. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* === Main Modal === */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="w-[90%] max-w-md rounded-2xl shadow-2xl border border-cyan-400/20 bg-[#0B1220]/95 p-6 text-gray-100"
        >
          {/* === Header === */}
          <div className="flex items-center gap-2 mb-5">
            <PlusCircle size={22} className="text-cyan-400" />
            <h2 className="text-xl font-semibold">Create New Journal</h2>
          </div>

          {/* === Account Name === */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-300">
              Account Name
            </label>
            <div className="flex items-center gap-2">
              <BookOpen size={18} className="text-cyan-400" />
              <input
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                placeholder="Enter account name..."
                className="w-full p-2.5 rounded-md border border-cyan-400/20 bg-[#141B29] text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-cyan-400 focus:outline-none text-sm"
              />
            </div>
          </div>

          {/* === Journal Name === */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">
              Journal Name
            </label>
            <input
              type="text"
              value={journalName}
              onChange={(e) => setJournalName(e.target.value)}
              placeholder="Enter journal name..."
              className="w-full p-2.5 rounded-md border border-cyan-400/20 bg-[#141B29] text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-cyan-400 focus:outline-none text-sm"
            />
          </div>

          {/* === Buttons === */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={closeModal}
              disabled={saving}
              className="px-4 py-2 text-sm rounded-md border border-cyan-400/20 text-gray-300 hover:bg-cyan-400/10 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={saving}
              className={`px-4 py-2 text-sm font-medium rounded-md text-black shadow transition-all duration-200 ${
                saving
                  ? "bg-cyan-400 cursor-not-allowed"
                  : "bg-cyan-500 hover:bg-cyan-400"
              }`}
            >
              {saving ? "Creating..." : "Create"}
            </button>
          </div>
        </motion.div>
      </motion.div>

      {/* === Upgrade Modal === */}
      {upgradeMessage && (
        <UpgradeModal
          message={upgradeMessage}
          onClose={() => setUpgradeMessage(null)}
        />
      )}
    </>
  );
}
