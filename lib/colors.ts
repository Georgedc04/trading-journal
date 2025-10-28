// 🎨 Centralized color system for DC Trades (Final Unified Theme)

export const COLORS = {
  dark: {
    // === Base Theme ===
    bg: "#0B0F14", // Deep graphite black-blue tone
    text: "#E5E7EB", // Clean neutral white-gray
    subText: "#9CA3AF", // Soft muted text
    border: "#1F2937", // Elegant deep border
    accent: "#38BDF8", // Cyan-blue accent
    glow: "rgba(56,189,248,0.2)", // Neon cyan glow
    cardGlow: "0 0 25px rgba(56,189,248,0.2)",

    // === Gradients & Buttons ===
    gradient: "linear-gradient(90deg, #38BDF8, #3B82F6, #2563EB)",
    gradientText:
      "bg-gradient-to-r from-[#38BDF8] via-[#3B82F6] to-[#2563EB] bg-clip-text text-transparent",
    buttonPrimary:
      "bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white hover:opacity-90 transition-all",
    buttonOutline:
      "border border-[#38BDF8]/70 text-[#38BDF8] hover:bg-[#38BDF8]/10 hover:text-[#38BDF8]",

    // === UI Elements ===
    card:
      "bg-gradient-to-br from-[#0F172A]/80 to-[#1E293B]/80 border border-[#1E293B] backdrop-blur-xl shadow-[0_0_25px_rgba(56,189,248,0.1)]",
    inputBg: "rgba(15,23,42,0.9)",
    success: "#22C55E",
    danger: "#EF4444",
    warning: "#FACC15",
  },

  light: {
    // === Base Theme ===
    bg: "#F9FAFB",
    text: "#111827",
    subText: "#6B7280",
    border: "#E5E7EB",
    accent: "#2563EB",
    glow: "rgba(37,99,235,0.15)",
    cardGlow: "0 0 15px rgba(37,99,235,0.15)",

    // === Gradients & Buttons ===
    gradient: "linear-gradient(90deg, #3B82F6, #2563EB, #1D4ED8)",
    gradientText:
      "bg-gradient-to-r from-[#3B82F6] via-[#2563EB] to-[#1D4ED8] bg-clip-text text-transparent",
    buttonPrimary:
      "bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white hover:opacity-90 transition-all",
    buttonOutline:
      "border border-[#2563EB]/70 text-[#2563EB] hover:bg-[#2563EB]/10 hover:text-[#2563EB]",

    // === UI Elements ===
    card:
      "bg-gradient-to-br from-white to-[#F1F5F9] border border-[#E2E8F0] shadow-[0_0_15px_rgba(37,99,235,0.08)] backdrop-blur-sm",
    inputBg: "rgba(255,255,255,0.9)",
    success: "#16A34A",
    danger: "#DC2626",
    warning: "#EAB308",
  },
};

// 🧠 Theme Helper
export const getActiveColors = (isDark: boolean) =>
  isDark ? COLORS.dark : COLORS.light;
