"use client";

import { CreditCard, Star, Lock, Zap } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useTheme } from "next-themes";

export default function PlansPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Start learning and testing with essential chart tools.",
      features: [
        "Access to real-time charts",
        "Save locally on your device",
        "Basic drawing tools",
      ],
      button: "Start Free",
      href: "/register",
      highlight: false,
    },
    {
      name: "Pro Trader",
      price: "$9.99 / month",
      description: "Ideal for serious traders who need cloud saving & synced layouts.",
      features: [
        "Cloud chart saving (via Prisma)",
        "Advanced chart settings sync",
        "Priority email support",
        "Multi-device access",
      ],
      button: "Upgrade to Pro",
      href: "/checkout/pro",
      highlight: true,
    },
    {
      name: "Elite",
      price: "$24.99 / month",
      description: "For professionals and educators with AI analytics tools.",
      features: [
        "Everything in Pro",
        "AI trade journal assistant",
        "Custom trade alerts",
        "Unlimited layouts & autosaves",
        "Exclusive Discord access",
      ],
      button: "Go Elite",
      href: "/checkout/elite",
      highlight: false,
    },
  ];

  const palette = isDark
    ? {
        bg: "linear-gradient(135deg, #0B0F14, #111827)",
        card: "#1E293B",
        text: "#E2E8F0",
        sub: "#94A3B8",
        border: "#334155",
        primary: "linear-gradient(to right, #38BDF8, #06B6D4)",
      }
    : {
        bg: "linear-gradient(135deg, #F9FAFB, #E0F2FE)",
        card: "#FFFFFF",
        text: "#1E293B",
        sub: "#64748B",
        border: "#CBD5E1",
        primary: "linear-gradient(to right, #0EA5E9, #22D3EE)",
      };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-16 transition-all duration-700"
      style={{ background: palette.bg, color: palette.text }}
    >
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-extrabold mb-10 text-center bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-cyan-300"
      >
        Choose Your Plan
      </motion.h1>

      <div className="grid md:grid-cols-3 gap-8 w-full max-w-6xl">
        {plans.map((plan, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.15 }}
            className={`relative rounded-2xl p-6 border shadow-xl backdrop-blur-xl transition-all duration-300
              ${
                plan.highlight
                  ? "bg-gradient-to-br from-sky-900/50 to-cyan-900/50 dark:shadow-[0_0_25px_rgba(56,189,248,0.25)] border-sky-500 scale-[1.02]"
                  : "bg-[rgba(255,255,255,0.7)] dark:bg-[rgba(30,41,59,0.7)] border-[rgba(203,213,225,0.2)] dark:border-[rgba(51,65,85,0.5)]"
              } hover:scale-[1.03] hover:shadow-2xl`}
          >
            {plan.highlight && (
              <div className="absolute top-3 right-3">
                <Star
                  className="text-sky-400 dark:text-cyan-300 drop-shadow-[0_0_8px_rgba(56,189,248,0.6)]"
                  size={20}
                />
              </div>
            )}

            <div className="mb-4">
              <h2
                className={`text-2xl font-bold mb-1 ${
                  plan.highlight ? "text-sky-400" : "text-gray-800 dark:text-gray-100"
                }`}
              >
                {plan.name}
              </h2>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                {plan.price}
              </p>
            </div>

            <p className="text-sm mb-5" style={{ color: palette.sub }}>
              {plan.description}
            </p>

            <ul className="space-y-2 mb-6">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <Zap
                    size={14}
                    className={`${
                      plan.highlight
                        ? "text-sky-400 dark:text-cyan-300"
                        : "text-sky-500 dark:text-sky-400"
                    }`}
                  />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <Link
              href={plan.href}
              className={`block text-center py-2.5 rounded-md font-semibold text-sm shadow-md transition-all duration-300 ${
                plan.highlight
                  ? "bg-gradient-to-r from-sky-500 to-cyan-400 text-white hover:opacity-90"
                  : "bg-gradient-to-r from-gray-200 to-gray-100 dark:from-slate-700 dark:to-slate-800 text-black dark:text-white hover:opacity-90"
              }`}
            >
              {plan.button}
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 text-center text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2">
        <Lock size={14} className="inline" />
        <span>Secure payments powered by Stripe</span>
      </div>
    </div>
  );
}
