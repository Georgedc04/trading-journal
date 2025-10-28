"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FaArrowRight, FaBookReader, FaChartLine } from "react-icons/fa";
import { MdSecurity, MdOutlineIntegrationInstructions } from "react-icons/md";

export default function HowToUsePage() {
  return (
    <section className="min-h-screen bg-[#0B0F14] text-gray-200 px-6 sm:px-12 py-24">
      <div className="max-w-5xl mx-auto">
        {/* === Header === */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold text-cyan-300 mb-4">
            How to Use DC Trades
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Learn how to set up, record, and analyze your trades step-by-step.
            DC Trades is designed for traders who want consistent improvement
            through data-driven insights.
          </p>
        </motion.div>

        {/* === Step-by-Step Guide === */}
        <div className="space-y-12">
          {/* Step 1 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-[#10151F] border border-gray-800 rounded-2xl p-6 sm:p-8"
          >
            <div className="flex items-start gap-5">
              <FaBookReader className="text-cyan-400 text-2xl mt-1" />
              <div>
                <h2 className="text-xl font-semibold text-gray-100 mb-2">
                  1. Create Your Account
                </h2>
                <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                  Sign up using your email and password to create your DC Trades
                  account. Once registered, verify your email and log in to
                  access your trading dashboard.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-[#10151F] border border-gray-800 rounded-2xl p-6 sm:p-8"
          >
            <div className="flex items-start gap-5">
              <MdOutlineIntegrationInstructions className="text-cyan-400 text-2xl mt-1" />
              <div>
                <h2 className="text-xl font-semibold text-gray-100 mb-2">
                  2. Connect or Add Your Trades
                </h2>
                <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                  You can manually log trades or connect your broker (MT4, MT5,
                  cTrader — integration coming soon). Add trade details like
                  pair, entry, stop loss, take profit, and notes.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-[#10151F] border border-gray-800 rounded-2xl p-6 sm:p-8"
          >
            <div className="flex items-start gap-5">
              <FaChartLine className="text-cyan-400 text-2xl mt-1" />
              <div>
                <h2 className="text-xl font-semibold text-gray-100 mb-2">
                  3. Analyze Your Performance
                </h2>
                <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                  Explore your analytics dashboard to review win rate, average
                  return, drawdown, and equity growth. Identify strengths and
                  weak points to improve your consistency.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Step 4 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-[#10151F] border border-gray-800 rounded-2xl p-6 sm:p-8"
          >
            <div className="flex items-start gap-5">
              <MdSecurity className="text-cyan-400 text-2xl mt-1" />
              <div>
                <h2 className="text-xl font-semibold text-gray-100 mb-2">
                  4. Secure & Sync Your Data
                </h2>
                <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                  Your journal data is encrypted and safely stored in the cloud.
                  You can access it from any device — securely and instantly.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Step 5 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-[#10151F] border border-gray-800 rounded-2xl p-6 sm:p-8"
          >
            <div className="flex items-start gap-5">
              <FaArrowRight className="text-cyan-400 text-2xl mt-1" />
              <div>
                <h2 className="text-xl font-semibold text-gray-100 mb-2">
                  5. Keep Improving with AI Insights
                </h2>
                <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                  DC Trades learns from your trading behavior and provides AI-powered
                  feedback to help you refine strategies, manage risk, and reach
                  consistent profitability.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* === CTA === */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Link
            href="/dashboard"
            className="inline-flex  items-center justify-center gap-2 px-6 py-3 text-lg font-semibold rounded-xl  border-2 border-cyan-400/80 transition-all"
          >
            Get Started
            <FaArrowRight  />
          </Link>
          <p className="text-gray-400 text-sm mt-3">
            Start journaling your trades today — smart, secure, and effortless.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
