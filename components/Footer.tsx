"use client";

import Link from "next/link";
import { FaDiscord } from "react-icons/fa";
import { SiOpenai } from "react-icons/si"; // 🧠 AI sticker icon

export default function Footer({ ACTIVE }: any) {
  return (
    <footer className="flex flex-col items-center justify-center py-6 space-y-3 relative z-10">
      {/* === Main Text === */}
      <p
        className={`text-center text-sm sm:text-base transition-colors duration-300 ${ACTIVE.subText}`}
      >
        © {new Date().getFullYear()}{" "}
        <span className={`font-semibold tracking-wide ${ACTIVE.accent}`}>
          DC Trades
        </span>{" "}
        •  Built for Traders. 
        
      </p>

      {/* === AI Sticker === */}
      <div className="flex items-center gap-2 mt-1">
        <SiOpenai
          className="text-sky-400 w-5 h-5 animate-pulse drop-shadow-[0_0_10px_rgba(56,189,248,0.6)]"
        />
        <span
          className={`text-xs sm:text-sm italic tracking-wide ${ACTIVE.subText}`}
        >
          • <span className={`font-semibold tracking-wide ${ACTIVE.accent}`}>
          GK
        </span>{" "} Intelligence •
        </span>
      </div>

      {/* === Discord Link === */}
      <Link
        href="https://discord.gg/YJnTSH8S"
        target="_blank"
        className="flex items-center gap-2 text-xs sm:text-sm font-medium mt-1 transition-all duration-300 hover:scale-105 hover:opacity-90"
      >
        <FaDiscord
          className="text-[#5865F2] w-4 h-4 drop-shadow-[0_0_6px_rgba(88,101,242,0.5)]"
        />
        <span className={ACTIVE.subText}>
          Join our{" "}
          <span className="font-semibold text-[#5865F2]">
            Discord Community
          </span>
        </span>
      </Link>
    </footer>
  );
}
