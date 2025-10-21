"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Sun, Moon } from "lucide-react";
import Link from "next/link";
import Logo from "@/components/Logo";

export default function Navbar({ isDark }: { isDark: boolean }) {
  const { setTheme } = useTheme();

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-wrap items-center justify-between w-full px-5 sm:px-8 py-4 sm:py-6 z-20 backdrop-blur-md"
    >
      {/* === Brand Logo === */}
      <Logo isDark={isDark} />

      {/* === Actions === */}
      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mt-3 sm:mt-0">
        {/* === Theme Switch === */}
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
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </motion.button>

        {/* === Auth Section === */}
        <SignedOut>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center">
            <Link href="/signin">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="w-full sm:w-auto px-5 py-2 rounded-md font-semibold text-white bg-gradient-to-r from-sky-500 to-blue-600 shadow-md hover:shadow-lg hover:opacity-90 transition-all"
              >
                Sign In
              </motion.button>
            </Link>

            <Link href="/signup">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className={`w-full sm:w-auto px-5 py-2 rounded-md font-semibold border-2 ${
                  isDark
                    ? "border-emerald-400/70 text-emerald-400 hover:bg-emerald-400/10"
                    : "border-blue-600/60 text-blue-600 hover:bg-blue-600/10"
                } transition-all`}
              >
                Start Now
              </motion.button>
            </Link>
          </div>
        </SignedOut>

        {/* === Signed-in user avatar === */}
        <SignedIn>
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
        </SignedIn>
      </div>
    </motion.nav>
  );
}
