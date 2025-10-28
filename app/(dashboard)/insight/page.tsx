"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
  const [report, setReport] = useState<any>(null);
  const [riskGoal, setRiskGoal] = useState<number>(200);

  useEffect(() => {
    if (trades?.length > 0) {
      const analysis = analyzeTrades(trades);
      setReport(analysis);
    }
  }, [trades]);

  const palette = {
    bg: "radial-gradient(circle at 20% 20%, #0B0F14 0%, #0B0F14 100%)",
    text: "#E2E8F0",
    glow: "rgba(56,189,248,0.25)",
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-[60vh] text-lg animate-pulse text-sky-300">
        Loading insights...
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-6 lg:p-12 min-h-screen space-y-16"
      style={{ background: palette.bg, color: palette.text }}
    >
      {/* 🧠 Header */}
      <div className="flex flex-col items-center text-center space-y-3">
        <motion.h1
          whileHover={{ scale: 1.02 }}
          className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent pb-5 drop-shadow-[0_0_10px_rgba(56,189,248,0.1)]"
        >
          Trading Insights
        </motion.h1>
        <p className="text-sm text-sky-200/70">
          Real-time analytics, performance tracking & discipline metrics ⚡
        </p>
      </div>

      {/* 🎯 Risk Goal + Monitor */}
      <section className="space-y-10 border-t border-sky-500/10 pt-10">
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
          className="border-t border-sky-500/10 pt-10"
        >
          <GoalsTracker report={report} />
        </motion.section>
      )}

      {/* 📊 Performance Summary */}
      {report && (
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-sky-500/10 pt-10"
        >
          <h2 className="text-xl font-semibold text-center mb-8 text-sky-300">
            📊 Performance Overview
          </h2>

          <div className="grid sm:grid-cols-3 gap-8">
            <SummaryCard
              icon={<BarChart3 />}
              title="Win Rate"
              value={`${report.winRate}%`}
              subtitle={`Target: ${report.goals.winRateTarget}%`}
            />
            <SummaryCard
              icon={<TrendingUp />}
              title="Expectancy"
              value={`$${report.expectancy}`}
              subtitle={`Target: $${report.goals.expectancyTarget}`}
            />
            <SummaryCard
              icon={<Target />}
              title="Best Session"
              value={getBestSession(report.sessionCounts)}
              subtitle="Session with highest win ratio"
            />
          </div>
        </motion.section>
      )}

      {/* 🧩 Session Donuts */}
      <section className="border-t border-sky-500/10 pt-10">
        <SessionDonut3D />
      </section>

      {/* 🔍 Insights & Psychology */}
      {report && (
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-10 border-t border-sky-500/10 pt-10"
        >
          <h2 className="text-2xl font-bold text-center mb-8 text-sky-300">
            🔍 Key Insights & Recommendations
          </h2>

          <div className="grid lg:grid-cols-2 gap-10">
            <InsightCard
              title="Performance Recommendations"
              icon={<Brain />}
              items={report.recommendations}
            />
            <InsightCard
              title="Psychological Insights"
              icon={<Brain />}
              items={report.mindset}
            />
          </div>
        </motion.section>
      )}

      {/* 🕒 Trade Timeline */}
      <section className="border-t border-sky-500/10 pt-10">
        <TradeTimeline />
      </section>

      {/* 🏷️ Tags */}
      {report?.tags?.length > 0 && (
        <motion.section
          className="flex flex-wrap gap-3 justify-center mt-10 border-t border-sky-500/10 pt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {report.tags.map((tag: string, i: number) => (
            <motion.div
              key={i}
              className="px-3 py-1 rounded-full text-sm font-medium text-white shadow-md backdrop-blur-md"
              style={{
                background:
                  "linear-gradient(135deg, rgba(56,189,248,0.3), rgba(14,165,233,0.4))",
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

/* 🔹 Summary Card */
function SummaryCard({ title, subtitle, value, icon }: any) {
  return (
    <motion.div
      whileHover={{ scale: 1.04, y: -3 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl p-6 border border-cyan-400/30 bg-gradient-to-br from-slate-800/60 to-slate-900/70 shadow-lg backdrop-blur-lg transition-all"
      style={{ boxShadow: "0 0 25px rgba(56,189,248,0.25)" }}
    >
      <div className="flex items-center justify-between mb-3 text-cyan-300">
        {icon}
        <div className="text-3xl font-bold text-slate-50">{value}</div>
      </div>
      <div className="text-sm font-semibold text-sky-300">{title}</div>
      <div className="text-xs text-slate-400 mt-1">{subtitle}</div>
    </motion.div>
  );
}

/* 🔹 Insight Card */
function InsightCard({ title, icon, items }: any) {
  if (!items?.length) return null;
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-cyan-400/30 bg-gradient-to-br from-slate-800/70 to-slate-900/70 shadow-lg backdrop-blur-lg p-6 md:p-8"
      style={{ boxShadow: "0 0 25px rgba(56,189,248,0.25)" }}
    >
      <div className="flex items-center gap-3 mb-5 font-semibold text-lg text-sky-300">
        {icon}
        <h3>{title}</h3>
      </div>

      <ul className="space-y-4">
        {items.map((text: string, i: number) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="text-sm md:text-base leading-relaxed text-slate-200 border-l-2 border-cyan-400/30 pl-4"
          >
            {text}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

/* 🔹 Helper — Best Session */
function getBestSession(sessions: Record<string, any> = {}) {
  const best = Object.entries(sessions)
    .map(([name, stats]: any) => ({
      name,
      ratio: stats.total ? stats.wins / stats.total : 0,
    }))
    .sort((a, b) => b.ratio - a.ratio)[0];
  return best ? `${best.name} (${Math.round(best.ratio * 100)}%)` : "—";
}
