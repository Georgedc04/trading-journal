"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { SignedIn } from "@clerk/nextjs";
import { FaChartLine } from "react-icons/fa";
import { AiFillStar } from "react-icons/ai";

export default function HeroSection({ isDark }: { isDark: boolean }) {
  const palette = isDark
    ? {
        text: "#E2E8F0",
        sub: "#94A3B8",
        accent: "#38BDF8",
        glow: "rgba(56,189,248,0.2)",
      }
    : {
        text: "#1E293B",
        sub: "#64748B",
        accent: "#2563EB",
        glow: "rgba(37,99,235,0.15)",
      };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-[85vh] p-6 sm:p-10 transition-all duration-300"
      style={{ background: "transparent", color: palette.text }}
    >
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="max-w-3xl w-full text-center"
      >
        {/* === Title === */}
        <h1
          className="text-4xl sm:text-6xl font-extrabold leading-tight mb-4"
          style={{
            background: `linear-gradient(to right, ${palette.accent}, ${
              isDark ? "#34D399" : "#60A5FA"
            })`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Trade Intelligently.
          <br />
          Grow Consistently.
        </h1>

        {/* === Subtext === */}
        <p
          className="text-sm sm:text-lg leading-relaxed mb-8 max-w-xl mx-auto"
          style={{ color: palette.sub }}
        >
          <span style={{ color: palette.accent, fontWeight: 600 }}>
            DC Trades
          </span>{" "}
          helps you record, analyze, and refine your strategies — built for
          traders who want consistent growth.
        </p>

        {/* === Action Button === */}
        <SignedIn>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
            className="flex justify-center"
          >
            <Link href="/dashboard">
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: `0 0 20px ${palette.glow}`,
                }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.2 }}
                className="
                  flex items-center gap-2 sm:gap-3
                  px-5 py-2.5 sm:px-7 sm:py-3.5
                  rounded-lg sm:rounded-xl
                  font-semibold text-base sm:text-lg
                  transition-all
                "
                style={{
                  background: `linear-gradient(to right, ${palette.accent}, ${
                    isDark ? "#34D399" : "#60A5FA"
                  })`,
                  color: "#fff",
                  boxShadow: `0 0 10px ${palette.glow}`,
                }}
              >
                <FaChartLine className="text-lg sm:text-xl" />
                Launch Dashboard
                <AiFillStar className="text-yellow-400 text-base sm:text-lg animate-pulse" />
              </motion.button>
            </Link>
          </motion.div>
        </SignedIn>

        {/* === Tagline === */}
        <p
          className="mt-8 text-xs sm:text-sm tracking-wide"
          style={{ color: palette.sub }}
        >
          Powered by <span style={{ color: palette.accent }}>GK</span> Intelligence • Built for Traders
        </p>
      </motion.div>
    </div>
  );
}
