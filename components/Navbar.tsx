"use client";

import { motion } from "framer-motion";
import { SignedIn, SignedOut, UserButton, SignOutButton } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
import Link from "next/link";
import Logo from "@/components/Logo";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-wrap items-center justify-between w-full px-4 sm:px-8 py-3 sm:py-5 z-20 backdrop-blur-md bg-[#0B0F14]/10 text-slate-200 shadow-lg"
    >
      {/* === Brand Logo === */}
      <div className="flex-shrink-0">
        <Logo />
      </div>

      {/* === Right Actions === */}
      <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 sm:gap-4 mt-3 sm:mt-0">
        {/* === When Not Signed In === */}
        <SignedOut>
          <div className="flex flex-row items-center justify-center gap-2 sm:gap-3 w-auto">
            {/* === Sign In Button === */}
            <Link href="/signin">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="px-3 sm:px-5 py-1 sm:py-2 rounded-md font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-sky-500 to-cyan-400 shadow-md hover:opacity-90 transition-all duration-300"
              >
                Sign In
              </motion.button>
            </Link>

            {/* === Start Now Button === */}
            <Link href="/signup">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="px-3 sm:px-5 py-1 sm:py-2 rounded-md font-semibold text-xs sm:text-sm border-2 border-emerald-400/70 text-emerald-400 hover:bg-emerald-400/10 transition-all duration-300"
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
                    border: "2px solid #34D399",
                    boxShadow: "0 0 10px rgba(52,211,153,0.4)",
                  },
                },
              }}
              afterSignOutUrl="/"
            />

            {/* Sign Out Button */}
            <SignOutButton>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center gap-1 px-3 sm:px-4 py-1 sm:py-2 rounded-full shadow-md font-semibold text-xs sm:text-sm bg-gradient-to-r from-emerald-500 to-teal-400 text-white hover:opacity-90"
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
