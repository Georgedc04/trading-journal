"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, SignOutButton, useUser } from "@clerk/nextjs";
import { useState } from "react";
import {
  Home,
  BarChart3,
  Settings,
  Menu,
  X,
  Youtube,
  Instagram,
  Facebook,
  MessageCircle,
  Calculator,
  CreditCard,
  LineChart,
  Brain,
  LogOut,
  Shield,
} from "lucide-react";
import { motion } from "framer-motion";

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { user } = useUser(); // ✅ Get current user

  const role = user?.publicMetadata?.role || "USER"; // ✅ Check role (ADMIN or USER)

  const navLinks = [
    { href: "/dashboard", icon: Home, label: "Dashboard" },
    { href: "/performance", icon: BarChart3, label: "Performance" },
    { href: "/insight", icon: Brain, label: "AI Insight" },
    { href: "/tradesform", icon: LineChart, label: "Trade Timeline" },
    { href: "/calculator", icon: Calculator, label: "Calculator" },
    { href: "/plans", icon: CreditCard, label: "Plans" },
    { href: "/settings", icon: Settings, label: "Settings" },
  ];

  const socialLinks = [
    { icon: DiscordIcon, href: "https://discord.com", color: "text-sky-400" },
    { icon: Facebook, href: "https://facebook.com", color: "text-blue-500" },
    { icon: Instagram, href: "https://instagram.com", color: "text-pink-500" },
    { icon: Youtube, href: "https://youtube.com", color: "text-red-500" },
  ];

  return (
    <>
      {/* 🔹 Mobile Toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md shadow-md transition-all duration-300 bg-sky-500 hover:bg-sky-400 text-black"
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* 🔹 Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 z-40 border-r shadow-xl transform transition-transform duration-300 ease-in-out backdrop-blur-xl ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } bg-[#0B0F14]/90 border-sky-400/10 text-gray-100`}
      >
        <div className="flex flex-col h-full p-5">
          {/* 🔹 Logo */}
          <Link href="/" className="no-underline">
            <div className="text-2xl font-bold mb-8 bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent cursor-pointer hover:opacity-90 transition-opacity duration-200">
              DC Trades
            </div>
          </Link>

          {/* 🔹 Navigation */}
          <nav className="flex flex-col gap-2 mb-8">
            {navLinks.map(({ href, icon: Icon, label }) => (
              <Link key={href} href={href}>
                <div
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-all mb-0.5 border-2 border-transparent ${
                    pathname === href
                      ? "bg-gradient-to-r from-sky-500 to-cyan-400 text-black font-semibold shadow-md"
                      : "text-gray-400 hover:bg-sky-500/10 hover:border-cyan-400"
                  } ${
                    href === "/insight"
                      ? "animate-pulse border-l-4 border-l-sky-400"
                      : "border-l-4 border-l-sky-700/40"
                  }`}
                >
                  <Icon size={18} />
                  {label}
                </div>
              </Link>
            ))}
          </nav>

          <div className="border-t my-4 border-sky-400/10" />

          {/* 🔹 Social Media */}
          <div className="flex justify-between mt-auto pt-4">
            {socialLinks.map(({ icon: Icon, href, color }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`hover:scale-110 transition-transform ${color}`}
              >
                <Icon size={20} />
              </a>
            ))}
          </div>

          {/* 🔹 User Section */}
          <div className="mt-6 flex items-center justify-between text-sm text-gray-400">
            {/* 👤 User Button + Sign Out */}
            <div className="flex items-center gap-2">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: {
                      border: "2px solid #38BDF8",
                      boxShadow: "0 0 10px rgba(56,189,248,0.4)",
                    },
                  },
                }}
                afterSignOutUrl="/"
              />
            </div>

            <SignOutButton>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-full shadow-md font-semibold text-xs bg-gradient-to-r from-emerald-500 to-teal-400 text-white hover:opacity-90 transition-all"
              >
                <LogOut size={14} />
              </motion.button>
            </SignOutButton>
          </div>

          {/* 🔹 Conditional Admin Section */}
          <div className="mt-4 text-center">
            {role === "ADMIN" ? (
              <Link href="/admin">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 mt-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-semibold rounded-lg shadow-md hover:opacity-90 transition-all"
                >
                  <Shield size={16} /> Admin Dashboard
                </motion.button>
              </Link>
            ) : (
              <span className="text-gray-400 text-xs">Hello, Trader</span>
            )}
          </div>
        </div>
      </aside>

      {/* 🔹 Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}

/* ✅ Custom Discord Icon */
function DiscordIcon({ size = 20 }: { size?: number }) {
  return (
    <MessageCircle
      size={size}
      className="text-sky-400"
      style={{ transform: "rotate(-10deg)" }}
    />
  );
}
