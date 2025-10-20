"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { BarChart3, Brain, TrendingUp, Target } from "lucide-react";

import useTrades from "../performance/hook/useTrades";
import { analyzeTrades } from "@/lib/insights/analyzer";

import SessionDonut3D from "../performance/sections/SessionDonut3D";
import CreateRiskMonitor from "@/components/insight/CreateRiskMonitor";
import RiskMonitor from "@/components/insight/RiskMonitor";
import GoalsTracker from "@/components/insight/GoalsTracker";
import TradeTimeline from "@/components/insight/TradeTimeline";

export default function InsightPage() {
  const { trades, loading } = useTrades();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [report, setReport] = useState<any>(null);
  const [riskGoal, setRiskGoal] = useState<number>(200);

  useEffect(() => {
    if (trades?.length > 0) {
      const analysis = analyzeTrades(trades);
      setReport(analysis);
    }
  }, [trades]);

  const palette = {
    bg: isDark
      ? "radial-gradient(circle at 20% 20%, #0F172A 0%, #020617 100%)"
      : "radial-gradient(circle at 20% 20%, #E0F2FE 0%, #FFFFFF 100%)",
    text: isDark ? "#E2E8F0" : "#1E293B",
    glow: isDark ? "rgba(56,189,248,0.3)" : "rgba(37,99,235,0.25)",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-lg animate-pulse text-sky-300">
        Loading insights...
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 lg:p-12 min-h-screen space-y-16"
      style={{ background: palette.bg, color: palette.text }}
    >
      {/* 🧠 Header */}
      <div className="flex flex-col items-center text-center space-y-3">
        <motion.h1
          className="text-3xl sm:text-5xl font-extrabold bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent pb-5"
          whileHover={{ scale: 1.03 }}
        >
          Trading Insights
        </motion.h1>
        <p className="text-sm opacity-80">
          Real-time analytics, performance tracking & discipline insights ⚡
        </p>
      </div>

      {/* 🎯 Risk Goal Setup + Live Monitor */}
      <section className="space-y-8 border-t border-sky-500/10 pt-10">
        <div className="grid md:grid-cols-2 gap-8">
          <CreateRiskMonitor onGoalChange={(v) => setRiskGoal(v)} />
          {report && <RiskMonitor report={{ ...report, goal: riskGoal }} />}
        </div>
      </section>

      {/* 🏁 Goals Tracker */}
      {report && (
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8 border-t border-sky-500/10 pt-10"
        >
          <div className="grid md:grid-cols-2 gap-8">
            <GoalsTracker report={report} />
          </div>
        </motion.section>
      )}

      {/* 📊 Performance Summary */}
      {report && (
        <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 border-t border-sky-500/10 pt-10"
    >
      <h2
        className={`text-xl font-semibold text-center mb-8 ${
          isDark ? "text-sky-300" : "text-blue-700"
        }`}
      >
        📊 Performance Overview
      </h2>

      <div className="grid sm:grid-cols-3 gap-8">
        <SummaryCard
          icon={<BarChart3 />}
          title="Win Rate"
          value={`${report.winRate }%`}
          subtitle={`Target: ${report.goals.winRateTarget}%`}
          glow={palette.glow}
          isDark={isDark}
        />
        <SummaryCard
          icon={<TrendingUp />}
          title="Expectancy"
          value={`$${report.expectancy}`}
          subtitle={`Target: $${report.goals.expectancyTarget}`}
          glow={palette.glow}
          isDark={isDark}
        />
        <SummaryCard
          icon={<Target />}
          title="Best Session"
          value={getBestSession(report.sessionCounts)}
          subtitle="Session with highest win ratio"
          glow={palette.glow}
          isDark={isDark}
        />
      </div>
    </motion.section>

      )}

      {/* 🧩 Session 3D Donuts */}
      <section className="border-t border-sky-500/10 pt-10">
        <SessionDonut3D />
      </section>

      {/* 🔍 Top Insights & Recommendations */}
      {report && (
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-10 border-t border-sky-500/10 pt-10"
        >
          <h2
            className={`text-2xl font-bold text-center mb-8 ${
              isDark ? "text-sky-300" : "text-blue-700"
            }`}
          >
            🔍 Key Insights & Recommendations
          </h2>

          <div className="grid lg:grid-cols-2 gap-10">
            <InsightCard
              title="Performance Recommendations"
              icon={<Brain />}
              items={report.recommendations}
              glow={palette.glow}
              isDark={isDark}
            />

            <InsightCard
              title="Psychological Insights"
              icon={<Brain />}
              items={report.mindset}
              glow={palette.glow}
              isDark={isDark}
            />
          </div>
        </motion.section>
      )}

      {/* 🕒 Trade Timeline */}
      <section className="border-t border-sky-500/10 pt-10">
        <TradeTimeline />
      </section>

      {/* 🏷️ Common Tags */}
      {report?.tags?.length > 0 && (
        <motion.section
          className="flex flex-wrap gap-3 justify-center mt-10 border-t border-sky-500/10 pt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {report.tags.map((tag: string, i: number) => (
            <motion.div
              key={i}
              className="px-3 py-1 rounded-full text-sm font-medium text-white shadow-lg backdrop-blur-md"
              style={{
                background: `linear-gradient(135deg, rgba(56,189,248,0.3), rgba(14,165,233,0.5))`,
              }}
              whileHover={{ scale: 1.1 }}
            >
              {tag}
            </motion.div>
          ))}
        </motion.section>
      )}
    </motion.div>
  );
}

