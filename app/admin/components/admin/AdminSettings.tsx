"use client";

import { motion } from "framer-motion";
import { Settings, Save } from "lucide-react";

export default function AdminSettings() {
  return (
    <div className="text-gray-100">
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

          <form className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Support Email</label>
              <input
                type="email"
                placeholder="support@dctrades.com"
                className="w-full px-3 py-2 rounded-md bg-[#111827] border border-cyan-400/10 focus:ring-2 focus:ring-cyan-400 outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Maintenance Mode</label>
              <select className="w-full px-3 py-2 rounded-md bg-[#111827] border border-cyan-400/10 focus:ring-2 focus:ring-cyan-400 outline-none text-sm">
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
