import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@clerk/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ☀️ Light Theme (Clean & Professional)
        light: {
          primary: "#2563EB", // vibrant blue (trustworthy)
          background: "#F9FAFB", // soft off-white
          surface: "#FFFFFF", // card background
          text: "#111827", // deep neutral gray
          textLight: "#6B7280", // muted gray
          accent: "#0EA5E9", // cyan accent for buttons
          border: "#E5E7EB", // subtle border gray
          card: "#FFFFFF",
          income: "#10B981", // soft green for profit
          expense: "#EF4444", // red for losses
          shadow: "rgba(0, 0, 0, 0.08)", // gentle shadow
        },

        // 🌙 Dark Theme (Modern Trading Dashboard)
        dark: {
          primary: "#38BDF8", // cyan-blue — cool + premium
          background: "#0B0F14", // deep graphite blue-black
          surface: "#111827", // soft navy-gray
          text: "#E5E7EB", // light neutral text
          textLight: "#9CA3AF", // subtle muted text
          accent: "#3B82F6", // strong but elegant blue accent
          border: "#1F2937", // muted navy border
          card: "#161C23", // card background (dim navy)
          income: "#22C55E", // green for profits
          expense: "#F87171", // red for losses
          shadow: "rgba(56, 189, 248, 0.15)", // cool cyan glow
        },
      },

      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Poppins", "sans-serif"],
      },

      boxShadow: {
        glow: "0 0 25px rgba(56,189,248,0.15)",
        "card-dark": "0 8px 25px rgba(56,189,248,0.1)",
        "card-light": "0 8px 25px rgba(0,0,0,0.05)",
      },

      borderRadius: {
        xl: "12px",
        "2xl": "16px",
      },
    },
  },
  plugins: [],
}

export default config
