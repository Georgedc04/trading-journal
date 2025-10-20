"use client";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { PieChart as PieChartIcon, TrendingDown, TrendingUp } from "lucide-react";

export default function PieChartSection({ trades, colors }: { trades: any[]; colors: any }) {
  const totalWins = trades.filter((t) => t.result > 0).length;
  const totalLosses = trades.filter((t) => t.result < 0).length;

  const message =
    totalWins > totalLosses
      ? {
          icon: <TrendingUp size={18} className="text-green-400 animate-bounce" />,
          text: "You're progressing well — keep the momentum going 💪",
          color: "text-green-400",
        }
      : {
          icon: <TrendingDown size={18} className="text-red-400 animate-pulse" />,
          text: "Losses are lessons — analyze, adapt, and rise stronger 🔥",
          color: "text-red-400",
        };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="rounded-xl p-5 sm:p-6 border flex flex-col items-center shadow-md transition-all duration-300"
      style={{
        background: colors.card,
        borderColor: colors.border,
        boxShadow: `0 8px 25px ${colors.shadow}`,
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <PieChartIcon size={22} className="text-sky-400" />
        <h2 className="text-xl font-semibold">Profit vs Loss Ratio</h2>
      </div>

      {trades.length === 0 ? (
        <p className="text-center text-base opacity-70 flex items-center gap-2">
          <TrendingDown size={16} /> No trades yet — start journaling your progress
        </p>
      ) : (
        <div className="relative w-full max-w-md h-[320px] sm:h-[360px]">
          <div
            className="absolute inset-0 blur-2xl rounded-full"
            style={{
              background: `radial-gradient(circle at center, ${colors.accent}30 0%, transparent 70%)`,
            }}
          />

          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={[
                  { name: "Profitable Trades", value: totalWins },
                  { name: "Losing Trades", value: totalLosses },
                ]}
                cx="50%"
                cy="50%"
                innerRadius="60%"
                outerRadius="88%"
                paddingAngle={4}
                startAngle={90}
                endAngle={450}
                cornerRadius={10}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
                labelLine={false}
              >
                <Cell fill="#22C55E" />
                <Cell fill="#EF4444" />
              </Pie>
              <Tooltip contentStyle={{ background: colors.card, borderRadius: "10px" }} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center font-semibold text-lg"
            style={{
              color: totalWins >= totalLosses ? colors.profit : colors.loss,
            }}
          >
            {`${totalWins}W / ${totalLosses}L`}
          </motion.div>
        </div>
      )}

      {trades.length > 0 && (
        <div className={`mt-4 text-center flex items-center justify-center gap-2 ${message.color}`}>
          {message.icon}
          <p className="font-medium text-sm sm:text-base">{message.text}</p>
        </div>
      )}
    </motion.section>
  );
}
