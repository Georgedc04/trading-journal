"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Shield, TrendingUp } from "lucide-react";

export default function Logo({ isDark }: { isDark: boolean }) {
  return (
    <Link href="/" passHref>
      <motion.div
        whileHover={{ scale: 1.05, rotate: 1 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 200, damping: 12 }}
        className="flex items-center gap-2 select-none cursor-pointer"
      >
        {/* === Glowing Icon === */}
        <div
          className={`relative p-3 rounded-xl shadow-lg overflow-hidden ${
            isDark
              ? "bg-gradient-to-br from-emerald-400 via-sky-400 to-cyan-300"
              : "bg-gradient-to-br from-blue-600 via-sky-400 to-cyan-400"
          }`}
        >
          {/* Subtle glow ring */}
          <motion.div
            className="absolute inset-0 rounded-xl blur-lg opacity-70"
            style={{
              background: isDark
                ? "radial-gradient(circle at 30% 30%, rgba(56,189,248,0.4), transparent)"
                : "radial-gradient(circle at 30% 30%, rgba(59,130,246,0.4), transparent)",
            }}
            animate={{ opacity: [0.6, 0.9, 0.6], scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          />

          {/* Icon center */}
          <div className="relative z-10 text-white flex items-center justify-center">
            <Shield className="w-5 h-5" strokeWidth={2.5} />
          </div>
        </div>

        {/* === Brand Text === */}
        <div className="flex flex-col leading-tight">
          <motion.h1
            className={`font-extrabold text-[1.8rem] sm:text-3xl tracking-tight bg-clip-text text-transparent ${
              isDark
                ? "bg-gradient-to-r from-emerald-400 via-sky-400 to-cyan-300"
                : "bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400"
            }`}
          >
            DC Trades
          </motion.h1>

          {/* Subtitle line */}
          <motion.span
            className={`text-xs sm:text-sm font-medium ${
              isDark ? "text-slate-400" : "text-gray-500"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Secure • Smart • Profitable
          </motion.span>
        </div>

        {/* === Decorative arrow === */}
        <motion.div
          className="ml-1 text-sky-400"
          animate={{ y: [0, -2, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        >
          <TrendingUp className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </Link>
  );
}
