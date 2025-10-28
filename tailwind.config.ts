import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // still supported, but dark is the default
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@clerk/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 🌙 DC Trades Default Theme — Dark Only
        primary: "#38BDF8", // cyan-blue — premium trading tone
        background: "#0B0F14", // deep graphite black-blue
        surface: "#111827", // dark soft navy-gray
        text: "#E5E7EB", // neutral light gray
        textLight: "#9CA3AF", // muted soft gray
        accent: "#3B82F6", // strong blue accent
        border: "rgba(56,189,248,0.25)", // subtle cyan border glow
        card: "#161C23", // elevated card background
        income: "#22C55E", // vibrant profit green
        expense: "#F87171", // calm loss red
        shadow: "rgba(56,189,248,0.15)", // soft blue glow shadow
      },

      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Poppins", "sans-serif"],
      },

      boxShadow: {
        glow: "0 0 25px rgba(56,189,248,0.15)",
        card: "0 8px 25px rgba(56,189,248,0.1)",
      },

      borderRadius: {
        xl: "12px",
        "2xl": "16px",
      },
    },
  },
  plugins: [],
};

export default config;
