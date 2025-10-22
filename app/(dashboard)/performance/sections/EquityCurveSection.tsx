"use client";
import { motion } from "framer-motion";
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
        className="rounded-xl  border shadow-md transition-all duration-300"
        style={{
          background: colors.card,
          borderColor: colors.border,
          boxShadow: `0 4px 12px ${colors.shadow}`,
        }}
      >
        <EquityChart data={chartData} accountSize={accountSize} />
      </motion.section>

      {/* Revenue Chart */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="rounded-xl  border shadow-md transition-all duration-300"
        style={{
          background: colors.card,
          borderColor: colors.border,
          boxShadow: `0 4px 12px ${colors.shadow}`,
        }}
      >
        <EquityChartrevenue data={chartData} accountSize={accountSize} />
      </motion.section>
    </>
  );
}
