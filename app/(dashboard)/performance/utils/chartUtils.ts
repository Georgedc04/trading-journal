export const getColors = (isLight: boolean) =>
  isLight
    ? {
        border: "rgba(37,99,235,0.2)",
        card: "#FFFFFF",
        profit: "#16A34A",
        loss: "#DC2626",
        accent: "#2563EB",
        text: "#111827",
        subText: "#6B7280",
        shadow: "rgba(37,99,235,0.15)",
      }
    : {
        border: "rgba(56,189,248,0.25)",
        card: "#111827",
        profit: "#22C55E",
        loss: "#EF4444",
        accent: "#38BDF8",
        text: "#E5E7EB",
        subText: "#9CA3AF",
        shadow: "rgba(56,189,248,0.2)",
      };
