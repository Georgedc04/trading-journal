"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBitcoin } from "react-icons/fa";

export default function LiveBitcoinPrice({ isDark }: { isDark: boolean }) {
  const [data, setData] = useState<any>(null);
  const [priceUp, setPriceUp] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState(false);

  // 🎨 Theme
 const palette = isDark
    ? {
        accent: "linear-gradient(135deg, #FACC15, #FDE68A)",
        glow: "rgba(250,204,21,0.45)",
        text: "text-white-600",
        bg: "rgba(17,24,39,0.85)",
        border: "rgba(250,204,21,0.25)",
        up: "text-emerald-400",
        down: "text-rose-500",
      }
    : {
        accent: "linear-gradient(135deg, #2563EB, #60A5FA)",
        glow: "rgba(37,99,235,0.35)",
        text: "text-blue-600",
        bg: "rgba(255,255,255,0.85)",
        border: "rgba(37,99,235,0.25)",
        up: "text-green-600",
        down: "text-red-500",
      };

  // 🧠 Fetch Live Bitcoin Data
  useEffect(() => {
    let retryTimeout: NodeJS.Timeout;

    const fetchData = async () => {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&community_data=false&developer_data=false"
        );
        if (!res.ok) throw new Error("HTTP Error");
        const json = await res.json();
        const newPrice = json.market_data.current_price.usd;
        setPriceUp(newPrice > (data?.market_data?.current_price?.usd || 0));
        setData(json);
        setError(false);
      } catch {
        setError(true);
        retryTimeout = setTimeout(fetchData, 20000);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 20000);
    return () => {
      clearInterval(interval);
      clearTimeout(retryTimeout);
    };
  }, [data]);

  const price = data?.market_data?.current_price?.usd ?? null;
  const change24h = data?.market_data?.price_change_percentage_24h ?? 0;
  const marketCap = data?.market_data?.market_cap?.usd ?? null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.9 }}
        transition={{ duration: 0.5 }}
        className="fixed bottom-6 left-6 z-50 select-none"
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
      >
        {/* === Compact Widget === */}
        <motion.div
          layout
          className="relative rounded-2xl backdrop-blur-xl border shadow-lg overflow-hidden cursor-pointer"
          style={{
            borderColor: isDark
              ? "#22D3EE"
              : "rgba(37,99,235,0.35)",
            background: palette.bg,
            boxShadow: `0 0 8px ${palette.glow}`,
          }}
          transition={{ type: "spring", stiffness: 150, damping: 18 }}
        >
          <motion.div
            className="flex items-center gap-3 px-4 py-3"
            initial={false}
            animate={{ paddingBottom: expanded ? 12 : 8 }}
          >
            {/* Bitcoin Icon */}
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 10,
                ease: "easeInOut",
              }}
            >
              <FaBitcoin
                className={`text-2xl sm:text-3xl ${palette.text} drop-shadow-[0_0_10px_${palette.glow}]`}
              />
            </motion.div>

            {/* Live Price */}
            <div>
              <motion.span
                key={price ?? "loading"}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.25 }}
                className={`font-semibold text-base sm:text-lg ${palette.text}`}
              >
                {error
                  ? "Offline"
                  : price
                  ? `$${price.toLocaleString()}`
                  : "Loading..."}
              </motion.span>

              <motion.div
                className={`text-xs ${
                  change24h >= 0 ? palette.up : palette.down
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: expanded ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {change24h >= 0 ? "▲" : "▼"} {Math.abs(change24h).toFixed(2)}%
              </motion.div>
            </div>
          </motion.div>

          {/* === Expanded Card === */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                key="expanded"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
                className="px-4 pb-4 text-xs sm:text-sm text-left space-y-1"
              >
                <div className="flex justify-between">
                  <span className="opacity-70">24h Change:</span>
                  <span
                    className={`font-medium ${
                      change24h >= 0 ? palette.up : palette.down
                    }`}
                  >
                    {change24h.toFixed(2)}%
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="opacity-70">Market Cap:</span>
                  <span className="font-medium opacity-90">
                    {marketCap
                      ? `$${(marketCap / 1e9).toFixed(2)}B`
                      : "Fetching..."}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="opacity-70">Source:</span>
                  <span className="font-medium text-[11px] opacity-90">
                    Coingecko API
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
