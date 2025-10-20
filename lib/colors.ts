// 🎨 Centralized color system for DC Trades (Refined & Consistent)

export const COLORS = {
  dark: {
    // === Base ===
    bg: "bg-[#0B0F14]", // deep graphite black-blue tone
    text: "text-[#E5E7EB]", // clean neutral white-gray
    subText: "text-[#9CA3AF]", // soft muted text
    border: "border-[#1F2937]", // elegant deep border
    accent: "text-[#38BDF8]", // cool cyan-blue accent (modern)
    cardGlow: "rgba(56, 189, 248, 0.15)", // cyan glow shadow

    // === Gradients & Accents ===
    gradient:
      "bg-gradient-to-r from-[#38BDF8] via-[#3B82F6] to-[#2563EB] bg-clip-text text-transparent", // sleek blue gradient
    buttonPrimary:
      "bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white hover:opacity-90 transition-all", // elegant blue primary
    buttonOutline:
      "border border-[#38BDF8]/70 text-[#38BDF8] hover:bg-[#38BDF8]/10 hover:text-[#38BDF8]", // clean glowing outline
    socialBase: "text-gray-400",
    socialHover: "hover:text-[#38BDF8]",
  },

  light: {
    // === Base ===
    bg: "bg-[#F9FAFB]", // clean light background
    text: "text-[#111827]", // dark neutral text
    subText: "text-[#6B7280]", // subtle muted gray
    border: "border-[#E5E7EB]", // soft light border
    accent: "text-[#2563EB]", // strong primary blue
    cardGlow: "rgba(37, 99, 235, 0.12)", // gentle blue glow

    // === Gradients & Accents ===
    gradient:
      "bg-gradient-to-r from-[#3B82F6] via-[#2563EB] to-[#1D4ED8] bg-clip-text text-transparent",
    buttonPrimary:
      "bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white hover:opacity-90 transition-all",
    buttonOutline:
      "border border-[#2563EB]/70 text-[#2563EB] hover:bg-[#2563EB]/10 hover:text-[#2563EB]",
    socialBase: "text-[#6B7280]",
    socialHover: "hover:text-[#2563EB]",
  },
};

// 🧩 Helper
export const getActiveColors = (isDark: boolean) =>
  isDark ? COLORS.dark : COLORS.light;
