"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { SignedIn } from "@clerk/nextjs";
import { FaChartLine } from "react-icons/fa";
import { AiFillStar } from "react-icons/ai";

export default function HeroSection() {
  // 🎨 Dark Neon Palette
  const palette = {
    text: "#E2E8F0",
    sub: "#94A3B8",
    accentFrom: "#34D399", // emerald green
    accentTo: "#38BDF8",   // sky blue
    glow: "rgba(56,189,248,0.25)",
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-[85vh] p-6 sm:p-10"
      style={{
        background: "transparent",
        color: palette.text,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="max-w-3xl w-full text-center"
      >
        {/* 🌌 Title */}
              <h1
            className="text-4xl sm:text-6xl font-extrabold leading-tight mb-4 text-center"
            style={{
              background:
                "linear-gradient(to right, #38BDF8, #22D3EE, #34D399)", // sky → cyan → emerald
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow:
                "0 0 1px rgba(56,189,248,0.25), 0 0 2px rgba(56,189,248,0.15)",
            }}
          >
            Jouranl Intelligently.
            <br />
            Grow Consistently.
          </h1>


        {/* 📘 Subtext */}
        <p
              className="text-sm sm:text-lg leading-relaxed mb-8 max-w-xl mx-auto text-gray-300"
            >
              <span
                className="bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent font-semibold"
              >
                DC Trades
              </span>{" "}
              helps you record, analyze, and refine your strategies — built for
              traders who want consistent growth.
            </p>


        {/* 🚀 Launch Dashboard Button */}
        <SignedIn>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex justify-center"
          >
            <Link href="/dashboard">
          <motion.button
            whileHover={{
              scale: 1.07,
              boxShadow: "0 0 25px rgba(56,189,248,0.45)",
            }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="
              flex items-center gap-3
              px-8 py-3.5
              rounded-2xl
              font-semibold text-lg tracking-wide
              text-white
              bg-gradient-to-r from-sky-500 via-cyan-400 to-emerald-400
              shadow-[0_0_20px_rgba(56,189,248,0.25)]
              hover:shadow-[0_0_30px_rgba(56,189,248,0.5)]
              hover:opacity-95
              transition-all duration-300
            "
          >
            <FaChartLine className="text-xl drop-shadow-md" />
            Launch Dashboard
            <AiFillStar className="text-black text-lg animate-pulse" />
          </motion.button>
        </Link>

          </motion.div>
        </SignedIn>

        {/* ⚡ Tagline */}
       <p className="mt-8 text-xs sm:text-sm tracking-wide text-gray-400 text-center">
          Powered by{" "}
          <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent font-semibold">
            GK
          </span>{" "}
          Intelligence • Built for Traders
        </p>
      </motion.div>
    </div>
  );
}
