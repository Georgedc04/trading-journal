"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Loader2,
  AlertTriangle,
  RotateCcw,
  Trash2,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function AdminSecurityLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // ✅ Toast handler
  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  // ✅ Fetch Logs
  const fetchLogs = async (manual = false) => {
    if (manual) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await fetch("/api/admin/security", { cache: "no-store" });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to load logs");

      setLogs(data.logs || []);
      setError("");
      if (manual) showToast("success", "🔁 Logs refreshed successfully");
    } catch (err: any) {
      console.error("Fetch failed:", err);
      setError(err.message || "Server error");
      showToast("error", "⚠️ Failed to load logs");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // 🗑 Delete Logs
  const handleDeleteLogs = async () => {
    const confirmed = confirm("Are you sure you want to delete all security logs?");
    if (!confirmed) return;

    setDeleting(true);
    try {
      const res = await fetch("/api/admin/security", { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to delete logs");

      setLogs([]);
      showToast("success", "🗑 All logs deleted successfully");
    } catch (err: any) {
      console.error("Delete failed:", err);
      showToast("error", "❌ Failed to delete logs");
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  /* 🌀 Loading State */
  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-cyan-300 gap-2">
        <Loader2 className="animate-spin w-6 h-6" /> Loading Security Logs...
      </div>
    );

  return (
    <div className="relative text-gray-100">
      {/* === Toast Notification === */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg backdrop-blur-md border 
              ${
                toast.type === "success"
                  ? "bg-emerald-500/20 border-emerald-400 text-emerald-300"
                  : "bg-red-500/20 border-red-400 text-red-300"
              }`}
          >
            {toast.type === "success" ? (
              <CheckCircle size={20} className="text-emerald-400" />
            ) : (
              <XCircle size={20} className="text-red-400" />
            )}
            <span className="text-sm font-medium">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === Page Content === */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* === Header === */}
        <div className="flex flex-wrap items-center justify-between mb-6 gap-3">
          <h1 className="text-3xl font-bold text-cyan-300 flex items-center gap-2">
            <ShieldCheck size={24} /> Security Logs
          </h1>

          <div className="flex gap-3">
            {/* 🔁 Refresh */}
            <button
              onClick={() => fetchLogs(true)}
              disabled={refreshing}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-semibold transition-all ${
                refreshing
                  ? "bg-cyan-500/40 text-gray-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-sky-500 to-cyan-400 text-black hover:opacity-90"
              }`}
            >
              <RotateCcw size={16} className={refreshing ? "animate-spin" : ""} />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>

            {/* 🗑 Delete */}
            <button
              onClick={handleDeleteLogs}
              disabled={deleting}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-semibold transition-all ${
                deleting
                  ? "bg-red-600/40 text-gray-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-red-500 to-rose-500 text-white hover:opacity-90"
              }`}
            >
              <Trash2 size={16} className={deleting ? "animate-spin" : ""} />
              {deleting ? "Deleting..." : "Clear Logs"}
            </button>
          </div>
        </div>

        {/* === Logs Table === */}
        <div className="bg-[#0E1522]/90 border border-cyan-400/10 rounded-2xl shadow-xl p-6 backdrop-blur-xl">
          {error ? (
            <p className="text-red-400 text-center py-6">{error}</p>
          ) : logs.length ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-[#0F172A] text-cyan-300">
                  <tr>
                    <th className="p-3 text-left">Time</th>
                    <th className="p-3 text-left">User</th>
                    <th className="p-3 text-left">Action</th>
                    <th className="p-3 text-left">IP</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((l, i) => (
                    <motion.tr
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.02 }}
                      className="border-b border-cyan-400/10 hover:bg-cyan-400/5 transition-all"
                    >
                      <td className="p-3 text-gray-400">
                        {new Date(l.time).toLocaleString()}
                      </td>
                      <td className="p-3">{l.user}</td>
                      <td className="p-3 text-cyan-200">{l.action}</td>
                      <td className="p-3 text-gray-400">{l.ip || "—"}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-400 text-center py-6">
              <AlertTriangle className="inline mr-2" /> No security logs found.
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
