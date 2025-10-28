"use client";

import { motion } from "framer-motion";
import {
  Zap,
  Brain,
  LineChart,
  PenTool,
  RotateCcw,
  Smartphone,
  Layers,
  Sparkles,
} from "lucide-react";

export default function ComingFeatures() {
  const palette = {
    frame: "from-sky-400/70 to-cyan-400/40",
    textMain: "text-gray-100",
    textSoft: "text-gray-400",
    border: "border-cyan-400/20",
    glow: "rgba(56,189,248,0.6)",
  };

  const features = [
    {
      icon: <Zap className="w-6 h-6 text-cyan-300" />,
      title: "Real-Time Broker Sync",
      desc: "Sync trades automatically from MT4, MT5, or cTrader — your analytics update live, instantly.",
    },
    {
      icon: <Brain className="w-6 h-6 text-cyan-300" />,
      title: "AI-Powered Trade Insights",
      desc: "AI reviews your trades — detecting timing flaws, risk imbalance, and emotional decisions.",
    },
    {
      icon: <PenTool className="w-6 h-6 text-cyan-300" />,
      title: "Smart Trade Entry",
      desc: "Log trades with an optimized interface — lightning-fast journaling for live sessions.",
    },
    {
      icon: <LineChart className="w-6 h-6 text-cyan-300" />,
      title: "Deep Strategy Analytics",
      desc: "Compare systems and performance metrics — visualize growth, win rates, and expectancy.",
    },
    {
      icon: <RotateCcw className="w-6 h-6 text-cyan-300" />,
      title: "Backtesting Engine",
      desc: "Simulate trades to validate strategies before going live — measure consistency and risk.",
    },
    {
      icon: <Smartphone className="w-6 h-6 text-cyan-300" />,
      title: "DC Trades Mobile App",
      desc: "Access your analytics and journals anywhere — mobile-first design with cloud sync.",
    },
    {
      icon: <Sparkles className="w-6 h-6 text-cyan-300" />,
      title: "Performance Goals System",
      desc: "Set daily, weekly, and monthly targets — track consistency and discipline effortlessly.",
    },
  ];

  return (
    <section className="relative py-28 px-6 sm:px-12 overflow-hidden">
      {/* === Background Glow === */}
      <motion.div
        className="absolute inset-0 -z-10 bg-gradient-to-br from-[#0a111b] via-[#0B1220] to-[#0e1728]"
        animate={{ opacity: [0.9, 1, 0.9] }}
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -z-10 top-1/2 left-1/2 w-[80vw] h-[80vw] rounded-full blur-[180px] opacity-10"
        style={{
          background:
            "radial-gradient(circle, rgba(56,189,248,0.25), transparent 70%)",
          transform: "translate(-50%, -50%)",
        }}
        animate={{ scale: [1, 1.05, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
      />

      {/* === Section Header === */}
      <div className="text-center max-w-3xl mx-auto mb-20">
        <motion.h2
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-4xl sm:text-4xl font-extrabold text-cyan-300 mb-4"
           style={{
              background:
                "linear-gradient(to right, #38BDF8, #22D3EE, #34D399)", // sky → cyan → emerald
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow:
                "0 0 1px rgba(56,189,248,0.25), 0 0 2px rgba(56,189,248,0.15)",
            }}
        >
          Coming Soon to DC Trades
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-gray-400 text-sm sm:text-lg leading-relaxed"
        >
          Evolving the trader’s toolkit — powered by smart design, precision
          analytics, and automation.
        </motion.p>
      </div>

      {/* === Feature Grid === */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: i * 0.07,
              duration: 0.6,
              ease: "easeOut",
            }}
            viewport={{ once: true }}
            whileHover={{
              scale: 1.03,
              boxShadow: `0 0 35px ${palette.glow}`,
            }}
            className={`relative p-[2px] rounded-2xl bg-gradient-to-br ${palette.frame} border ${palette.border} transition-all duration-300`}
          >
            <div className="rounded-2xl bg-[#0d1723]/80 backdrop-blur-xl p-6 border border-cyan-400/10 h-full flex flex-col">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2 rounded-lg bg-cyan-400/10">{feature.icon}</div>
                <h3
                  className={`text-lg sm:text-xl font-semibold tracking-wide ${palette.textMain}`}
                >
                  {feature.title}
                </h3>
              </div>
              <p
                className={`text-sm sm:text-base leading-relaxed ${palette.textSoft}`}
              >
                {feature.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* === Final Glow Footer === */}
      <motion.div
        className="absolute -z-10 bottom-0 left-1/2 w-[70vw] h-[50vw] blur-[140px] opacity-10"
        style={{
          background:
            "radial-gradient(circle, rgba(56,189,248,0.25), transparent 70%)",
          transform: "translate(-50%, 0%)",
        }}
        animate={{ opacity: [0.05, 0.15, 0.05] }}
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
      />
    </section>
  );
}
