"use client";

import Link from "next/link";
import {
  FaGithub,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaDiscord,
} from "react-icons/fa";
import { SiOpenai } from "react-icons/si";
import Logo from "@/components/Logo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#0B0F14] text-gray-400 border-t border-gray-800 px-6 sm:px-10 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* === Logo & Description === */}
        <div>
          <div className="mb-4 w-32 sm:w-40 md:w-48">
            <Logo />
          </div>
          <p className="text-sm leading-relaxed max-w-xs text-gray-400">
            The next-generation AI-powered trading journal — built for traders
            who demand precision, discipline, and consistent growth.
          </p>
        </div>

        {/* === Quick Links === */}
        <div>
          <h3 className="text-gray-200 font-semibold text-lg mb-3">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm">
            {[
              { name: "Dashboard", href: "/dashboard" },
              { name: "Forex Calculator", href: "/forex-calculator" },
              { name: "Pricing Plans", href: "/pricing" },
              { name: "Contact Us", href: "/contact" },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="hover:text-cyan-300 transition-colors duration-200"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* === Resources === */}
        <div>
          <h3 className="text-gray-200 font-semibold text-lg mb-3">
            Resources
          </h3>
          <ul className="space-y-2 text-sm">
            {[
              { name: "How to use DC Trades", href: "/how-to-use" },
              { name: "Documentation", href: "/docs" },
              { name: "Discord Community", href: "https://discord.gg/77Qckz6V" },
              { name: "Privacy Policy", href: "/privacy" },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="hover:text-cyan-300 transition-colors duration-200"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* === Connect & Branding === */}
        <div>
          <h3 className="text-gray-200 font-semibold text-lg mb-3">
            Connect with Us
          </h3>
          <div className="flex items-center gap-5 mb-5">
            {[
              { Icon: FaDiscord, href: "https://discord.gg/YJnTSH8S", color: "#5865F2" },
              { Icon: FaGithub, href: "https://github.com/", color: "#D1D5DB" },
              { Icon: FaTwitter, href: "https://x.com/", color: "#1DA1F2" },
              { Icon: FaInstagram, href: "https://instagram.com/", color: "#E4405F" },
              { Icon: FaLinkedin, href: "https://linkedin.com/", color: "#0A66C2" },
            ].map(({ Icon, href, color }) => (
              <Link
                key={href}
                href={href}
                target="_blank"
                className="hover:scale-110 transition-transform duration-300"
              >
                <Icon className="w-6 h-6" style={{ color }} />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <SiOpenai className="w-5 h-5 text-cyan-400" />
            <p className="text-xs sm:text-sm italic">
              Powered by{" "}
              <span className="text-cyan-300 font-semibold">GK Intelligence</span>
            </p>
          </div>
        </div>
      </div>

      {/* === Copyright === */}
      <div className="mt-12 pt-6 border-t border-gray-800 text-center">
        <p className="text-gray-500 text-xs sm:text-sm">
          © {currentYear}{" "}
          <span className="font-semibold text-cyan-300">DC Trades</span> — Built
          by Traders, for Traders.
        </p>
      </div>
    </footer>
  );
}
