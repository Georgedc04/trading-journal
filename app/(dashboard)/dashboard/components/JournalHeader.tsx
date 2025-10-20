"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Trash2, PlusCircle, Settings, Edit3, X } from "lucide-react";
import { useTheme } from "next-themes";
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
  const { theme } = useTheme();
  const [showPopup, setShowPopup] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState("");

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

  // 🎨 Better color system
  const isDark = theme === "dark";
  const textColor = isDark ? "text-gray-100" : "text-gray-900";
  const bgColor = isDark ? "bg-[#101826]" : "bg-white";
  const cardBg = isDark ? "bg-[#182030]" : "bg-white";
  const inputBg = isDark ? "bg-[#24324d]" : "bg-gray-100";
  const borderColor = isDark ? "border-gray-600" : "border-gray-300";

  return (
    <header className="flex flex-col gap-4 w-full relative">
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
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium shadow transition-all duration-200"
        >
          <Settings size={16} />
          Journal Options
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
              className={`${cardBg} ${textColor} ${borderColor} border rounded-2xl shadow-lg 
                w-[95%] max-w-[380px] p-5 flex flex-col gap-4 transition-all duration-300 
                scale-100 hover:scale-[1.01]`}
                style={{
                    boxShadow: isDark
                    ? "0 8px 20px rgba(0,0,0,0.5)"
                    : "0 6px 16px rgba(0,0,0,0.1)",
                }}>

              <h2 className="text-lg font-semibold text-center mb-2">
                <span className="font-semibold text-sky-400">
                {(() => {
                const current = journals.find((j: any) => j.id === selectedJournal);
                if (!current) return "Unknown";
                const account = current.accountName ? ` (${current.accountName})` : "";
                return `${current.name}${account}`;
                })()}
            </span>
              </h2>

              {/* Dropdown */}
              {journals.length > 0 ? (
                <div className="relative">
                  <select
                    value={selectedJournal || ""}
                    onChange={(e) => setSelectedJournal(Number(e.target.value))}
                    className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium shadow transition-all `}
                  >
                    {journals.map((j: any) => (
                      <option
                        key={j.id}
                        value={j.id}
                        className={`${
                          isDark
                            ? "bg-[#24324d] text-gray-100"
                            : "bg-white text-gray-900"
                        }`}
                      >
                        {j.name}
                      </option>
                    ))}
                  </select>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
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
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium shadow transition-all"
                >
                  <PlusCircle size={16} /> Add Journal
                </button>

                <button
                  onClick={() => {
                    if (!selectedJournal) return;
                    const current = journals.find(
                      (j: any) => j.id === selectedJournal
                    );
                    setEditName(current?.name || "");
                    setShowEditModal(true);
                    setShowPopup(false);
                  }}
                  disabled={!selectedJournal}
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium shadow transition-all disabled:opacity-50 ${
                    isDark
                      ? "bg-yellow-400 hover:bg-yellow-500 text-black"
                      : "bg-yellow-400 hover:bg-yellow-500 text-black"
                  }`}
                >
                  <Edit3 size={16} /> Edit Journal
                </button>

                <button
                  onClick={() =>
                    selectedJournal && handleDeleteJournal(selectedJournal)
                  }
                  disabled={!selectedJournal || saving}
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500 hover:bg-sky-600/50 text-red-500 text-sm font-medium shadow transition-all`}
                >
                  <Trash2 size={16} />
                  {saving ? "Deleting..." : "Delete Journal"}
                </button>

                <button
                  onClick={() => setShowPopup(false)}
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border ${borderColor} ${
                    isDark
                      ? "hover:bg-[#24324d] text-gray-100"
                      : "hover:bg-gray-100 text-gray-900"
                  } text-sm font-medium transition-all`}
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
            className={`${cardBg} ${borderColor} border rounded-2xl shadow-2xl w-[90%] max-w-sm p-6 ${textColor}`}
          >
            <h2 className="text-lg font-semibold mb-3 text-center">
              Rename Journal
            </h2>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className={`w-full p-2 mb-4 rounded-md border ${borderColor} ${inputBg} text-sm focus:ring-2 focus:ring-sky-500`}
              placeholder="Enter new name..."
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowEditModal(false)}
                className={`px-4 py-2 rounded-md border ${borderColor} ${
                  isDark
                    ? "hover:bg-[#24324d] text-gray-100"
                    : "hover:bg-gray-100 text-gray-900"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleEditJournal}
                disabled={saving}
                className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-md"
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
