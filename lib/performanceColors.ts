// 🎨 lib/performanceColors.ts
// Centralized color system for DC Trades Performance (Calendar, Charts, Stats)

export const PERFORMANCE_COLORS = {
  dark: {
    // 🩶 Base Layout
    background: "#0B0F14", // dark graphite blue-black (deep but not flat)
    card: "#111827", // soft navy-gray for panels
    text: "#E5E7EB", // neutral white-gray for text
    subText: "#9CA3AF", // softer muted text
    border: "rgba(56, 189, 248, 0.25)", // subtle cyan border glow

    // 🌈 Accents
    accentBlue: "#38BDF8", // cyan-blue (primary DC Trades accent)
    accentIndigo: "#3B82F6", // secondary cool blue
    accentViolet: "#6366F1", // smooth gradient endpoint

    // 📊 Charts / Data
    profit: "#22C55E", // premium green
    loss: "#EF4444", // balanced red
    neutral: "#FACC15", // warm yellow tone
    grid: "rgba(56,189,248,0.08)", // subtle bluish grid for clarity

    // 🗓️ Calendar
    calendarProfitBg: "rgba(34,197,94,0.15)",
    calendarLossBg: "rgba(239,68,68,0.15)",
    todayBg: "rgba(56,189,248,0.15)",
    todayText: "#38BDF8",

    // 🧠 Shadows
    shadow: "rgba(56,189,248,0.2)", // smooth blue-cyan glow
  },

  light: {
    // ☀️ Base Layout
    background: "#F9FAFB", // soft light background
    card: "#FFFFFF", // crisp white panels
    text: "#111827", // dark neutral text
    subText: "#6B7280", // softer gray text
    border: "rgba(37,99,235,0.15)", // subtle blue border

    // 🌈 Accents
    accentBlue: "#2563EB", // rich blue accent
    accentIndigo: "#3B82F6",
    accentViolet: "#6366F1",

    // 📊 Charts / Data
    profit: "#16A34A", // green
    loss: "#DC2626", // red
    neutral: "#EAB308", // yellow
    grid: "rgba(37,99,235,0.08)", // light blue grid

    // 🗓️ Calendar
    calendarProfitBg: "rgba(34,197,94,0.12)",
    calendarLossBg: "rgba(239,68,68,0.12)",
    todayBg: "rgba(37,99,235,0.1)",
    todayText: "#2563EB",

    // 🧠 Shadows
    shadow: "rgba(37,99,235,0.15)", // soft cool glow
  },
}

// ✅ Helper hook to access current mode palette
export const getPerformanceColors = (isDark: boolean) =>
  isDark ? PERFORMANCE_COLORS.dark : PERFORMANCE_COLORS.light
