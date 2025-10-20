import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";
import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://dctrades.vercel.app"),

  title: {
    default: "DC Trades – AI Trading Journal for Smart & Consistent Traders",
    template: "%s | DC Trades",
  },

  description:
    "DC Trades is the next-generation AI-powered trading journal that helps Forex, Crypto, and Indices traders track performance, analyze psychology, and achieve consistent profitability. Built for professional and aspiring traders who want to trade smarter.",

keywords: [
  // 🔹 Brand & Core Keywords
  "DC Trades",
  "DC Trades journal",
  "DC Trades app",
  "DC Trades trading platform",
  "AI trading journal",
  "AI trade analytics",
  "AI-powered trade journal",

  // 🔹 Forex & Market Specific
  "forex trading journal",
  "forex trade tracker",
  "forex trade analyzer",
  "forex risk management",
  "best forex trading journal",
  "prop firm trading journal",
  "funded account tracking tool",
  "MyForexFunds journal alternative",
  "FTMO journal app",
  "funded trader analytics",

  // 🔹 Crypto & Stocks
  "crypto trading journal",
  "crypto trade tracker",
  "crypto portfolio tracker",
  "crypto analytics platform",
  "stock trading journal",
  "stock trade tracker",
  "indices trading analytics",

  // 🔹 Smart Money & Psychology
  "smart money concept tools",
  "SMC trading analytics",
  "smart money concept trading journal",
  "trading psychology tracker",
  "trading discipline tracker",
  "trade emotion analysis",
  "trading mindset improvement",

  // 🔹 Performance & Risk
  "trading performance analytics",
  "risk management app",
  "risk reward calculator",
  "trade win rate analyzer",
  "equity curve analytics",
  "trading performance tracking software",

  // 🔹 Advanced Tools & Features
  "backtesting tools for traders",
  "AI backtesting app",
  "goal tracking for traders",
  "trade journaling software",
  "multi-account trading journal",
  "real-time broker sync app",
  "trade data visualization tool",

  // 🔹 Popular SEO Long-tail Keywords
  "best trading journal 2025",
  "top trading journal software",
  "how to track forex trades",
  "how to improve trading consistency",
  "tools to analyze forex performance",
  "journal app for day traders",
  "mobile trading journal app",
  "online trading journal free",
  "professional trading journal software",
  "best trade tracking app for beginners",
],


  authors: [{ name: "DC Trades", url: "https://dctrades.vercel.app" }],
  creator: "DC Trades Team",
  publisher: "DC Trades",
  alternates: {
    canonical: "https://dctrades.vercel.app",
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/dc-logo.png",
  },

  manifest: "/manifest.json",

  openGraph: {
    title: "DC Trades – Trade Smarter, Journal Better",
    description:
      "Unlock your trading potential with DC Trades — an AI-powered journal built for consistency, analytics, and smarter decision-making.",
    url: "https://dctrades.vercel.app",
    siteName: "DC Trades",
    images: [
      {
        url: "/preview.png",
        width: 1200,
        height: 630,
        alt: "DC Trades Intelligent Trading Dashboard Preview",
      },
    ],
    type: "website",
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    title: "DC Trades – AI-Powered Trading Journal for Forex & Crypto",
    description:
      "Analyze your trades, track your growth, and master consistency with DC Trades. AI analytics for traders who want results.",
    site: "@DCTrades",
    creator: "@DCTrades",
    images: ["/preview.png"],
  },

  category: "Finance, Trading, Technology",
};

// ✅ Default export must be a React component
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`min-h-screen font-inter antialiased transition-all duration-500
            bg-[#F9FAFB] text-[#1E293B]
            dark:bg-[#0B0F14] dark:text-gray-100`}
        >
          {/* ✅ Smooth Theme Provider */}
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <main className="relative flex flex-col min-h-screen overflow-x-hidden">
              {children}
            </main>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
