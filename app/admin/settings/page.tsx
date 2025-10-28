"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Save, CheckCircle, XCircle } from "lucide-react";

export default function AdminSettings() {
  const [email, setEmail] = useState("");
  const [maintenance, setMaintenance] = useState("Disabled");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.supportEmail) {
          setEmail(data.supportEmail);
          setMaintenance(data.maintenance ? "Enabled" : "Disabled");
        }
      })
      .catch(() => showToast("error", "⚠️ Failed to load settings"))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        supportEmail: email,
        maintenance: maintenance === "Enabled",
      }),
    });

    if (res.ok) showToast("success", "✅ Settings saved successfully");
    else showToast("error", "❌ Failed to update settings");
  };

  if (loading) return <p className="p-6 text-cyan-300">Loading settings...</p>;

  return (
    <div className="relative text-gray-100">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg backdrop-blur-md border ${
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

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold mb-6 text-cyan-300 flex items-center gap-2">
          <Settings size={24} /> Admin Settings
        </h1>

        <div className="bg-[#0E1522]/90 border border-cyan-400/10 rounded-2xl p-6 shadow-xl backdrop-blur-xl">
          <p className="text-gray-400 text-sm mb-6">
            Update global platform preferences, admin roles, and system configuration.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Support Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="support@dctrades.com"
                className="w-full px-3 py-2 rounded-md bg-[#111827] border border-cyan-400/10 focus:ring-2 focus:ring-cyan-400 outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Maintenance Mode</label>
              <select
                value={maintenance}
                onChange={(e) => setMaintenance(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-[#111827] border border-cyan-400/10 focus:ring-2 focus:ring-cyan-400 outline-none text-sm"
              >
                <option>Disabled</option>
                <option>Enabled</option>
              </select>
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-500 to-cyan-400 text-black rounded-md font-semibold hover:opacity-90 mt-4"
            >
              <Save size={16} /> Save Changes
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
