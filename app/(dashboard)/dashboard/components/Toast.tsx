"use client";
import { motion } from "framer-motion";

export default function Toast({ message }: { message: string }) {
  if (!message) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-6 right-6 bg-gradient-to-r from-emerald-500 to-cyan-400 
      text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium"
    >
      {message}
    </motion.div>
  );
}