/* ✅ SummaryCard — Final Contrast Fix */
function SummaryCard({
  title,
  subtitle,
  value,
  icon,
  glow,
  isDark,
}: {
  title: string;
  subtitle: string;
  value: string | number;
  icon: any;
  glow: string;
  isDark: boolean;
}) {
  const bgColor = isDark
    ? "bg-gradient-to-br from-slate-700/60 to-slate-800/70"
    : "bg-gradient-to-br from-white to-blue-50";
  const borderColor = isDark ? "border-cyan-300/30" : "border-blue-300/30";
  const titleColor = isDark ? "text-sky-300" : "text-blue-700";
  const subtitleColor = isDark ? "text-slate-300" : "text-slate-600";
  const valueColor = isDark ? "text-slate-50" : "text-slate-900";

  return (
    <motion.div
      whileHover={{ scale: 1.04, y: -3 }}
      transition={{ duration: 0.3 }}
      className={`rounded-2xl p-6 border shadow-md backdrop-blur-lg transition-all ${bgColor} ${borderColor}`}
      style={{
        boxShadow: isDark
          ? "0 0 20px rgba(56,189,248,0.3)"
          : "0 4px 15px rgba(30,64,175,0.1)",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={isDark ? "text-cyan-300" : "text-blue-600"}>{icon}</div>
        <div className={`text-3xl font-bold ${valueColor}`}>{value}</div>
      </div>

      <div className={`text-sm font-semibold ${titleColor}`}>{title}</div>
      <div className={`text-xs mt-1 ${subtitleColor}`}>{subtitle}</div>
    </motion.div>
  );
}

/* ✅ InsightCard — Brightened Dark Mode */
function InsightCard({
  title,
  icon,
  items,
  glow,
  isDark,
}: {
  title: string;
  icon: any;
  items: string[];
  glow: string;
  isDark: boolean;
}) {
  if (!items?.length) return null;

  const bgColor = isDark
    ? "bg-gradient-to-br from-slate-700/70 to-slate-800/70"
    : "bg-gradient-to-br from-white to-blue-50";
  const borderColor = isDark ? "border-cyan-300/30" : "border-blue-300/30";
  const titleColor = isDark ? "text-sky-300" : "text-blue-700";
  const textColor = isDark ? "text-slate-100" : "text-slate-800";

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -3 }}
      transition={{ type: "spring", stiffness: 120, damping: 12 }}
      className={`rounded-2xl border shadow-lg backdrop-blur-lg p-6 md:p-8 transition-all ${bgColor} ${borderColor}`}
      style={{
        boxShadow: isDark
          ? "0 0 25px rgba(56,189,248,0.25)"
          : "0 0 15px rgba(37,99,235,0.15)",
      }}
    >
      <div className={`flex items-center gap-3 mb-6 font-semibold text-lg ${titleColor}`}>
        {icon}
        <h3>{title}</h3>
      </div>

      <ul className="space-y-5">
        {items.map((text, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`text-sm md:text-base leading-relaxed border-l-2 pl-4 ${textColor}`}
            style={{
              borderColor: isDark
                ? "rgba(56,189,248,0.4)"
                : "rgba(37,99,235,0.3)",
            }}
          >
            {text}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}



// ✅ Helper — Best Session
function getBestSession(sessions: Record<string, any> = {}) {
  const best = Object.entries(sessions)
    .map(([name, stats]: any) => ({
      name,
      ratio: stats.total ? stats.wins / stats.total : 0,
    }))
    .sort((a, b) => b.ratio - a.ratio)[0];
  return best ? `${best.name} (${Math.round(best.ratio * 100)}%)` : "—";
}
