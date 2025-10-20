"use client";

import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { getActiveColors } from "@/lib/colors";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import IPhoneMockup from "@/components/IPhoneMockup";
import SocialIcons from "@/components/SocialIcons";
import Footer from "@/components/Footer";
import LiveBitcoinPrice from "@/components/LiveBitcoinPrice";
import AppShowcase from "@/components/AppShowcase";
import FAQSection from "@/components/FAQSection";
import DashboardShowcase3D from "@/components/DashboardShowcase3D";
import Link from "next/link";
import ComingFeatures from "@/components/ComingFeatures";
import { Calculator, GraduationCap } from "lucide-react";

export default function Home() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [price, setPrice] = useState(1.085);
  const [priceUp, setPriceUp] = useState(true);

  // ✅ Prevent theme flash
  useEffect(() => setMounted(true), []);

  // ✅ Simulate live price
  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => {
      setPrice((prev) => {
        const change = (Math.random() - 0.5) * 0.0004;
        const newPrice = Math.max(1.08, Math.min(1.09, prev + change));
        setPriceUp(change >= 0);
        return newPrice;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [mounted]);

  if (!mounted)
    return (
      <div className="fixed inset-0 bg-[#0B0F14] dark:bg-[#F9FAFB] transition-none" />
    );

  const isDark = theme === "dark";
  const ACTIVE = getActiveColors(isDark);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={theme}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className={`relative min-h-screen flex flex-col overflow-hidden ${ACTIVE.text}`}
        style={{ background: isDark ? "#0B0F14" : "#F9FAFB" }}
      >
        {/* === Navbar === */}
        <Navbar isDark={isDark} />

        {/* === Hero + Mockup === */}
        <div className="flex flex-col lg:flex-row items-center justify-center flex-1 px-6 sm:px-10 lg:px-20 gap-10 sm:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full lg:w-[50%]"
          >
            <HeroSection isDark={isDark} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
            className="w-full lg:w-[45%]"
          >
            <IPhoneMockup
              price={price}
              priceUp={priceUp}
              ACTIVE={ACTIVE}
              isDark={isDark}
            />
          </motion.div>
        </div>
        <div className="flex flex-col items-center justify-center text-center ">
          <p className="text-gray-600 mb-8 text-lg max-w-md">
            Analyze your trades, calculate lot sizes, and manage risk smartly.
          </p>

          <Link href="/forex-calculator">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-3 px-6 py-3 rounded-xl font-semibold text-lg bg-gradient-to-r from-sky-600 to-cyan-400 text-white shadow-lg hover:opacity-90 transition"
            >
              <Calculator size={22} />
              Open Forex Calculator
            </motion.button>
          </Link>
        </div>


        <SocialIcons ACTIVE={ACTIVE} />
        <DashboardShowcase3D />

        {/* === Live Price & App Showcase === */}
        <LiveBitcoinPrice isDark={isDark} />
        <AppShowcase isDark={isDark} />

        {/* === How to Use DC Trades Button (Elegant Glow Style) === */}
        <div className="flex justify-center my-20">
          <Link href="/decree">
            <motion.button
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 220, damping: 15 }}
              className={`relative overflow-hidden px-10 py-3 text-lg font-semibold tracking-wide rounded-2xl shadow-lg flex items-center gap-2 ${
                isDark
                  ? "bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-500 text-white"
                  : "bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-white"
              }`}
              style={{
                boxShadow: isDark
                  ? "0 0 10px rgba(56,189,248,0.4)"
                  : "0 0 10px rgba(234,179,8,0.35)",
              }}
            >
              {/* animated light sweep */}
              <motion.span
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
              />

              {/* Icon + Text */}
              <span className="relative z-10 flex items-center justify-center gap-3">
                <GraduationCap className="w-6 h-6" strokeWidth={2.3} />
                <span>How to Use DC Trades</span>
              </span>
            </motion.button>
          </Link>
        </div>


        <ComingFeatures isDark={isDark} />

        {/* === Footer === */}
        <div className="mt-auto">
          <FAQSection isDark={isDark} />
          <Footer ACTIVE={ACTIVE} />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
