"use client";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  CalendarDays,
} from "lucide-react";

export default function HighlightsSection({
  biggestProfit,
  biggestLoss,
}: {
  biggestProfit: any;
  biggestLoss: any;
}) {
  // ✅ Only show profit if > 0
  const showProfit = biggestProfit && biggestProfit.result > 0;
  // ✅ Only show loss if < 0
  const showLoss = biggestLoss && biggestLoss.result < 0;

  if (!showProfit && !showLoss) return null;

  const colors = {
    profit: "#00FF88",
    loss: "#FF4D4D",
    border: "rgba(56,189,248,0.25)",
    bg: "linear-gradient(145deg, #0B0F14 0%, #111827 100%)",
    shadow: "0 0 25px rgba(56,189,248,0.15)",
    text: "#E2E8F0",
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`grid grid-cols-1 ${
        showProfit && showLoss ? "md:grid-cols-2" : "md:grid-cols-1"
      } gap-6 w-full max-w-5xl mx-auto`}
    >
      {showProfit && (
        <TradeCard
          type="profit"
          trade={biggestProfit}
          colors={colors}
          icon={<TrendingUp size={22} color={colors.profit} />}
          arrow={<ArrowUpRight size={22} color={colors.profit} />}
        />
      )}

      {showLoss && (
        <TradeCard
          type="loss"
          trade={biggestLoss}
          colors={colors}
          icon={<TrendingDown size={22} color={colors.loss} />}
          arrow={<ArrowDownRight size={22} color={colors.loss} />}
        />
      )}
    </motion.section>
  );
}

function TradeCard({ type, trade, colors, icon, arrow }: any) {
  const isProfit = type === "profit";

  const palette = {
    background: isProfit
      ? "linear-gradient(145deg, rgba(0,255,136,0.15), rgba(0,100,60,0.1))"
      : "linear-gradient(145deg, rgba(255,77,77,0.15), rgba(120,20,20,0.1))",
    border: isProfit ? "rgba(0,255,136,0.25)" : "rgba(255,77,77,0.25)",
    shadow: isProfit
      ? "0 0 25px rgba(0,255,136,0.25)"
      : "0 0 25px rgba(255,77,77,0.25)",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="p-6 rounded-2xl border backdrop-blur-md shadow-lg transition-all duration-300"
      style={{
        background: palette.background,
        borderColor: palette.border,
        boxShadow: palette.shadow,
        color: colors.text,
      }}
    >
      {/* === Header === */}
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

      {/* === Trade Details === */}
      <div className="space-y-2 text-sm sm:text-base">
        <p>
          <strong>Pair:</strong> <span className="opacity-90">{trade.pair}</span>
        </p>
        <p>
          <strong>Direction:</strong>{" "}
          <span className="opacity-90">{trade.direction}</span>
        </p>
        <p>
          <strong>Quality:</strong>{" "}
          <span className="opacity-90">{trade.quality}</span>
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
          <CalendarDays size={14} className="mr-1 text-sky-400" />
          {new Date(trade.date).toLocaleDateString()}
        </p>
      </div>
    </motion.div>
  );
}
