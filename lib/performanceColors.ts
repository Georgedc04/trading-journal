// 🎨 lib/performanceColors.ts
// DC Trades Performance Color System — Dark Mode Default Only

export const PERFORMANCE_COLORS = {
  // 🌙 Dark Mode Palette (Default)
  dark: {
    // 🩶 Base Layout
    background: "#0B0F14", // deep graphite navy
    card: "#111827", // smooth dark slate for panels
    text: "#E5E7EB", // neutral soft white
    subText: "#9CA3AF", // muted gray text
    border: "rgba(56,189,248,0.25)", // subtle cyan border-glow

    // 🌈 Accents
    accentBlue: "#38BDF8", // cyan-blue (primary)
    accentIndigo: "#3B82F6", // cool blue secondary
    accentViolet: "#6366F1", // violet edge for gradients

    // 📊 Charts / Data
    profit: "#22C55E", // premium green
    loss: "#EF4444", // bold red
    neutral: "#FACC15", // soft yellow
    grid: "rgba(56,189,248,0.08)", // faint bluish grid lines

    // 🗓️ Calendar
    calendarProfitBg: "rgba(34,197,94,0.15)",
    calendarLossBg: "rgba(239,68,68,0.15)",
    todayBg: "rgba(56,189,248,0.15)",
    todayText: "#38BDF8",

    // 🧠 Shadows
    shadow: "rgba(56,189,248,0.2)", // subtle cyan-blue glow
  },
};

// ✅ Always return dark mode palette (no light mode)
export const getPerformanceColors = () => PERFORMANCE_COLORS.dark;
