"use client";

import { motion } from "framer-motion";
import { ShieldAlert, LogIn } from "lucide-react";

export default function ForbiddenPage() {
  const handleGoBack = () => {
    window.location.href = "/dashboard";
  };

  const handleSignIn = () => {
    window.location.href = "/signin";
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#0B0F14] text-gray-100 p-6 text-center">
      {/* === Icon === */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="p-4 rounded-full bg-[#0E1723] border border-red-400/20 shadow-[0_0_25px_rgba(248,113,113,0.1)]"
      >
        <ShieldAlert size={60} className="text-red-400" />
      </motion.div>

      {/* === Title === */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="text-3xl font-bold mt-6 bg-gradient-to-r from-red-400 to-rose-300 bg-clip-text text-transparent"
      >
        Access Denied
      </motion.h1>

      {/* === Description === */}
      <p className="text-gray-400 text-sm mt-2 max-w-md">
        You don’t have permission to access this page.  
        Please contact your administrator if you believe this is an error.
      </p>

      {/* === Action Buttons === */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mt-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleGoBack}
          className="px-5 py-2.5 rounded-lg bg-cyan-500/90 hover:bg-cyan-400 text-white font-medium transition shadow-[0_0_10px_rgba(56,189,248,0.4)] hover:shadow-[0_0_15px_rgba(56,189,248,0.6)]"
        >
          Back to Dashboard
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleSignIn}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-red-400/80 hover:bg-red-500 text-white font-medium transition "
        >
          <LogIn size={18} /> 
        </motion.button>
      </div>

      {/* === Tip === */}
      <p className="text-xs text-gray-500 mt-4">
        Need help? Contact{" "}
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
