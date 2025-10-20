"use client";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import { FaBrain, FaChartLine, FaWallet, FaCrown } from "react-icons/fa";

export default function SkillJourney({ isDark }: { isDark: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 90%", "end 80%"],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 25 });
  const pathLength = useTransform(smoothProgress, [0, 1], [0, 1]);
  const orbY = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  // 🎨 Dynamic Palette
  const palette = isDark
    ? {
        frame: "from-sky-400/80 to-cyan-400/40",
        textMain: "text-cyan-300",
        textSoft: "text-gray-300",
        cardBg: "bg-slate-900/40",
        border: "border-cyan-400/20",
        glow: "rgba(56,189,248,0.8)",
        snakeStart: "#38BDF8",
        snakeMid: "#22D3EE",
        snakeEnd: "#06B6D4",
      }
    : {
        frame: "from-blue-500/90 to-orange-400/60",
        textMain: "text-blue-700",
        textSoft: "text-gray-700",
        cardBg: "bg-white/60",
        border: "border-blue-400/20",
        glow: "rgba(37,99,235,0.6)",
        snakeStart: "#2563EB",
        snakeMid: "#38BDF8",
        snakeEnd: "#F59E0B",
      };

  const steps = [
    {
      icon: <FaBrain className="text-4xl" />,
      title: "Learn Smart Analysis",
      desc: "Understand price movement, risk management, and psychology — your foundation for consistent success.",
    },
    {
      icon: <FaChartLine className="text-4xl" />,
      title: "Track Every Move",
      desc: "Journal trades, visualize performance, and discover patterns to maximize your edge.",
    },
    {
      icon: <FaWallet className="text-4xl" />,
      title: "Grow Investments",
      desc: "Turn knowledge into strategy. Build a growth plan guided by analytics and data-driven decisions.",
    },
    {
      icon: <FaCrown className="text-4xl" />,
      title: "Master Discipline",
      desc: "Trade with confidence, patience, and consistency — the mindset of a professional investor.",
    },
  ];

  return (
    <section
      ref={ref}
      className="relative flex flex-col items-center justify-center py-20 sm:py-32 px-6 overflow-hidden"
    >
      {/* === Section Title === */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className={`text-4xl sm:text-5xl font-extrabold mb-16 ${palette.textMain}`}
      >
        The DC Trades Journey
      </motion.h2>

      {/* === Snake Path === */}
      <div className="relative w-full max-w-6xl h-[1200px] sm:h-[1300px]">
        <svg
          className="absolute w-full h-full pointer-events-none z-0"
          viewBox="0 0 1000 1300"
          fill="none"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="snakeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop stopColor={palette.snakeStart} offset="0%" />
              <stop stopColor={palette.snakeMid} offset="50%" />
              <stop stopColor={palette.snakeEnd} offset="100%" />
            </linearGradient>
          </defs>

          <motion.path
            d="M500 0 
              C850 180, 150 350, 500 550 
              S850 800, 500 1000 
              S150 1150, 500 1300"
            stroke="url(#snakeGradient)"
            strokeWidth="6"
            strokeLinecap="round"
            style={{ pathLength }}
          />
        </svg>

        {/* === Moving Orb === */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 w-9 h-9 rounded-full shadow-[0_0_25px_currentColor]"
          style={{
            top: orbY,
            background: `radial-gradient(circle, ${palette.glow} 25%, transparent 80%)`,
            color: palette.glow,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
        />

        {/* === Step Cards === */}
        <div className="absolute inset-0 z-10 flex flex-col justify-around py-10">
          {steps.map((s, i) => {
            const isLeft = i % 2 === 0;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                viewport={{ once: true }}
                className={`relative flex items-center ${
                  isLeft ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`max-w-[90%] sm:max-w-[520px] ${palette.cardBg} backdrop-blur-md ${palette.border} border shadow-md rounded-2xl px-8 py-6 sm:px-10 sm:py-8 transition-all duration-300 hover:scale-[1.03]`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br ${palette.frame}`}
                    >
                      {s.icon}
                    </div>
                    <div>
                      <h3 className={`font-semibold text-xl sm:text-2xl ${palette.textMain}`}>
                        {s.title}
                      </h3>
                      <p className={`text-sm sm:text-base ${palette.textSoft} mt-1 leading-relaxed`}>
                        {s.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* === Final Quote Section === */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="relative flex flex-col items-center justify-center mt-20"
      >
        {/* Glowing Aura */}
        <motion.div
          className="absolute w-80 h-80 rounded-full blur-3xl"
          style={{
            background: `radial-gradient(circle, ${palette.glow} 20%, transparent 80%)`,
          }}
          animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 6 }}
        />

        {/* Floating Crown */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="mb-4"
        >
          <motion.span
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className={`text-4xl sm:text-5xl ${palette.textMain} drop-shadow-[0_0_10px_${palette.glow}]`}
          >
            👑
          </motion.span>
        </motion.div>

        {/* Quote */}
        <p
          className={`relative z-10 text-center font-semibold text-lg sm:text-xl tracking-wide ${palette.textSoft} max-w-2xl`}
        >
          <motion.span
            animate={{ backgroundPosition: ["0% 0%", "200% 0%", "0% 0%"] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            className={`bg-gradient-to-r from-[${palette.snakeStart}] via-[${palette.snakeMid}] to-[${palette.snakeEnd}] bg-[length:200%_auto] bg-clip-text text-transparent`}
          >
            “Every great trader evolves — learning, tracking, mastering, and transforming.  
            <br />
            <span className={`font-bold ${palette.textMain}`}>DC Trades</span> is not just a tool — it’s your path to mastery.”
          </motion.span>
        </p>

        {/* Glowing Line */}
        <motion.div
          className="mt-6 h-[3px] w-32 rounded-full"
          style={{
            background: `linear-gradient(90deg, ${palette.snakeStart}, ${palette.snakeEnd})`,
          }}
          animate={{ opacity: [0.5, 1, 0.5], scaleX: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 3 }}
        />
      </motion.div>
    </section>
  );
}
