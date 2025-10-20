"use client";

import React, { useEffect, useRef, useState } from "react";
import { createChart, LineData } from "lightweight-charts";
import { motion } from "framer-motion";
import {
  LineChart,
  Save,
  RefreshCcw,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useUser } from "@clerk/nextjs";
import { saveChartToServer, loadChartFromServer } from "../lib/chartApi";

export default function ChartWithSave() {
  const { resolvedTheme } = useTheme();
  const { user } = useUser();

  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const seriesRef = useRef<any>(null);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [message, setMessage] = useState("");
  const [markers, setMarkers] = useState<any[]>([]);
  const [symbol, setSymbol] = useState("BTCUSDT");

  const isDark = resolvedTheme === "dark";

  // 🎨 Theme Palette
  const palette = isDark
    ? {
        bg: "linear-gradient(135deg, #0A0F1C, #111827)",
        card: "rgba(15,23,42,0.9)",
        border: "rgba(56,189,248,0.3)",
        text: "#E2E8F0",
        primary: "#38BDF8",
        glow: "rgba(56,189,248,0.35)",
        line: "#22C55E",
      }
    : {
        bg: "linear-gradient(135deg, #F9FAFB, #E0F2FE)",
        card: "rgba(255,255,255,0.9)",
        border: "rgba(37,99,235,0.25)",
        text: "#1E293B",
        primary: "#2563EB",
        glow: "rgba(37,99,235,0.25)", 
        line: "#8B593E",
      };

  // 🧩 Initialize Chart + Data
  useEffect(() => {
    if (!containerRef.current) return;

    // Clean up existing chart
    chartRef.current?.remove?.();

    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: isFullscreen ? window.innerHeight : 520,
      layout: {
        background: { color: "transparent" }, // ✅ fixed key
        textColor: palette.text,
      },
      grid: {
        vertLines: { color: isDark ? "#1E293B" : "#E2E8F0" },
        horzLines: { color: isDark ? "#1E293B" : "#E2E8F0" },
      },
      crosshair: { mode: 1 },
      rightPriceScale: {
        borderColor: isDark ? "#334155" : "#CBD5E1",
      },
      timeScale: {
        borderColor: isDark ? "#334155" : "#CBD5E1",
      },
    });

    chartRef.current = chart;

    // ✅ Safe series initialization
    const series = chart.addLineSeries({
      color: palette.line,
      lineWidth: 2,
    });
    seriesRef.current = series;

    // === Fetch Live Data ===
    const fetchData = async () => {
      try {
        const res = await fetch(
          `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1m&limit=100`
        );

        if (!res.ok) throw new Error("Failed to fetch data");
        const data = await res.json();

        const formatted: LineData[] = data.map((d: any) => ({
          time: d[0] / 1000,
          value: parseFloat(d[4]),
        }));

        if (seriesRef.current) seriesRef.current.setData(formatted);
      } catch (error) {
        console.error("❌ Live data fetch failed:", error);

        // ✅ Safe fallback
        const now = Math.floor(Date.now() / 1000);
        const fallback = Array.from({ length: 100 }, (_, i) => ({
          time: now - (100 - i) * 60,
          value: 1.085 + Math.sin(i / 6) * 0.002,
        })) as LineData[];

        if (seriesRef.current) seriesRef.current.setData(fallback);
      }
    };

    fetchData();

    // ✅ Resize Handling
    const handleResize = () => {
      chart.applyOptions({
        width: containerRef.current?.clientWidth ?? 600,
        height: isFullscreen ? window.innerHeight : 520,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isDark, isFullscreen, symbol]);

  // 🧩 Load User Chart
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const layout = await loadChartFromServer();
        if (layout?.data && seriesRef.current) {
          seriesRef.current.setData(layout.data);
        }
        if (layout?.markers) setMarkers(layout.markers);
        setMessage("✅ Chart loaded");
        setTimeout(() => setMessage(""), 1500);
      } catch (err) {
        console.error("Load failed:", err);
      }
    })();
  }, [user]);

  // 💾 Save Chart
  const handleSave = async () => {
    const data = (seriesRef.current as any)?._data ?? [];
    const payload = { data, markers, symbol };

    localStorage.setItem("chart_data_v3", JSON.stringify(data));
    try {
      await saveChartToServer(payload);
      setMessage("✅ Chart saved!");
    } catch (err: any) {
      console.error(err);
      setMessage("❌ Save failed");
    } finally {
      setTimeout(() => setMessage(""), 1500);
    }
  };

  // ♻️ Reset Chart
  const handleReset = () => {
    localStorage.removeItem("chart_data_v3");
    window.location.reload();
  };

  // 🖥️ Fullscreen
  const handleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 transition-all duration-500"
      style={{
        background: palette.bg,
        color: palette.text,
      }}
    >
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-6xl rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background: palette.card,
          border: `1px solid ${palette.border}`,
          boxShadow: `0 0 30px ${palette.glow}`,
        }}
      >
        {/* === Header === */}
        {!isFullscreen && (
          <header
            className="flex items-center justify-between px-5 py-3 border-b backdrop-blur-sm"
            style={{ borderColor: palette.border }}
          >
            <div className="flex items-center gap-2">
              <LineChart size={22} color={palette.primary} />
              <h2 className="font-bold text-lg tracking-wide">
                Live Trading Chart ({symbol})
              </h2>
            </div>

            <div className="flex items-center gap-2">
              {/* Symbol Selector */}
              <select
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                className="border rounded-md px-2 py-1 text-sm bg-transparent"
                style={{ borderColor: palette.border, color: palette.text }}
              >
                <option value="BTCUSDT">BTC/USDT</option>
                <option value="ETHUSDT">ETH/USDT</option>
                <option value="EURUSDT">EUR/USDT</option>
                <option value="GBPUSDT">GBP/USDT</option>
                <option value="XRPUSDT">XRP/USDT</option>
              </select>

              {[ 
                { icon: Save, action: handleSave, title: "Save Chart" },
                { icon: RefreshCcw, action: handleReset, title: "Reset Chart" },
                {
                  icon: isFullscreen ? Minimize2 : Maximize2,
                  action: handleFullscreen,
                  title: isFullscreen ? "Exit Fullscreen" : "Fullscreen",
                },
              ].map(({ icon: Icon, action, title }, i) => (
                <button
                  key={i}
                  onClick={action}
                  title={title}
                  className="p-2 rounded-md border transition-all duration-200"
                  style={{
                    borderColor: palette.border,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = palette.glow)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <Icon size={18} color={palette.primary} />
                </button>
              ))}
            </div>
          </header>
        )}

        {/* === Chart === */}
        <div
          id="chart_container"
          className={`transition-all duration-500 ${
            isFullscreen ? "w-screen h-screen" : "h-[520px] w-full"
          } overflow-hidden`}
        ></div>

        {/* === Status Message === */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-3 right-3 px-3 py-1 rounded-lg text-sm font-medium"
            style={{
              background: isDark ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.8)",
              color: palette.line,
              boxShadow: `0 0 10px ${palette.glow}`,
            }}
          >
            {message}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
