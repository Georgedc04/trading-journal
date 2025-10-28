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
import Link from "next/link";
import ComingFeatures from "@/components/ComingFeatures";
import { Calculator, GraduationCap } from "lucide-react";
import StatsWidgets from "@/components/StatsWidgets";

export default function Home() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [price, setPrice] = useState(1.085);
  const [priceUp, setPriceUp] = useState(true);

  // Prevent hydration flicker
  useEffect(() => setMounted(true), []);

  // Simulate live price tick
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
    return <div className="fixed inset-0 bg-[#0B0F14]" />;

  const isDark = theme === "dark";
  const ACTIVE = getActiveColors(true); // Force dark neon as default look

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="home"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative min-h-screen flex flex-col overflow-hidden text-[#E2E8F0]"
        style={{
          background:
            "radial-gradient(circle at 20% 20%, #0B0F14 0%, #020617 100%)",
        }}
      >
        {/* 🧭 Navbar */}
        <Navbar />

        {/* ⚡ Hero + Mockup */}
        <div className="flex flex-col lg:flex-row items-center justify-center flex-1 px-6 sm:px-10 lg:px-20 gap-10 sm:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full lg:w-[50%]"
          >
            <HeroSection  />
          </motion.div>

          <div className="relative w-full lg:w-[45%] flex justify-center">
            {/* 🔵 Glow Shadow Behind Phone */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute inset-0 flex justify-center items-center"
            >
              <div className="w-[240px] sm:w-[300px] h-[500px] sm:h-[600px] rounded-[2.5rem] blur-[80px] opacity-40 bg-cyan-400/40" />
            </motion.div>

            {/* 📱 The iPhone Mockup (on top) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
              className="relative z-10"
            >
              <IPhoneMockup price={price} priceUp={priceUp} ACTIVE={ACTIVE} />
            </motion.div>
          </div>



        </div>

        {/* 👋 Welcome Heading */}
        <div className="text-center mb-16">
          <h1 className="text-3xl font-extrabold text-cyan-300 mb-4 drop-shadow-[0_0_15px_rgba(56,189,248,0.4)]">
            Welcome to DC Trades
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto">
            The home for smart, consistent, and data-driven traders.
          </p>
        </div>
        
        {/* 📊 Stats Widgets */}
        <StatsWidgets />

        {/* 💹 Forex Calculator CTA */}
        <div className="flex flex-col items-center justify-center text-center pt-10">
          <p className="mb-6 text-slate-400 text-sm sm:text-sm max-w-md">
            Analyze your trades, calculate lot sizes, and manage risk smartly.
          </p>

            <Link href="/forex-calculator">
              <motion.button
                whileHover={{
                  scale: 1.07,
                  boxShadow: "0 0 25px rgba(56,189,248,0.4)",
                }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 200, damping: 14 }}
                className="
                  flex items-center justify-center gap-3
                  px-7 py-3.5
                  rounded-2xl
                  font-semibold text-lg tracking-wide
                  text-white
                  bg-gradient-to-r from-sky-500 via-cyan-400 to-emerald-400
                  shadow-[0_0_20px_rgba(56,189,248,0.25)]
                  hover:shadow-[0_0_30px_rgba(56,189,248,0.45)]
                  hover:opacity-95
                  active:scale-95
                  transition-all duration-300
                "
              >
                <Calculator size={22} className="drop-shadow-md" />
                Open Forex Calculator
              </motion.button>
            </Link>

        </div>

        {/* 🌐 Social Icons */}
        <SocialIcons  />


        {/* 💰 Live Price + App Preview */}
        <LiveBitcoinPrice isDark />
        <AppShowcase  />

        {/* 🚀 Coming Features */}
        <ComingFeatures  />

        {/* 🧩 Footer + FAQs */}
        <div className="mt-auto">
          <FAQSection  />
          <Footer  />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
