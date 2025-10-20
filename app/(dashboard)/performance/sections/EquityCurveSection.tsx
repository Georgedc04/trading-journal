"use client";
import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import EquityChart from "@/components/EquityChart";
import EquityChartrevenue from "@/components/EquityChartrevenue";

export default function EquityCurveSection({
  trades,
  accountSize,
  colors,
}: {
  trades: any[];
  accountSize: number;
  colors: any;
}) {
  const chartData = trades.map((t, i) => ({
    date: new Date(t.date).toLocaleDateString(),
    balance:
      accountSize +
      trades.slice(0, i + 1).reduce((sum, x) => sum + (x.result || 0), 0),
  }));

  return (
    <>
      {/* Equity Growth */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="rounded-xl p-5 sm:p-6 border shadow-md transition-all duration-300"
        style={{
          background: colors.card,
          borderColor: colors.border,
          boxShadow: `0 8px 25px ${colors.shadow}`,
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 size={22} className="text-sky-400" />
          <h2 className="text-xl font-semibold">Equity Curve</h2>
        </div>
        <EquityChart data={chartData} accountSize={accountSize} />
      </motion.section>

      {/* Revenue Chart */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="rounded-xl p-5 sm:p-6 border shadow-md transition-all duration-300"
        style={{
          background: colors.card,
          borderColor: colors.border,
          boxShadow: `0 8px 25px ${colors.shadow}`,
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 size={22} className="text-sky-400" />
          <h2 className="text-xl font-semibold">Equity Revenue</h2>
        </div>
        <EquityChartrevenue data={chartData} accountSize={accountSize} />
      </motion.section>
    </>
  );
}
