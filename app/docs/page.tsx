"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { BookOpen, ShieldCheck, BarChart3, Database, Settings, Zap } from "lucide-react";
import Link from "next/link";

export default function DocsPage() {
  const sections = [
    { id: "getting-started", title: "Getting Started", icon: <Zap className="w-5 h-5 text-cyan-400" /> },
    { id: "dashboard", title: "Dashboard Overview", icon: <BarChart3 className="w-5 h-5 text-cyan-400" /> },
    { id: "journaling", title: "Trade Journaling", icon: <BookOpen className="w-5 h-5 text-cyan-400" /> },
    { id: "analytics", title: "Analytics & Insights", icon: <Database className="w-5 h-5 text-cyan-400" /> },
    { id: "privacy", title: "Privacy & Security", icon: <ShieldCheck className="w-5 h-5 text-cyan-400" /> },
    { id: "api", title: "Developer API (Coming Soon)", icon: <Settings className="w-5 h-5 text-cyan-400" /> },
  ];

  const ref = useRef<HTMLDivElement>(null);

  return (
    <main
      ref={ref}
      className="min-h-screen bg-[#0B0F14] text-gray-100 flex flex-col sm:flex-row"
    >
      {/* === Sidebar === */}
      <aside className="hidden sm:flex sm:flex-col w-64 border-r border-cyan-400/10 bg-[#0E1522]/70 backdrop-blur-xl p-6 sticky top-0 h-screen overflow-y-auto">
        <h2 className="text-cyan-300 font-semibold text-lg mb-6 tracking-wide">Docs Navigation</h2>
        <nav className="flex flex-col space-y-3">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="flex items-center gap-2 text-gray-400 hover:text-cyan-300 transition-all duration-150 text-sm"
            >
              {s.icon}
              {s.title}
            </a>
          ))}
        </nav>
      </aside>

      {/* === Main Content === */}
      <div className="flex-1 px-6 sm:px-12 py-16 sm:py-20 max-w-4xl mx-auto space-y-20">
        {/* === Header === */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-3 bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
            DC Trades Documentation
          </h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            Learn everything about <span className="text-cyan-300">DC Trades</span> — setup, journaling, analytics, and API.
            Designed to help traders and developers integrate smarter.
          </p>
        </motion.div>

        {/* === Sections === */}
        {sectionsData.map((section) => (
          <Section key={section.id} {...section} />
        ))}

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center pt-10 border-t border-cyan-400/10"
        >
          <p className="text-gray-400 text-sm">
            Need more help? Visit our{" "}
            <Link href="/faq" className="text-cyan-300 underline hover:text-cyan-200">
              FAQ section
            </Link>{" "}
            or email{" "}
            <a href="mailto:support@dctrades.vercel.app" className="text-cyan-300 underline hover:text-cyan-200">
              support@dctrades.vercel.app
            </a>
            .
          </p>
        </motion.div>
      </div>
    </main>
  );
}

/* === Section Data === */
const sectionsData = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: <Zap className="w-6 h-6 text-cyan-400" />,
    desc: "Welcome to DC Trades — the AI-powered trading journal built for disciplined traders.",
    points: [
      "Sign up with your email or social login.",
      "Set your default trading market (Forex, Crypto, Indices).",
      "Access your dashboard and begin logging trades instantly.",
    ],
  },
  {
    id: "dashboard",
    title: "Dashboard Overview",
    icon: <BarChart3 className="w-6 h-6 text-cyan-400" />,
    desc: "Your performance hub — visual insights that track your precision and progress.",
    points: [
      "Track real-time equity growth, win rate, and trade stats.",
      "Customize widgets, metrics, and intervals.",
      "Filter by strategy, date, or instrument.",
    ],
  },
  {
    id: "journaling",
    title: "Trade Journaling",
    icon: <BookOpen className="w-6 h-6 text-cyan-400" />,
    desc: "Record every trade with context — strategy, emotion, and results — for smarter decisions.",
    points: [
      "Manually record trades with screenshots and strategy tags.",
      "Assign trade grades (A+, A, B, C).",
      "Auto-import from MT4/MT5 soon available.",
    ],
  },
  {
    id: "analytics",
    title: "Analytics & Insights",
    icon: <Database className="w-6 h-6 text-cyan-400" />,
    desc: "AI-enhanced analytics decode your trading behavior and guide consistent improvement.",
    points: [
      "View expectancy, win rate, and drawdown ratios.",
      "AI detects overtrading and psychological biases.",
      "Compare strategies across different sessions.",
    ],
  },
  {
    id: "privacy",
    title: "Privacy & Security",
    icon: <ShieldCheck className="w-6 h-6 text-cyan-400" />,
    desc: "Your data is yours — encrypted, protected, and never shared.",
    points: [
      "End-to-end encryption for your journal data.",
      "Two-factor authentication and secure API tokens.",
      "GDPR-compliant privacy practices.",
    ],
    extra: (
      <p className="text-sm text-gray-400 mt-2">
        Read full <Link href="/privacy" className="text-cyan-300 underline">Privacy Policy</Link>.
      </p>
    ),
  },
  {
    id: "api",
    title: "Developer API (Coming Soon)",
    icon: <Settings className="w-6 h-6 text-cyan-400" />,
    desc: "Integrate DC Trades into your trading bot or dashboard with our REST API.",
    points: [
      "API keys for journal import/export.",
      "Webhook support for automation.",
      "JSON endpoints for analytics integration.",
    ],
  },
];

/* === Section Component === */
function Section({ id, title, icon, desc, points, extra }: any) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      viewport={{ once: true }}
      className="rounded-2xl border border-cyan-400/10 bg-[#0f172a]/60 p-6 sm:p-8 backdrop-blur-xl shadow-[0_0_25px_rgba(56,189,248,0.1)] hover:shadow-[0_0_35px_rgba(56,189,248,0.25)] transition-all"
    >
      <div className="flex items-center gap-3 mb-3">
        {icon}
        <h2 className="text-xl font-semibold text-cyan-300">{title}</h2>
      </div>
      <p className="text-gray-300 text-sm sm:text-base mb-3">{desc}</p>
      {points && (
        <ul className="list-disc ml-5 space-y-1 text-gray-400 text-sm">
          {points.map((p: string, i: number) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      )}
      {extra}
    </motion.section>
  );
}
