"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Maximize2,
  Minimize2,
  RefreshCcw,
  Save,
} from "lucide-react";
import { useTheme } from "next-themes";

declare global {
  interface Window {
    TradingView?: any;
  }
}

export default function TradingViewReal() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [message, setMessage] = useState("");
  const [isChartReady, setIsChartReady] = useState(false);

  // === Load TradingView ===
  useEffect(() => {
    const scriptId = "tradingview-widget-script";
    const existing = document.getElementById(scriptId);
    if (existing) existing.remove();

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;

    script.onload = () => {
      if (!window.TradingView) return;

      const savedData = localStorage.getItem("tv_chart_data");
      let parsedData = null;
      try {
        parsedData = savedData ? JSON.parse(savedData) : null;
      } catch {
        parsedData = null;
      }

      new window.TradingView.widget({
        autosize: true,
        symbol: "BTCUSDT",
        interval: "60",
        timezone: "Etc/UTC",
        theme: isDark ? "dark" : "light",
        style: "1",
        locale: "en",
        toolbar_bg: "transparent",
        hide_side_toolbar: false,
        enable_publishing: false,
        allow_symbol_change: true,
        container_id: "tradingview_real_chart",
        autosave: true,
        save_load_adapter: {
          setChartContent: (data: any) => {
            localStorage.setItem("tv_chart_data", JSON.stringify(data));
            setIsChartReady(true);
          },
          getChartContent: () => parsedData,
        },
      });

      // Initialize chart status
      setTimeout(() => {
        if (!localStorage.getItem("tv_chart_data")) {
          localStorage.setItem(
            "tv_chart_data",
            JSON.stringify({ created: Date.now() })
          );
          setIsChartReady(true);
          setMessage("📊 Chart ready to use");
          setTimeout(() => setMessage(""), 1500);
        }
      }, 2500);

      const interval = setInterval(() => {
        const chartData = localStorage.getItem("tv_chart_data");
        if (chartData) localStorage.setItem("tv_chart_data", chartData);
      }, 15000);

      return () => clearInterval(interval);
    };

    document.body.appendChild(script);
  }, [resolvedTheme]);

  // === Fullscreen ===
  const handleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // === ESC key ===
  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if (e.key === "Escape" && document.fullscreenElement) {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // === Refresh & Save ===
  const handleRefresh = () => window.location.reload();
  const handleManualSave = () => {
    const chartData = localStorage.getItem("tv_chart_data");
    if (chartData) {
      localStorage.setItem("tv_chart_data_backup", chartData);
      setMessage("✅ Chart saved successfully");
    } else {
      setMessage("⚠️ Chart not ready yet");
    }
    setTimeout(() => setMessage(""), 1500);
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-6 transition-all duration-700 ${
        isDark
          ? "bg-gradient-to-br from-[#0B0F14] via-[#111827] to-[#1E293B]"
          : "bg-gradient-to-br from-[#F9FAFB] via-[#E0F2FE] to-[#D0E2FA]"
      }`}
    >
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`relative w-full max-w-6xl rounded-2xl overflow-hidden backdrop-blur-xl shadow-2xl ${
          isFullscreen ? "fixed inset-0 z-50 rounded-none border-0" : ""
        }`}
        style={{
          background: isDark
            ? "rgba(30,41,59,0.7)"
            : "rgba(255,255,255,0.7)",
          border: isDark
            ? "1px solid rgba(56,189,248,0.25)"
            : "1px solid rgba(148,163,184,0.25)",
          boxShadow: isDark
            ? "0 0 35px rgba(56,189,248,0.15)"
            : "0 0 35px rgba(30,64,175,0.1)",
        }}
      >
        {/* === Header === */}
        {!isFullscreen && (
          <header
            className="flex items-center justify-between px-5 py-3 border-b backdrop-blur-md"
            style={{
              borderColor: isDark
                ? "rgba(56,189,248,0.25)"
                : "rgba(148,163,184,0.25)",
            }}
          >
            <div className="flex items-center gap-3">
              <LineChart
                size={22}
                className={isDark ? "text-sky-400" : "text-sky-600"}
              />
              <h2
                className="font-bold text-lg tracking-wide"
                style={{
                  color: isDark ? "#E2E8F0" : "#1E293B",
                }}
              >
                Real-Time TradingView Chart
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleManualSave}
                disabled={!isChartReady}
                title="Save Chart"
                className={`p-2 rounded-md border transition-all ${
                  isChartReady
                    ? "hover:bg-emerald-500/10 text-emerald-400 border-emerald-400/30"
                    : "opacity-50 cursor-not-allowed"
                }`}
              >
                <Save size={18} />
              </button>

              <button
                onClick={handleRefresh}
                title="Reload Chart"
                className="p-2 rounded-md border border-sky-400/30 text-sky-400 hover:bg-sky-400/10 transition"
              >
                <RefreshCcw size={18} />
              </button>

              <button
                onClick={handleFullscreen}
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Mode"}
                className="p-2 rounded-md border border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10 transition"
              >
                {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </button>
            </div>
          </header>
        )}

        {/* === Chart Container === */}
        <div
          id="tradingview_real_chart"
          className={`transition-all duration-500 ${
            isFullscreen ? "w-screen h-screen" : "h-[520px] w-full"
          } overflow-hidden`}
        ></div>

        {/* === Floating Exit Button === */}
        {isFullscreen && (
          <button
            onClick={handleFullscreen}
            className="fixed top-4 right-4 z-[100] p-2 rounded-md text-white bg-black/30 backdrop-blur-md hover:bg-black/50 transition"
            title="Exit Fullscreen"
          >
            <Minimize2 size={20} />
          </button>
        )}

        {/* === Status Message === */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-4 right-4 px-4 py-2 rounded-xl text-sm font-medium shadow-lg backdrop-blur-md"
            style={{
              background: isDark
                ? "rgba(0,0,0,0.6)"
                : "rgba(255,255,255,0.85)",
              color: isDark ? "#34D399" : "#0369A1",
              border: isDark
                ? "1px solid rgba(56,189,248,0.2)"
                : "1px solid rgba(56,189,248,0.2)",
            }}
          >
            {message}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
