"use client";
import { motion } from "framer-motion";

export default function UpgradeModal({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="bg-[#0B0F14] text-gray-100 rounded-2xl p-6 shadow-xl border border-cyan-500/30 max-w-sm w-full text-center"
      >
        <h2 className="text-lg font-bold mb-2 text-cyan-400">
          Upgrade Required
        </h2>
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
