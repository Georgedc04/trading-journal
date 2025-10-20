"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Logo from "@/components/Logo";

export default function RoyalDecree() {
  const sections = [
    {
      title: "1️⃣ Create Your Account",
      text: "Register securely using Google, Apple, or your email address to begin your trading journey.",
    },
    {
      title: "2️⃣ Verify and Access",
      text: "Verify your email, sign in, and access your personalized DC Trades dashboard instantly.",
    },
    {
      title: "3️⃣ Record Every Trade",
      text: "Log profits, losses, sessions, pairs, screenshots, and trade notes. Classify them as A+, A, B or C setups for better review.",
    },
    {
      title: "4️⃣ Get Smart Insights",
      text: "DC Trades automatically analyzes your data — showing performance charts, calendars, and win-rate analytics.",
    },
    {
      title: "5️⃣ Manage Risk and Goals",
      text: "Set your account size and profit target. Let DC Trades track your growth, risk exposure, and milestones automatically.",
    },
    {
      title: "6️⃣ Learn and Improve",
      text: "Gain professional-level insights into discipline, consistency, and trade quality — built from successful traders’ principles.",
    },
    {
      title: "7️⃣ The Future Ahead",
      text: "Soon, every trader will be able to create multiple journal accounts — each for different strategies and assets.",
    },
  ];

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 py-10 relative overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at center, #f8ecd1 0%, #f6e2b9 50%, #e8c87a 100%)",
        boxShadow: "inset 0 0 80px rgba(0,0,0,0.35)",
        border: "10px solid rgba(157, 111, 31, 0.5)",
        borderRadius: "40px",
        position: "relative",
      }}
    >
      {/* Gold border glow */}
      <div
        className="absolute inset-0 pointer-events-none rounded-[40px]"
        style={{
          border: "3px double rgba(191,145,39,0.6)",
          boxShadow:
            "inset 0 0 25px rgba(0,0,0,0.3), inset 0 0 60px rgba(191,145,39,0.25)",
          mixBlendMode: "multiply",
        }}
      />

      {/* Burnt parchment edges */}
      <div
        className="absolute inset-0 rounded-[40px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 5% 5%, rgba(0,0,0,0.15) 0, transparent 20%)," +
            "radial-gradient(circle at 95% 5%, rgba(0,0,0,0.15) 0, transparent 20%)," +
            "radial-gradient(circle at 5% 95%, rgba(0,0,0,0.15) 0, transparent 20%)," +
            "radial-gradient(circle at 95% 95%, rgba(0,0,0,0.15) 0, transparent 20%)",
          opacity: 0.4,
          filter: "blur(6px)",
        }}
      />

      {/* === Scroll Content === */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-3xl w-full p-10 rounded-2xl"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,240,0.95), rgba(249,241,219,0.95))",
          boxShadow:
            "inset 0 1px 10px rgba(255,255,255,0.5), 0 8px 25px rgba(0,0,0,0.25)",
          border: "2px solid rgba(191,145,39,0.4)",
          fontFamily: `Georgia, "Times New Roman", serif`,
          color: "#3b2b11",
        }}
      >
        {/* === Header === */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center mb-10"
        >
          <div
            className="rounded-full p-4 shadow-md flex items-center justify-center"
            style={{
              background:
                "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.95), rgba(240,240,240,0.85))",
              border: "2px solid rgba(191,145,39,0.4)",
              boxShadow:
                "0 0 20px rgba(191,145,39,0.4), inset 0 2px 4px rgba(0,0,0,0.05)",
            }}
          >
            <Logo isDark={false} />
          </div>

          <h1 className="text-4xl font-serif text-[#4B2E05] text-center mt-4">
            DC Trades
          </h1>
          <p className="text-sm italic text-[#6b4e33] text-center mt-1">
            “Journal your journey, master your craft, and trade with wisdom.”
          </p>
        </motion.div>

        {/* === Main Content === */}
        <div className="space-y-5">
          {sections.map((s, i) => (
            <motion.div
              key={i}
              initial={{ x: -40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.12 }}
              className="p-4 rounded-xl border border-yellow-900/20 shadow-inner"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.9), rgba(250,245,220,0.85))",
                boxShadow:
                  "inset 0 0 4px rgba(0,0,0,0.1), 0 3px 8px rgba(0,0,0,0.15)",
              }}
            >
              <h3 className="text-lg font-semibold text-[#4b2e05] font-serif">
                {s.title}
              </h3>
              <p className="text-sm text-[#5c3b09] mt-1 leading-relaxed">
                {s.text}
              </p>
            </motion.div>
          ))}
        </div>

        {/* === Footer Seal === */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-10 flex justify-center"
        >
          <div
            className="w-[80px] h-[80px] rounded-full flex items-center justify-center"
            style={{
              background: "radial-gradient(circle, #a71c1c, #611010)",
              boxShadow:
                "0 0 20px rgba(167,28,28,0.4), inset 0 2px 6px rgba(255,255,255,0.2)",
            }}
          >
            <Image
              src="/icons/wax-seal.svg"
              alt="Wax Seal"
              width={50}
              height={50}
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
