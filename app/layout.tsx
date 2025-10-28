import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

export const metadata = {
  metadataBase: new URL("https://dctrades.vercel.app"),
  title: {
    default: "DC Trades – AI Trading Journal for Smart & Consistent Traders",
    template: "%s | DC Trades",
  },
  description:
    "DC Trades is the next-generation AI-powered trading journal that helps Forex, Crypto, and Indices traders track performance, analyze psychology, and achieve consistent profitability. Built for professional and aspiring traders who want to trade smarter.",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="min-h-screen font-inter antialiased bg-[#0B0F14] text-gray-100 overflow-x-hidden">
          {/* ✅ Client logic in separate component */}
          <ClientLayout>{children}</ClientLayout>
        </body>
      </html>
    </ClerkProvider>
  );
}
