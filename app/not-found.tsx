"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Home, HelpCircle } from "lucide-react";

export default function NotFoundPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#0B0F14] text-gray-100 p-6 text-center">
      {/* === Animated Title === */}
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-7xl font-extrabold bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_0_1px_rgba(56,189,248,0.5)]"
      >
        404
      </motion.h1>

      {/* === Subtitle === */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="text-lg text-gray-400 mt-3"
      >
        Oops! The page you’re looking for doesn’t exist.
      </motion.p>

      <p className="text-sm text-gray-500 mt-1">
        It might have been moved, renamed, or removed.
      </p>

      {/* === Action Buttons === */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.3 }}
        className="flex flex-wrap justify-center gap-4 mt-8"
      >
        <Link
          href="/"
          className="flex items-center gap-2 px-5 py-2.5 border-2 border-cyan-500/50 hover:bg-cyan-400/10 text-white font-medium rounded-lg transition "
        >
          <Home size={18} />
          Back Home
        </Link>

        <Link
          href="/contact"
          className="flex items-center gap-2 px-5 py-2.5 bg-[#101828] border border-cyan-400/30 text-gray-300 hover:text-cyan-300 hover:border-cyan-300 transition rounded-lg"
        >
          <HelpCircle size={18} />
          Contact Support
        </Link>
      </motion.div>

      {/* === Footer === */}
      <footer className="mt-12 text-xs text-gray-500">
        © {new Date().getFullYear()} DC Trades — Secure • Smart • Professional
      </footer>
    </main>
  );
}
