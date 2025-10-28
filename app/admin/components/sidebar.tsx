"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";
import {
  Users,
  BookOpen,
  Activity,
  ShieldCheck,
  UserCog,
  LogOut,
  Megaphone,
  LineChart,
} from "lucide-react";

export default function Sidebar({
  tab,
  setTab,
}: {
  tab: string;
  setTab: (v: string) => void;
}) {
  const buttons = [
    { label: "Users", icon: <Users size={18} />, id: "users", path: "/users" },
    { label: "Journals Analytics", icon: <BookOpen size={18} />, id: "journals", path: "/journals" },
    { label: "Announcements", icon: <Megaphone size={18} />, id: "announcements", path: "/announcements" },
    { label: "Reports", icon: <Activity size={18} />, id: "reports", path: "/reports" },
    { label: "Security Logs", icon: <ShieldCheck size={18} />, id: "security", path: "/security" },
    { label: "Admin Settings", icon: <UserCog size={18} />, id: "settings", path: "/settings" },
  ];

  return (
    <aside className="w-64 bg-[#0E1522]/90 border-r border-cyan-400/10 p-5 hidden md:flex flex-col">
      {/* === Header === */}
      <div className="text-2xl font-bold bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent mb-8">
        Admin Panel
      </div>

      {/* === Navigation === */}
      <nav className="flex flex-col gap-3">
        {buttons.map((b) => (
          <Link key={b.id} href={`/admin${b.path}`} onClick={() => setTab(b.id)}>
            <motion.button
              whileHover={{ scale: 1.03 }}
              className={`flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm transition-all ${
                tab === b.id
                  ? "bg-gradient-to-r from-sky-500 to-cyan-400 text-black font-semibold"
                  : "text-gray-400 hover:bg-cyan-400/10"
              }`}
            >
              {b.icon} {b.label}
            </motion.button>
          </Link>
        ))}
      </nav>

      {/* === Trading Dashboard Button === */}
      <div className="mt-8">
       <Link href={`${process.env.NEXT_PUBLIC_URL || ""}/dashboard`} prefetch={false}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-2 rounded-md bg-gradient-to-r from-amber-400 to-yellow-300 text-black font-semibold text-sm flex items-center justify-center gap-2 shadow-md hover:opacity-90 transition-all"
          >
            <LineChart size={16} /> Trading Dashboard
          </motion.button>
        </Link>

      </div>

      {/* === Sign Out === */}
      <div className="mt-auto pt-6 border-t border-cyan-400/10">
        <SignOutButton>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="w-full py-2 mt-2 rounded-md bg-gradient-to-r from-emerald-500 to-teal-400 text-white font-semibold text-sm flex items-center justify-center gap-2"
          >
            <LogOut size={16} /> Sign Out
          </motion.button>
        </SignOutButton>
      </div>
    </aside>
  );
}
