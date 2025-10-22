"use client";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";

export default function HeaderSection({
  colors,
  journalName,
  accountName,
}: {
  colors: any;
  journalName?: string;
  accountName?: string;
}) {
  const displayName = journalName
    ? accountName
      ? `${journalName} (${accountName})`
      : journalName
    : "";

  return (
    <motion.header
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="animate-fadeInUp w-full px-3 sm:px-0 pt-8 sm:pt-0"
    >
      <div className="flex flex-wrap items-center gap-2 mb-2">
        
        <h1
          className="text-2xl sm:text-4xl font-bold bg-gradient-to-r 
          from-sky-400 to-blue-600 bg-clip-text text-transparent 
          flex flex-wrap items-center gap-2 leading-tight"
        >
          <span>
            <Activity size={22} className="text-sky-400 sm:w-6 sm:h-6" />
          </span> 
            Performance Overview
          {displayName && (
            <motion.span
              initial={{ opacity: 0, x: 5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="text-sm sm:text-lg font-semibold text-cyan-400 ml-1"
            >
              — {displayName}
            </motion.span>
          )}
        </h1>
      </div>

      <p
        className="text-xs sm:text-base leading-relaxed"
        style={{ color: colors.subText }}
      >
        Visualize your growth and analyze your trading consistency.
      </p>
    </motion.header>
  );
}
