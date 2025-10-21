"use client";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  CalendarDays,
} from "lucide-react";
import { useTheme } from "next-themes";

export default function HighlightsSection({
  biggestProfit,
  biggestLoss,
  colors,
}: {
  biggestProfit: any;
  biggestLoss: any;
  colors: any;
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // ✅ Only show profit if > 0
  const showProfit = biggestProfit && biggestProfit.result > 0;
  // ✅ Only show loss if < 0
  const showLoss = biggestLoss && biggestLoss.result < 0;

  if (!showProfit && !showLoss) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className={`grid grid-cols-1 ${
        showProfit && showLoss ? "md:grid-cols-2" : "md:grid-cols-1"
      } gap-6 w-full max-w-5xl mx-auto`}
    >
      {showProfit && (
        <TradeCard
          type="profit"
          trade={biggestProfit}
          colors={colors}
          isDark={isDark}
          icon={<TrendingUp size={22} color={colors.profit} />}
          arrow={<ArrowUpRight size={22} color={colors.profit} />}
        />
      )}

      {showLoss && (
        <TradeCard
          type="loss"
          trade={biggestLoss}
          colors={colors}
          isDark={isDark}
          icon={<TrendingDown size={22} color={colors.loss} />}
          arrow={<ArrowDownRight size={22} color={colors.loss} />}
        />
      )}
    </motion.section>
  );
}

function TradeCard({ type, trade, colors, icon, arrow, isDark }: any) {
  const isProfit = type === "profit";

  // ✅ Softer gradients depending on mode
  const bg = isProfit
    ? isDark
      ? "linear-gradient(145deg, rgba(22,163,74,0.25), rgba(21,128,61,0.15))"
      : "linear-gradient(145deg, rgba(187,247,208,0.8), rgba(134,239,172,0.7))"
    : isDark
      ? "linear-gradient(145deg, rgba(220,38,38,0.25), rgba(185,28,28,0.15))"
      : "linear-gradient(145deg, rgba(254,202,202,0.8), rgba(252,165,165,0.7))";

  const borderColor = isProfit
    ? isDark
      ? "rgba(34,197,94,0.3)"
      : "rgba(22,163,74,0.3)"
    : isDark
      ? "rgba(239,68,68,0.3)"
      : "rgba(220,38,38,0.3)";

  const boxShadow = isProfit
    ? isDark
      ? "0 8px 20px rgba(34,197,94,0.15)"
      : "0 8px 20px rgba(22,163,74,0.2)"
    : isDark
      ? "0 8px 20px rgba(239,68,68,0.15)"
      : "0 8px 20px rgba(220,38,38,0.2)";

  return (
    <div
      className="p-6 rounded-2xl border shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-[1.01]"
      style={{
        background: bg,
        borderColor,
        boxShadow,
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {icon}
          <h2
            className="text-lg sm:text-xl font-semibold"
            style={{ color: isProfit ? colors.profit : colors.loss }}
          >
            {isProfit ? "Biggest Profit Trade" : "Biggest Loss Trade"}
          </h2>
        </div>
        {arrow}
      </div>

      <div className="space-y-2 text-sm sm:text-base">
        <p>
          <strong>Pair:</strong> {trade.pair}
        </p>
        <p>
          <strong>Direction:</strong> {trade.direction}
        </p>
        <p>
          <strong>Quality:</strong> {trade.quality}
        </p>
        <p>
          <strong>Result:</strong>{" "}
          <span
            className="font-semibold"
            style={{ color: isProfit ? colors.profit : colors.loss }}
          >
            {isProfit ? "+" : "-"}${Math.abs(trade.result).toFixed(2)}
          </span>
        </p>
        <p className="flex items-center text-xs opacity-70">
          <CalendarDays size={14} className="mr-1" />{" "}
          {new Date(trade.date).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
