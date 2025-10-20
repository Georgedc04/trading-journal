"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function AppShowcase({ isDark }: { isDark: boolean }) {
  const palette = isDark
    ? {
        frame: "from-sky-400/80 to-cyan-400/40",
        textMain: "text-cyan-300",
        textSoft: "text-gray-300",
        border: "border-cyan-400/20",
        glow: "rgba(56,189,248,0.8)",
      }
    : {
        frame: "from-blue-500/90 to-orange-400/60",
        textMain: "text-blue-700",
        textSoft: "text-gray-700",
        border: "border-blue-400/20",
        glow: "rgba(37,99,235,0.6)",
      };

  const shots = [
    {
      src: "/screens/dashboard.png",
      title: "Intelligent Dashboard",
      desc: "Your performance overview reimagined — precision metrics, visual analytics, and data-driven insights in one view.",
      tilt: "-rotate-3",
      width: "w-[95%] sm:w-[80%] lg:w-[75%]",
      align: "self-start",
    },
    {
      src: "/screens/journal.png",
      title: "Trade Journal",
      desc: "Effortlessly log every move — smart tagging, filtering, and pattern recognition built to learn your strategy.",
      tilt: "rotate-3",
      width: "w-[100%] sm:w-[85%] lg:w-[80%]",
      align: "self-end",
    },
    {
      src: "/screens/analytics.png",
      title: "Advanced Analytics",
      desc: "AI-enhanced reports that decode your trading behavior — equity curves, accuracy trends, and growth projections.",
      tilt: "-rotate-2",
      width: "w-[95%] sm:w-[85%] lg:w-[80%]",
      align: "self-center",
    },
    {
      src: "/screens/settings.png",
      title: "Personalized Settings",
      desc: "Adapt your workspace — custom themes, data exports, and a frictionless user experience designed for you.",
      tilt: "rotate-2",
      width: "w-[90%] sm:w-[80%] lg:w-[75%]",
      align: "self-start",
    },
  ];

  return (
    <section className="py-32 px-6 sm:px-10 relative overflow-hidden">
      {/* === Section Title === */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className={`text-4xl sm:text-5xl font-extrabold text-center mb-24 ${palette.textMain}`}
      >
        Application Showcase
      </motion.h2>

      {/* === Floating Screenshot Layout === */}
      <div className="flex flex-col items-center gap-28 relative max-w-7xl mx-auto">
        {shots.map((shot, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15, duration: 0.8 }}
            viewport={{ once: true }}
            className={`flex flex-col items-center sm:items-start text-center sm:text-left gap-8 ${shot.align}`}
          >
            {/* === Screenshot Frame === */}
            <motion.div
              whileHover={{
                scale: 1.05,
                rotate: 0,
                boxShadow: `0 0 60px ${palette.glow}`,
              }}
              transition={{ type: "spring", stiffness: 180 }}
              className={`relative ${shot.width} rounded-3xl p-[3px] bg-gradient-to-br ${palette.frame} shadow-[0_0_40px_${palette.glow}] transition-transform duration-500 ${shot.tilt}`}
            >
              <div
                className={`rounded-3xl overflow-hidden border ${palette.border} backdrop-blur-xl`}
              >
                <div className="relative w-full aspect-[16/8] overflow-hidden">
                  <Image
                    src={shot.src}
                    alt={shot.title}
                    fill
                    className="object-cover rounded-3xl transition-transform duration-700 hover:scale-110"
                  />
                </div>
              </div>
            </motion.div>

            {/* === Text (floating, no background) === */}
            <div className="max-w-2xl mx-auto">
              <h3
                className={`text-3xl font-semibold mb-3 tracking-wide ${palette.textMain}`}
              >
                {shot.title}
              </h3>
              <p
                className={`text-lg sm:text-xl leading-relaxed ${palette.textSoft}`}
              >
                {shot.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* === Soft Ambient Glow === */}
      <motion.div
        className="absolute -z-10 top-1/3 left-1/2 w-[80vw] h-[80vw] rounded-full blur-[160px] opacity-10"
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
