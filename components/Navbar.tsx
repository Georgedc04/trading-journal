"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { SignedIn, SignedOut, UserButton, SignOutButton } from "@clerk/nextjs";
import { Sun, Moon, LogOut } from "lucide-react";
import Link from "next/link";
import Logo from "@/components/Logo";

export default function Navbar({ isDark }: { isDark: boolean }) {
  const { setTheme } = useTheme();

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-wrap items-center justify-between w-full px-4 sm:px-8 py-3 sm:py-5 z-20 backdrop-blur-md"
    >
      {/* === Brand Logo === */}
      <div className="flex-shrink-0">
        <Logo isDark={isDark} />
      </div>

      {/* === Right Actions === */}
      <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 sm:gap-4 mt-3 sm:mt-0">
        {/* === Theme Toggle === */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className={`p-2 rounded-full border transition-all duration-300 ${
            isDark
              ? "border-emerald-400/40 text-emerald-400 hover:bg-emerald-400/10"
              : "border-blue-600/40 text-blue-600 hover:bg-blue-600/10"
          }`}
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </motion.button>

        {/* === When Not Signed In === */}
        <SignedOut>
          <div className="flex flex-row items-center justify-center gap-2 sm:gap-3 w-auto">
            {/* === Sign In Button === */}
            <Link href="/signin">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="px-3 sm:px-5 py-1 sm:py-2 rounded-md font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-sky-500 to-blue-600 shadow-sm sm:shadow-md hover:shadow-lg hover:opacity-90 transition-all duration-300"
              >
                Sign In
              </motion.button>
            </Link>

            {/* === Start Now Button === */}
            <Link href="/signup">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className={`px-3 sm:px-5 py-1 sm:py-2 rounded-md font-semibold text-xs sm:text-sm border-2 transition-all duration-300 ${
                  isDark
                    ? "border-emerald-400/70 text-emerald-400 hover:bg-emerald-400/10"
                    : "border-blue-600/60 text-blue-600 hover:bg-blue-600/10"
                }`}
              >
                Start Now
              </motion.button>
            </Link>
          </div>
        </SignedOut>

        {/* === When Signed In === */}
        <SignedIn>
          <div className="flex items-center gap-2 sm:gap-3">
            {/* User Profile */}
            <UserButton
              appearance={{
                elements: {
                  avatarBox: {
                    border: isDark
                      ? "2px solid #34D399"
                      : "2px solid #2563EB",
                    boxShadow: isDark
                      ? "0 0 10px rgba(52,211,153,0.4)"
                      : "0 0 10px rgba(37,99,235,0.3)",
                  },
                },
              }}
              afterSignOutUrl="/"
            />

            {/* Sign Out Sticker */}
            <SignOutButton>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center justify-center gap-1 px-3 sm:px-4 py-1 sm:py-2 rounded-full shadow-md font-semibold text-xs sm:text-sm ${
                  isDark
                    ? "bg-gradient-to-r from-emerald-500 to-teal-400 text-white hover:opacity-90"
                    : "bg-gradient-to-r from-blue-600 to-sky-400 text-white hover:opacity-90"
                }`}
              >
                <LogOut size={14} />
              </motion.button>
            </SignOutButton>
          </div>
        </SignedIn>
      </div>
    </motion.nav>
  );
}
