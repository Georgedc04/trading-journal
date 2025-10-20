// 🎨 lib/TradeCalender.ts
// Unified color system for DC Trades Calendar & UI elements

export const COLORS = {
  dark: {
    // === Backgrounds ===
    bg: "linear-gradient(135deg, #0B0F14 0%, #111827 50%, #161C23 100%)", // deep graphite blue-black
    surface: "rgba(17, 24, 39, 0.9)", // glass-like surface layer

    // === Text ===
    text: "#E5E7EB", // clean neutral white-gray
    subText: "#9CA3AF", // muted soft text

    // === Accents ===
    accent: "#38BDF8", // modern cyan-blue accent (brand tone)
    border: "rgba(56, 189, 248, 0.25)", // subtle blue border
    cardGlow: "rgba(56, 189, 248, 0.15)", // soft glowing cyan highlight

    // === Trade Colors ===
    profit: "#22C55E", // vibrant green
    loss: "#EF4444", // calm red
  },

  light: {
    // === Backgrounds ===
    bg: "linear-gradient(135deg, #F9FAFB 0%, #FFFFFF 50%, #F3F4F6 100%)", // clean, professional gradient
    surface: "#FFFFFF", // elevated cards and modals

    // === Text ===
    text: "#111827", // dark neutral
    subText: "#6B7280", // soft muted gray

    // === Accents ===
    accent: "#2563EB", // strong blue accent
    border: "rgba(37, 99, 235, 0.25)", // light blue border
    cardGlow: "rgba(37, 99, 235, 0.15)", // subtle blue shadow

    // === Trade Colors ===
    profit: "#16A34A", // green
    loss: "#DC2626", // red
  },
}

// 🧩 Helper for theme usage
export const getActiveColors = (isDark: boolean) =>
  isDark ? COLORS.dark : COLORS.light
