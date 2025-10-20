"use client";
import { motion } from "framer-motion";

export default function IPhoneMockup({
  price,
  priceUp,
  ACTIVE,
  isDark,
}: {
  price: number;
  priceUp: boolean;
  ACTIVE: any;
  isDark: boolean;
}) {
  const frameColor = isDark
    ? "bg-gradient-to-b from-[#FFD5A6]/90 to-[#FFD5A6]/50 border-black"
    : "bg-gradient-to-b from-[#FF6A37] to-[#4F2A00] border-[#2B1700]";
    const actionColor = isDark ? "bg-[#FFD5A6]/80" : "bg-orange-900";
  const chartTheme = isDark ? "dark" : "light";

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2, duration: 0.8 }}
      className="relative flex flex-col items-center justify-center"
    >
      <div className="relative">
        {/* === iPhone 17 Frame === */}
        <div
            className={`relative w-[220px] sm:w-[280px] aspect-[9/18]
              ${frameColor} rounded-[2.5rem] border-[2px]
              shadow-[0_0_50px_rgba(0,0,0,0.6)] mx-auto transition-all duration-500 overflow-hidden`}
            style={{ boxShadow: `0 0 70px ${ACTIVE.cardGlow}` }}
          >

          {/* === Screen (Full TradingView) === */}
          <div className="absolute inset-[10px] bg-black rounded-[1.5rem] overflow-hidden flex flex-col">
            
            {/* --- Dynamic Island with glowing animated border --- */}
          <motion.div
            className="absolute top-4 left-1/2 -translate-x-1/2 w-30 h-8 rounded-full 
                      flex items-center justify-center bg-black/80 shadow-xl z-20 overflow-hidden backdrop-blur-sm border-1 dark:border-[#FFD5A6]/50 border-amber-600/50"
            animate={{}}
            transition={{ duration: 0.4 }}
          >
            {/* === Running Border === */}
            <div className="absolute inset-0 rounded-full p-[1.5px] bg-transparent">
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{}}
                animate={{}}
              />
            </div>

            {/* --- Glowing blur behind --- */}
            <motion.div
            />

            {/* --- LIVE indicator --- */}
            <motion.div
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{ repeat: Infinity, duration: 2 }}
              className={`absolute left-2 w-1.5 h-1.5 rounded-full ${
                priceUp ? "bg-red-500/70" : "bg-green-700/70"
              }`}
            />

            {/* --- Price text --- */}
            <motion.span
              key={price.toFixed(4)}
              initial={{ opacity: 0, y: -2 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`relative z-10 font-mono text-[0.55rem] font-semibold tracking-wide text-center ${
                priceUp ? "text-emerald-600" : "text-red-600/90"
              }`}
            >
              EUR/USD {price.toFixed(4)}
            </motion.span>
          </motion.div>

                      {/* --- TradingView chart --- */}
            <iframe
              src={`https://s.tradingview.com/widgetembed/?symbol=FX:EURUSD&interval=5&theme=${chartTheme}&style=1&hide_side_toolbar=false&hide_top_toolbar=false`}
              className="absolute inset-0 w-full h-full border-none"
              loading="lazy"
              allowFullScreen
            ></iframe>
            <motion.div
              animate={{
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.05, 1],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut",
              }}
              className={`absolute bottom-3 left-1/2 -translate-x-1/2 w-16 h-[3px] rounded-full 
                ${isDark ? "bg-[#FFD5A6]" : "bg-black"} `}
            />
          </div>

          {/* glass reflection */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black-400/20 to-transparent rounded-[3rem] pointer-events-none" />
        </div>

        {/* --- Action + Volume Buttons --- */}
        <motion.div
          animate={{
            opacity: [0.7, 1, 0.7],
            scale: priceUp ? [1, 1.15, 1] : [1, 0.95, 1],
          }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className={`absolute top-[35%] -right-[8px] w-[4px] h-10 rounded-md ${actionColor} shadow-[0_0_5px_rgba(255,115,0,0.7)] z-30`}
        />
        <div
          className={`absolute top-[30%] -left-[8px] w-[4px] h-8 rounded-md ${actionColor} z-30`}
        />
        <div
          className={`absolute top-[45%] -left-[8px] w-[4px] h-8 rounded-md ${actionColor} z-30`}
        />
      </div>

      {/* bottom ambient glow */}
      <motion.div
        animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="absolute -bottom-12 w-[270px] sm:w-[340px] h-10 bg-emerald-400/20 blur-3xl rounded-full"
      />
    </motion.div>
  );
}
