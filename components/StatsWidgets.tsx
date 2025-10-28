"use client";

import { JSX, useEffect, useState } from "react";
import { FaUsers, FaChartLine } from "react-icons/fa";

export default function StatsWidgets() {
  const [stats, setStats] = useState({ totalUsers: 0, totalTrades: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/stats", { cache: "no-store" });
        const data = await res.json();
        setStats({
          totalUsers: data.totalUsers || 0,
          totalTrades: data.totalTrades || 0,
        });
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <section className="relative w-full py-20 overflow-hidden flex justify-center items-center text-gray-100">
      {/* 🎥 Background image only for widget area */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25 bg-animate"
        style={{
          backgroundImage: "url('/candlestick-bg.jpg')",
        }}
      />

      {/* 🌌 Smooth fade blend top & bottom */}
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-[#0B0F14] to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#0B0F14] to-transparent pointer-events-none" />

      {/* 🧊 Glassy widgets container */}
      <div className="relative z-10 flex flex-wrap justify-center gap-20">
        <StatItem
          icon={<FaUsers className="text-3xl text-cyan-400 drop-shadow-lg" />}
          title="Trusted Traders"
          value={stats.totalUsers}
          text="Active traders building consistency on DC Trades."
          color="text-cyan-300"
          loading={loading}
        />
        <StatItem
          icon={<FaChartLine className="text-3xl text-emerald-400 drop-shadow-lg" />}
          title="Trades Recorded"
          value={stats.totalTrades}
          text="Total trades analyzed and journaled by our community."
          color="text-emerald-400"
          loading={loading}
        />
      </div>
    </section>
  );
}

/* === Glassy Stat Card === */
function StatItem({
  icon,
  title,
  value,
  text,
  color,
  loading,
}: {
  icon: JSX.Element;
  title: string;
  value: number;
  text: string;
  color: string;
  loading?: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (loading) return;
    let start = 0;
    const end = value;
    const duration = 1200;
    const increment = Math.ceil(end / (duration / 30));

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setCount(start);
    }, 30);

    return () => clearInterval(timer);
  }, [value, loading]);

  return (
    <div
      className="
        text-center px-8 py-6
        backdrop-blur-lg bg-[rgba(15,23,42,0.1)]
        border border-cyan-400/20
        rounded-3xl
        shadow-[0_0_30px_rgba(56,189,248,0.15)]
        hover:shadow-[0_0_35px_rgba(56,189,248,0.3)]
        transition-all duration-500
        w-72
      "
    >
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-sm font-semibold text-cyan-300 tracking-wide mb-1">
        {title}
      </h3>
      <p
        className={`text-3xl font-extrabold ${color} mb-3 drop-shadow-md transition-all duration-300`}
      >
        {loading ? "Loading..." : `${count.toLocaleString()}+`}
      </p>
      <p className="text-gray-400 text-sm leading-relaxed">{text}</p>
    </div>
  );
}
