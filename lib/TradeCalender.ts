// 🎨 lib/TradeCalendar.ts
// DC Trades Unified Color System — Dark Mode Default Only

export const COLORS = {
  // 🌙 Dark Mode (Default)
  dark: {
    // === Backgrounds ===
    bg: "linear-gradient(135deg, #0B0F14 0%, #111827 50%, #161C23 100%)", // deep graphite blue-black
    surface: "rgba(17, 24, 39, 0.9)", // glass-like dark surface

    // === Text ===
    text: "#E5E7EB", // clean soft white-gray
    subText: "#9CA3AF", // muted gray tone

    // === Accents ===
    accent: "#38BDF8", // modern cyan-blue accent
    border: "rgba(56, 189, 248, 0.25)", // soft cyan border
    cardGlow: "rgba(56, 189, 248, 0.15)", // subtle glowing edge

    // === Trade Colors ===
    profit: "#22C55E", // premium green
    loss: "#EF4444", // calm red
  },
};

// 🧩 Always return dark mode palette (no light mode)
export const getActiveColors = () => COLORS.dark;
