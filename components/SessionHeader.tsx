"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Clock } from "lucide-react";

export default function SessionHeader({ username }: { username?: string }) {
  const [session, setSession] = useState<string | null>(null);
  const [time, setTime] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);

  // Calculate session state and progress based on UTC (auto converts for local display)
  const checkSession = () => {
    const now = new Date();
    const utcHour = now.getUTCHours() + now.getUTCMinutes() / 60;
    const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();

    let currentSession: string | null = null;
    let start: number | null = null;
    let end: number | null = null;

    // London 08:00–11:00 UTC
    if (utcHour >= 8 && utcHour < 11) {
      currentSession = "London";
      start = 8 * 60;
      end = 11 * 60;
    }

    // New York 13:00–16:00 UTC
    else if (utcHour >= 13 && utcHour < 16) {
      currentSession = "New York";
      start = 13 * 60;
      end = 16 * 60;
    }

    setSession(currentSession);

    if (currentSession && start !== null && end !== null) {
      const progressValue = Math.min(
        100,
        Math.max(0, ((utcMinutes - start) / (end - start)) * 100)
      );
      setProgress(progressValue);
    } else {
      setProgress(0);
    }
  };

  useEffect(() => {
    checkSession();
    const interval = setInterval(() => {
      checkSession();
      setTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full flex flex-col items-center justify-center py-6 sm:py-8 text-center overflow-hidden">
      {/* === Session Progress Bar === */}
      <div className="absolute top-0 left-0 w-full h-[5px] bg-[#1a1f29] overflow-hidden rounded-full">
        {session ? (
          <motion.div
            className="h-full bg-gradient-to-r from-sky-500 via-cyan-400 to-sky-300 shadow-[0_0_15px_rgba(56,189,248,0.6)]"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "linear", duration: 1 }}
          />
        ) : (
          <motion.div
            className="h-full bg-gradient-to-r from-slate-600 via-gray-500 to-slate-600 opacity-30"
            animate={{
              backgroundPositionX: ["0%", "100%"],
            }}
            transition={{
              repeat: Infinity,
              duration: 4,
              ease: "linear",
            }}
            style={{ backgroundSize: "200% 100%" }}
          />
        )}
      </div>

      {/* === Header Text === */}
      <div className="z-10 flex flex-col items-center gap-2 mt-2">
        {session ? (
          <>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2"
            >
              <Sparkles className="text-cyan-400 w-5 h-5 animate-pulse" />
              <h1 className="text-xl sm:text-2xl font-semibold text-cyan-300">
                Lock in, {username ? username : "Trader"} ⚡
              </h1>
            </motion.div>

            <p className="text-gray-400 text-sm sm:text-base">
              It’s{" "}
              <span className="text-cyan-400 font-medium">{session}</span>{" "}
              session — stay sharp and execute your edge.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-200">
              Market Cooldown 💤
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">
              No active session. Review your trades or plan your next setups.
            </p>
          </>
        )}

        {/* === Live Time Display === */}
        <div className="flex items-center gap-2 mt-3 text-gray-400 text-sm">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span>{time}</span>
        </div>
      </div>

      {/* === Bottom Glow Effect === */}
      {session && (
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-[6px] rounded-full blur-md bg-cyan-500/40"
          animate={{
            opacity: [0.4, 1, 0.4],
            scaleX: [1, 1.05, 1],
          }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        />
      )}
    </div>
  );
}
