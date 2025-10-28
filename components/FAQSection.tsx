"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export default function FAQSection() {
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

  // 🌙 Dark Mode Colors
  const palette = {
    frame: "from-sky-400/70 to-cyan-400/40",
    textMain: "text-gray-100",
    textSoft: "text-gray-400",
    border: "border-cyan-400/20",
    glow: "rgba(56,189,248,0.4)",
  };

  const faqs = [
    {
      q: "What makes DC Trades different from a regular trading journal?",
      a: "DC Trades isn’t just a journal — it’s your personal trading intelligence platform. It transforms your trade data into meaningful insights, tracking consistency, mindset, and performance trends.",
    },
    {
      q: "How does DC Trades handle journaling and trade entries?",
      a: "You can log each trade manually with notes, screenshots, and trade type (A+, A, B, or C). Soon, automatic syncing from brokers like MT4/MT5 and cTrader will be available.",
    },
    {
      q: "Is my trading data secure and synced across devices?",
      a: "Yes — all data is encrypted and securely stored in the cloud. You can access your trading journal anytime, anywhere, with full privacy and real-time sync.",
    },
    {
      q: "Which markets does DC Trades support, and can I export my data?",
      a: "It supports Forex, Crypto, Metals, and Indices — including pip and point-based tracking. You can export your journal to CSV or Excel anytime.",
    },
    {
      q: "How often does DC Trades receive updates?",
      a: "We release monthly feature updates focused on automation, smarter analytics, and design improvements for an even smoother experience.",
    },
  ];

  return (
    <section
      ref={containerRef}
      className="py-24 sm:py-28 px-4 sm:px-10 relative overflow-hidden"
    >
      {/* === Title === */}
      <motion.h2
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
        className={`text-3xl sm:text-5xl font-extrabold text-center mb-14 sm:mb-20 ${palette.textMain}`}
      >
        Frequently Asked Questions
      </motion.h2>

      {/* === FAQ Container === */}
      <div className="max-w-4xl mx-auto space-y-5 sm:space-y-6">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: "easeOut" }}
              viewport={{ once: true }}
              className={`p-[1.5px] rounded-2xl bg-gradient-to-br ${palette.frame} shadow-[0_0_25px_${palette.glow}]`}
            >
              <div className="rounded-2xl bg-[#0B1220]/70 border border-cyan-400/20 backdrop-blur-xl overflow-hidden">
                {/* === Question === */}
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex justify-between items-center px-5 py-4 sm:px-6 sm:py-5 text-left group"
                >
                  <span
                    className={`font-semibold text-base sm:text-lg tracking-wide ${palette.textMain}`}
                  >
                    {faq.q}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="ml-3"
                  >
                    <ChevronDown
                      size={20}
                      className="text-cyan-300 group-hover:text-cyan-100 transition-all"
                    />
                  </motion.div>
                </button>

                {/* === Dropdown === */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        duration: 0.55,
                        ease: [0.22, 1, 0.36, 1], // custom smooth cubic
                      }}
                      className="px-5 sm:px-6 pb-5 sm:pb-6 overflow-hidden"
                    >
                      <motion.p
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className={`text-sm sm:text-base leading-relaxed ${palette.textSoft}`}
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
        className="absolute -z-10 top-1/2 left-1/2 w-[60vw] h-[60vw] rounded-full blur-[120px] opacity-10"
        style={{
          background:
            "radial-gradient(circle, rgba(56,189,248,0.25), transparent 70%)",
          transform: "translate(-50%, -50%)",
        }}
        animate={{ scale: [1, 1.05, 1], opacity: [0.1, 0.25, 0.1] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
      />
    </section>
  );
}
