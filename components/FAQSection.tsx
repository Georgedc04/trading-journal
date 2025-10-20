"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export default function FAQSection({ isDark }: { isDark: boolean }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // ✅ Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpenIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const palette = isDark
    ? {
        frame: "from-sky-400/80 to-cyan-400/40",
        textMain: "text-gray-100",
        textSoft: "text-gray-300",
        border: "border-cyan-400/20",
        glow: "rgba(56,189,248,0.4)",
      }
    : {
        frame: "from-blue-500/90 to-orange-400/60",
        textMain: "text-blue-700",
        textSoft: "text-gray-700",
        border: "border-blue-400/20",
        glow: "rgba(37,99,235,0.4)",
      };

const faqs = [
  {
    q: "What makes DC Trades different from a regular trading journal?",
    a: "DC Trades goes beyond basic record-keeping — it’s your personal trading intelligence system. It analyzes performance patterns, tracks emotional discipline, measures consistency, and transforms raw trade data into powerful, visual insights.",
  },
  {
    q: "How does DC Trades handle journaling and trade entries?",
    a: "You can easily record each trade — including profit/loss, screenshots, notes, and trade type (A+, A, B, or C). A future update will introduce full automation, syncing trades directly from your broker in real time.",
  },
  {
    q: "Is my trading data secure and synced across devices?",
    a: "Absolutely. All data is encrypted and securely stored in the cloud. You can access, edit, or review your journal anytime, anywhere — with complete privacy and multi-device synchronization.",
  },
  {
    q: "Which markets does DC Trades support, and can I export my data?",
    a: "DC Trades supports Forex, Crypto, Metals, and Indices — with automatic pip, point, and percentage calculations. You can export your entire journal to CSV or Excel for detailed review or sharing with mentors.",
  },
  {
    q: "How frequently does DC Trades receive new updates?",
    a: "We roll out major improvements monthly — including smarter analytics, improved goal tracking, automation tools, and new design refinements to keep your trading workflow fast and professional.",
  },
];


  return (
    <section className="py-28 px-6 sm:px-10 relative overflow-hidden" ref={containerRef}>
      {/* === Section Title === */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
        className={`text-4xl sm:text-5xl font-extrabold text-center mb-16 ${palette.textMain}`}
      >
        Frequently Asked Questions
      </motion.h2>

      {/* === FAQ Container === */}
      <div className="max-w-4xl mx-auto space-y-6">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: "easeOut" }}
              viewport={{ once: true }}
              className={`rounded-2xl p-[2px] bg-gradient-to-br ${palette.frame} shadow-[0_0_25px_${palette.glow}]`}
            >
              <div
                className={`rounded-2xl ${
                  isDark ? "bg-slate-900/50" : "bg-white/60"
                } border ${palette.border} backdrop-blur-xl overflow-hidden transition-all duration-500`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex justify-between items-center p-5 text-left group"
                >
                  <span
                    className={`font-semibold text-lg sm:text-xl ${palette.textMain}`}
                  >
                    {faq.q}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="ml-4"
                  >
                    <ChevronDown
                      size={22}
                      className={`transition-all ${
                        isDark
                          ? "text-cyan-300 group-hover:text-cyan-100"
                          : "text-blue-600 group-hover:text-blue-800"
                      }`}
                    />
                  </motion.div>
                </button>

                <AnimatePresence mode="sync">
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ opacity: 0, height: 0, y: -10 }}
                      animate={{ opacity: 1, height: "auto", y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -10 }}
                      transition={{
                        duration: 0.45,
                        ease: [0.25, 1, 0.5, 1],
                      }}
                      className="px-5 pb-5"
                    >
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                        className={`text-base sm:text-lg leading-relaxed ${palette.textSoft}`}
                      >
                        {faq.a}
                      </motion.p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* === Ambient Glow === */}
      <motion.div
        className="absolute -z-10 top-1/3 left-1/2 w-[70vw] h-[70vw] rounded-full blur-[130px] opacity-10"
        style={{
          background: isDark
            ? "radial-gradient(circle, rgba(56,189,248,0.25), transparent 70%)"
            : "radial-gradient(circle, rgba(37,99,235,0.25), transparent 70%)",
          transform: "translate(-50%, -50%)",
        }}
        animate={{ scale: [1, 1.05, 1], opacity: [0.1, 0.25, 0.1] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
      />
    </section>
  );
}
