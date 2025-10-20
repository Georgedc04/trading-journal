"use client";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, CalendarDays } from "lucide-react";

export default function HighlightsSection({
  biggestProfit,
  biggestLoss,
  colors,
}: {
  biggestProfit: any;
  biggestLoss: any;
  colors: any;
}) {
  if (!biggestProfit || !biggestLoss) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl mx-auto"
    >
      {/* Profit */}
      <TradeCard
        type="profit"
        trade={biggestProfit}
        colors={colors}
        icon={<TrendingUp size={22} color={colors.profit} />}
        arrow={<ArrowUpRight size={22} color={colors.profit} />}
      />

      {/* Loss */}
      <TradeCard
        type="loss"
        trade={biggestLoss}
        colors={colors}
        icon={<TrendingDown size={22} color={colors.loss} />}
        arrow={<ArrowDownRight size={22} color={colors.loss} />}
      />
    </motion.section>
  );
}

function TradeCard({ type, trade, colors, icon, arrow }: any) {
  const isProfit = type === "profit";
  const bg = isProfit
    ? "linear-gradient(135deg, rgba(6,78,59,0.65), rgba(20,83,45,0.5))"
    : "linear-gradient(135deg, rgba(69,10,10,0.65), rgba(127,29,29,0.5))";

  return (
    <div
      className="p-6 rounded-2xl border shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-[1.01]"
      style={{
        background: bg,
        borderColor: isProfit ? "rgba(52,211,153,0.25)" : "rgba(248,113,113,0.25)",
        boxShadow: isProfit
          ? "0 8px 20px rgba(52,211,153,0.1)"
          : "0 8px 20px rgba(248,113,113,0.1)",
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
        <p><strong>Pair:</strong> {trade.pair}</p>
        <p><strong>Direction:</strong> {trade.direction}</p>
        <p><strong>Quality:</strong> {trade.quality}</p>
        <p>
          <strong>Result:</strong>{" "}
          <span className="font-semibold" style={{ color: isProfit ? colors.profit : colors.loss }}>
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
