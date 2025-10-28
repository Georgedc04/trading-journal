"use client";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { PieChart as PieChartIcon, TrendingDown, TrendingUp } from "lucide-react";

export default function PieChartSection({ trades }: { trades: any[] }) {
  const totalWins = trades.filter((t) => t.result > 0).length;
  const totalLosses = trades.filter((t) => t.result < 0).length;

  const hasTrades = trades.length > 0;
  const palette = {
    border: "rgba(56,189,248,0.25)",
    card: "linear-gradient(145deg, #0B0F14 0%, #111827 100%)",
    accent: "#38BDF8",
    profit: "#00FF88",
    loss: "#FF4D4D",
    text: "#E2E8F0",
    subText: "#94A3B8",
    shadow: "0 0 25px rgba(56,189,248,0.2)",
  };

  const message =
    totalWins >= totalLosses
      ? {
          icon: <TrendingUp size={18} className="text-[#00FF88] animate-bounce" />,
          text: "You're progressing well — keep that momentum strong 💪",
          color: "#00FF88",
        }
      : {
          icon: <TrendingDown size={18} className="text-[#FF4D4D] animate-pulse" />,
          text: "Losses are lessons — adapt, analyze, and strike back 🔥",
          color: "#FF4D4D",
        };

  return (
    <motion.section
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-4xl mx-auto rounded-3xl p-6 sm:p-8 border shadow-lg text-center backdrop-blur-xl"
      style={{
        background: palette.card,
        borderColor: palette.border,
        boxShadow: palette.shadow,
        color: palette.text,
      }}
    >
      {/* === Header === */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="p-2.5 rounded-full bg-[#0B0F14] shadow-inner border border-sky-500/30">
          <PieChartIcon size={22} className="text-sky-400 drop-shadow-md" />
        </div>
        <h2 className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
          Profit vs Loss Ratio
        </h2>
      </div>

      {/* === Chart Section === */}
      {!hasTrades ? (
        <div className="flex flex-col items-center justify-center py-10 text-slate-400 gap-2">
          <TrendingDown size={20} />
          <p>No trades yet — start journaling your performance 📈</p>
        </div>
      ) : (
        <div className="relative w-full h-[300px] sm:h-[380px] flex items-center justify-center">
          {/* Soft Glow Background */}
          <div
            className="absolute inset-0 blur-[80px] opacity-40"
            style={{
              background: `radial-gradient(circle at center, ${palette.accent}40 0%, transparent 70%)`,
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
                outerRadius="85%"
                paddingAngle={5}
                startAngle={90}
                endAngle={450}
                cornerRadius={10}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
                labelLine={false}
              >
                <Cell fill={palette.profit} stroke="none" />
                <Cell fill={palette.loss} stroke="none" />
              </Pie>

              <Tooltip
                contentStyle={{
                  background: "rgba(15,23,42,0.9)",
                  border: `1px solid ${palette.border}`,
                  borderRadius: "10px",
                  color: palette.text,
                  fontSize: "0.85rem",
                  backdropFilter: "blur(8px)",
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                wrapperStyle={{
                  fontSize: "0.8rem",
                  color: palette.subText,
                  marginTop: "1rem",
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center Label */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 flex items-center justify-center font-semibold text-lg sm:text-xl md:text-2xl"
            style={{
              color: totalWins >= totalLosses ? palette.profit : palette.loss,
              textShadow: "0 0 8px rgba(0,0,0,0.3)",
            }}
          >
            {`${totalWins}W / ${totalLosses}L`}
          </motion.div>
        </div>
      )}

      {/* === Motivational Message === */}
      {hasTrades && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 px-4 py-3 rounded-xl border border-sky-400/20 bg-sky-500/5 backdrop-blur-md flex items-center justify-center gap-2 shadow-inner"
          style={{ color: message.color }}
        >
          {message.icon}
          <p className="font-medium text-sm sm:text-base">{message.text}</p>
        </motion.div>
      )}
    </motion.section>
  );
}
