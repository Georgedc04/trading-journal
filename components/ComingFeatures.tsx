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
} from "lucide-react";

export default function ComingFeatures({ isDark }: { isDark: boolean }) {
  const palette = isDark
    ? {
        frame: "from-sky-400/70 to-cyan-400/40",
        textMain: "text-gray-100",
        textSoft: "text-gray-100",
        border: "border-white/80",
        glow: "rgba(56,189,248,0.6)",
      }
    : {
        frame: "from-sky-400/50 to-orange-400/20",
        textMain: "text-blue-700",
        textSoft: "text-gray/90",
        border: "border-black-400/90",
        glow: "rgba(37,99,235,0.2)/50",
      };

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Real-Time Broker Sync",
      desc: "Import trades automatically from MT4, MT5, or cTrader — keep your journal and analytics updated instantly.",
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: "Multi-Journal Accounts",
      desc: "Organize multiple trading journals under one account — ideal for different strategies and brokers.",
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI-Powered Trade Feedback",
      desc: "Let AI analyze your trades — identify timing issues, risk imbalance, and behavioral patterns effortlessly.",
    },
    {
      icon: <PenTool className="w-6 h-6" />,
      title: "Direct Trade Entry",
      desc: "Record trades quickly using a clean, optimized input system — perfect for live sessions.",
    },
    {
      icon: <LineChart className="w-6 h-6" />,
      title: "Deep Strategy Analytics",
      desc: "Compare multiple strategies and evaluate win rates, expectancy, and efficiency metrics.",
    },
    {
      icon: <RotateCcw className="w-6 h-6" />,
      title: "Backtesting Tools",
      desc: "Simulate trades to test strategies — measure performance before risking real capital.",
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "DC Trades Mobile App",
      desc: "Access your journal, analytics, and trade logs anywhere with our upcoming mobile app.",
    },
  ];

  return (
    <section className="py-24 px-6 sm:px-10 relative overflow-hidden">
      {/* === Title === */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className={`text-3xl sm:text-4xl font-extrabold text-center mb-16 ${palette.textMain}`}
      >
        Coming Features
      </motion.h2>

      {/* === Floating Cards === */}
      <div className="flex flex-col items-center gap-10 relative max-w-5xl mx-auto">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.6 }}
            viewport={{ once: true }}
            className={`w-full sm:w-[85%] lg:w-[70%] ${
              i % 2 === 0 ? "self-start" : "self-end"
            }`}
          >
            <motion.div
              whileHover={{
                boxShadow: `0 0 10px ${palette.glow}`,
              }}
              transition={{ type: "spring", stiffness: 160 }}
              className={`p-[2px] rounded-2xl bg-gradient-to-br ${palette.frame} border ${palette.border} shadow-[0_0_30px_${palette.glow}]`}
            >
              <div
                className={`rounded-2xl bg-[rgba(56,189,248,0.4)] dark:bg-[rgba(56,189,248,0.4)]/50 backdrop-blur-xl border ${palette.border} p-5 flex items-start gap-4`}
              >
                {/* Icon */}
                <div
                  className={`p-2 rounded-lg ${
                    isDark ? "bg-[#0d1723]/70" : "bg-white/70"
                  } shadow-sm`}
                >
                  {feature.icon}
                </div>

                {/* Text */}
                <div>
                  <h3
                    className={`text-lg sm:text-xl font-semibold mb-1 tracking-wide ${palette.textMain}`}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className={`text-sm sm:text-base leading-relaxed ${palette.textSoft}`}
                  >
                    {feature.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* === Ambient Glow === */}
      <motion.div
        className="absolute -z-10 top-1/3 left-1/2 w-[70vw] h-[70vw] rounded-full blur-[140px] opacity-10"
        style={{
          background: isDark
            ? "radial-gradient(circle, rgba(56,189,248,0.25), transparent 70%)"
            : "radial-gradient(circle, rgba(37,99,235,0.25), transparent 70%)",
          transform: "translate(-50%, -50%)",
        }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.25, 0.1] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
      />
    </section>
  );
}
