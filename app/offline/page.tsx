"use client";

import { motion } from "framer-motion";
import { WifiOff, RefreshCcw } from "lucide-react";

export default function OfflinePage() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#0B0F14] text-gray-100 p-6 text-center">
      {/* === Icon === */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="p-4 rounded-full bg-[#0E1723] border border-cyan-400/20 shadow-[0_0_25px_rgba(56,189,248,0.1)]"
      >
        <WifiOff size={60} className="text-cyan-400" />
      </motion.div>

      {/* === Title === */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="text-3xl font-bold mt-6 bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent"
      >
        Network Connection Lost
      </motion.h1>

      {/* === Description === */}
      <p className="text-gray-400 text-sm mt-2 max-w-md">
        You appear to be offline. Please check your internet connection and try again.
      </p>

      {/* === Retry Button === */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
        onClick={handleRetry}
        className="flex items-center gap-2 mt-6 px-5 py-2.5 rounded-lg bg-cyan-500/90 hover:bg-cyan-400 text-white font-medium transition shadow-[0_0_10px_rgba(56,189,248,0.4)] hover:shadow-[0_0_15px_rgba(56,189,248,0.6)]"
      >
        <RefreshCcw size={18} />
        Try Again
      </motion.button>

      {/* === Tip === */}
      <p className="text-xs text-gray-500 mt-4">
        If the issue persists, please contact{" "}
        <a
          href="mailto:support@dctrades.vercel.app"
          className="text-cyan-300 underline hover:text-cyan-200"
        >
          support@dctrades.vercel.app
        </a>
      </p>

      {/* === Footer === */}
      <footer className="mt-12 text-xs text-gray-500">
        © {new Date().getFullYear()} DC Trades — Secure • Smart • Professional
      </footer>
    </main>
  );
}
