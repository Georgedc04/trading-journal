"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserButton } from "@clerk/nextjs"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
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
} from "lucide-react"

export default function Sidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { theme, systemTheme } = useTheme()
  const [currentTheme, setCurrentTheme] = useState("dark")

  useEffect(() => {
    const activeTheme = theme === "system" ? systemTheme : theme
    setCurrentTheme(activeTheme || "dark")
  }, [theme, systemTheme])

  const isDark = currentTheme === "dark"

  const navLinks = [
    { href: "/dashboard", icon: Home, label: "Dashboard" },
    { href: "/performance", icon: BarChart3, label: "Performance" },
    { href: "/insight", icon: Brain, label: "AI Insight" },
    { href: "/calculator", icon: Calculator, label: "Calculator" },
    { href: "/tradingview", icon: LineChart, label: "Trading View" },
    { href: "/plans", icon: CreditCard, label: "Plans" },
    { href: "/settings", icon: Settings, label: "Settings" },
  ]

  const socialLinks = [
    { icon: DiscordIcon, href: "https://discord.com", color: "text-sky-400" },
    { icon: Facebook, href: "https://facebook.com", color: "text-blue-500" },
    { icon: Instagram, href: "https://instagram.com", color: "text-pink-500" },
    { icon: Youtube, href: "https://youtube.com", color: "text-red-500" },
  ]

  return (
    <>
      {/* 🔹 Mobile Toggle */}
      <button
        onClick={() => setOpen(!open)}
        className={`lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md shadow-md transition-all duration-300 ${
          isDark
            ? "bg-sky-500 hover:bg-sky-400 text-black"
            : "bg-blue-600 hover:bg-blue-500 text-white"
        }`}
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* 🔹 Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 z-40 border-r shadow-xl transform transition-transform duration-300 ease-in-out backdrop-blur-xl ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${
          isDark
            ? "bg-[#0B0F14]/80 border-sky-400/10 text-gray-100"
            : "bg-white/80 border-blue-600/10 text-gray-800"
        }`}
      >
        <div className="flex flex-col h-full p-5">
          {/* 🔹 Logo */}
          <Link href="/" className="no-underline">
            <div
              className={`text-2xl font-bold mb-8 bg-gradient-to-r ${
                isDark
                  ? "from-sky-400 via-cyan-300 to-blue-600"
                  : "from-blue-600 via-sky-400 to-cyan-300"
              } bg-clip-text text-transparent cursor-pointer hover:opacity-90 transition-opacity duration-200`}
            >
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
                    ? isDark
                      ? "bg-gradient-to-r from-sky-500 to-cyan-400 text-black font-semibold shadow-md"
                      : "bg-gradient-to-r from-blue-600 to-sky-400 text-white font-semibold"
                    : isDark
                    ? "text-gray-400 hover:bg-sky-500/10 hover:border-cyan-400"
                    : "text-gray-700 hover:bg-blue-600/10 hover:text-blue-600"
                } ${
                  href === "/insight"
                    ? "animate-pulse border-l-4 border-l-sky-400 " // <- use border-l-sky-400
                    : "border-l-4 border-l-blue-600/50"
                }`}
              >
                <Icon 
                size={18} />
                {label}
              </div>
            </Link>
          ))}
        </nav>
          <div
            className={`border-t my-4 ${
              isDark ? "border-sky-400/10" : "border-blue-600/20"
            }`}
          />

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
          <div
            className={`mt-6 flex items-center justify-between text-sm ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            <span>Hello, Trader 👋</span>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: {
                    border: isDark
                      ? "2px solid #38BDF8"
                      : "2px solid #2563EB",
                    boxShadow: isDark
                      ? "0 0 10px rgba(56,189,248,0.4)"
                      : "0 0 10px rgba(37,99,235,0.3)",
                  },
                },
              }}
              afterSignOutUrl="/"
            />
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
  )
}

/* ✅ Custom Discord Icon */
function DiscordIcon({ size = 20 }: { size?: number }) {
  return (
    <MessageCircle
      size={size}
      className="text-sky-400"
      style={{ transform: "rotate(-10deg)" }}
    />
  )
}
