"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Trash2, PlusCircle, Settings, Edit3, X } from "lucide-react";
import JournalModal from "./JournalModal";

export default function JournalHeader({
  user,
  journals = [],
  selectedJournal,
  setSelectedJournal,
  refreshJournals,
  setToast,
  loading = false,
}: any) {
  const [showPopup, setShowPopup] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState("");

  const palette = {
    bg: "linear-gradient(145deg, #0B0F14, #111827)",
    card: "#111827",
    text: "#E2E8F0",
    accent: "#38BDF8",
    border: "rgba(56,189,248,0.25)",
    shadow: "0 0 25px rgba(56,189,248,0.15)",
  };

  // 🗑️ Delete Journal
  const handleDeleteJournal = async (id: number) => {
    if (!confirm("Are you sure you want to delete this journal?")) return;
    try {
      setSaving(true);
      const res = await fetch(`/api/journals/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete journal");
      await refreshJournals();

      const remaining = journals.filter((j: any) => j.id !== id);
      setSelectedJournal(remaining.length > 0 ? remaining[0].id : null);
      setToast("🗑️ Journal deleted!");
      setShowPopup(false);
    } catch (err) {
      console.error("Delete Journal Error:", err);
      alert("Error deleting journal.");
    } finally {
      setSaving(false);
    }
  };

  // ✏️ Edit Journal
  const handleEditJournal = async () => {
    if (!editName.trim() || !selectedJournal) return alert("Enter a new name");
    try {
      setSaving(true);
      const res = await fetch(`/api/journals/${selectedJournal}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName }),
      });
      if (!res.ok) throw new Error("Failed to update journal");
      await refreshJournals();

      setToast("✏️ Journal renamed!");
      setShowEditModal(false);
    } catch (err) {
      console.error(err);
      alert("Failed to rename journal");
    } finally {
      setSaving(false);
    }
  };

  return (
    <header className="flex flex-col gap-4 w-full relative text-slate-200">
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col"
      >
        <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
          Welcome back, {user?.firstName || "Trader"} 👋
        </h1>

        {selectedJournal && (
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-sm sm:text-base mt-1 text-gray-400"
          >
            Active Journal:{" "}
            <span className="font-semibold text-sky-400">
              {(() => {
                const current = journals.find((j: any) => j.id === selectedJournal);
                if (!current) return "Unknown";
                const account = current.accountName ? ` (${current.accountName})` : "";
                return `${current.name}${account}`;
              })()}
            </span>
          </motion.p>
        )}
      </motion.div>

      {/* Button */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowPopup(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-cyan-400 hover:opacity-90 text-white text-sm font-medium shadow-md transition-all"
        >
          <Settings size={16} /> Journal Options
        </button>
      </div>

      {/* === Popup === */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          >
            <div
              className="rounded-2xl border shadow-lg w-[95%] max-w-[380px] p-5 flex flex-col gap-4 transition-all duration-300 scale-100 hover:scale-[1.01]"
              style={{
                background: palette.card,
                borderColor: palette.border,
                color: palette.text,
                boxShadow: palette.shadow,
              }}
            >
              <h2 className="text-lg font-semibold text-center mb-2 text-sky-400">
                {(() => {
                  const current = journals.find((j: any) => j.id === selectedJournal);
                  if (!current) return "Unknown";
                  const account = current.accountName ? ` (${current.accountName})` : "";
                  return `${current.name}${account}`;
                })()}
              </h2>

              {/* Dropdown */}
              {journals.length > 0 ? (
                <div className="relative">
                  <select
                    value={selectedJournal || ""}
                    onChange={(e) => setSelectedJournal(Number(e.target.value))}
                    className="w-full px-4 py-2 rounded-lg bg-[#0F172A] border border-sky-500/30 text-slate-200 text-sm focus:ring-2 focus:ring-sky-400"
                  >
                    {journals.map((j: any) => (
                      <option key={j.id} value={j.id} className="bg-slate-800 text-slate-100">
                        {j.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <p className="text-sm italic text-center text-gray-400">
                  No journals yet — create one below
                </p>
              )}

              {/* Buttons */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    setShowModal(true);
                    setShowPopup(false);
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-cyan-400 hover:opacity-90 text-white text-sm font-medium shadow transition-all"
                >
                  <PlusCircle size={16} /> Add Journal
                </button>

                <button
                  onClick={() => {
                    if (!selectedJournal) return;
                    const current = journals.find((j: any) => j.id === selectedJournal);
                    setEditName(current?.name || "");
                    setShowEditModal(true);
                    setShowPopup(false);
                  }}
                  disabled={!selectedJournal}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium shadow transition-all bg-yellow-400 hover:bg-yellow-500 text-black disabled:opacity-50"
                >
                  <Edit3 size={16} /> Edit Journal
                </button>

                <button
                  onClick={() => selectedJournal && handleDeleteJournal(selectedJournal)}
                  disabled={!selectedJournal || saving}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-rose-600 to-red-500 hover:opacity-90 text-white text-sm font-medium shadow transition-all"
                >
                  <Trash2 size={16} />
                  {saving ? "Deleting..." : "Delete Journal"}
                </button>

                <button
                  onClick={() => setShowPopup(false)}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-sky-400/30 hover:bg-sky-400/10 text-slate-200 text-sm font-medium transition-all"
                >
                  <X size={16} /> Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Modal */}
      {showModal && (
        <JournalModal
          closeModal={() => setShowModal(false)}
          refreshJournals={refreshJournals}
          setToast={setToast}
        />
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div
            className="border rounded-2xl shadow-2xl w-[90%] max-w-sm p-6"
            style={{
              background: palette.card,
              borderColor: palette.border,
              boxShadow: palette.shadow,
              color: palette.text,
            }}
          >
            <h2 className="text-lg font-semibold mb-3 text-center text-sky-400">
              Rename Journal
            </h2>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full p-2 mb-4 rounded-md border border-sky-400/30 bg-[#0F172A] text-sm text-slate-200 focus:ring-2 focus:ring-sky-500"
              placeholder="Enter new name..."
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 rounded-md border border-sky-400/30 hover:bg-sky-400/10 text-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleEditJournal}
                disabled={saving}
                className="px-4 py-2 bg-gradient-to-r from-sky-500 to-cyan-400 hover:opacity-90 text-white rounded-md"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
