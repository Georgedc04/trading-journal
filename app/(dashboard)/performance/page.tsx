"use client";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { getColors } from "./utils/chartUtils";
import useTrades from "./hook/useTrades";
import SessionDonut3D from "./sections/SessionDonut3D";
import SessionPerformanceTable from "./sections/SessionPerformanceTable";

// Lazy-load heavy components
const HeaderSection = dynamic(() => import("./sections/HeaderSection"), { ssr: false });
const RadarSection = dynamic(() => import("./sections/RadarSection"), { ssr: false });
const CalendarSection = dynamic(() => import("./sections/CalendarSection"), { ssr: false });
const EquityCurveSection = dynamic(() => import("./sections/EquityCurveSection"), { ssr: false });
const PieChartSection = dynamic(() => import("./sections/PieChartSection"), { ssr: false });
const HighlightsSection = dynamic(() => import("./sections/HighlightsSection"), { ssr: false });
const BuySellAreaChartSection = dynamic(() => import("./sections/BuySellAreaChartSection"), { ssr: false });
const Discipline3DChartSection = dynamic(() => import("./sections/TradeFrequency3DChart"), { ssr: false });

export default function PerformancePage() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const { trades, loading, biggestProfit, biggestLoss } = useTrades();
  const colors = getColors(isLight);

  const [journalName, setJournalName] = useState<string>("");
  const [accountName, setAccountName] = useState<string>("");
  const [selectedJournalId, setSelectedJournalId] = useState<string | null>(null);

  // ✅ Load saved journal info
  useEffect(() => {
    const savedJournal = localStorage.getItem("selected_journal_name");
    const savedAccount = localStorage.getItem("selected_account_name");
    const savedId = localStorage.getItem("selected_journal_id");

    if (savedJournal) setJournalName(savedJournal);
    if (savedAccount) setAccountName(savedAccount);
    if (savedId) setSelectedJournalId(savedId);
  }, []);

  return (
    <div
      className="relative flex flex-col gap-10 min-h-screen transition-colors duration-500 p-5 sm:p-8"
      style={{
        background: isLight
          ? "linear-gradient(135deg, #F9FAFB, #E0F2FE)"
          : "linear-gradient(135deg, #0B0F14, #111827, #0E172A)",
        color: colors.text,
      }}
    >
      {/* Loading Overlay */}
      {/* {loading && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/30 backdrop-blur-sm transition-all duration-300">
          <p className="text-base font-medium opacity-80 animate-pulse text-white">
            Fetching performance data...
          </p>
        </div>
      )} */}

      {/* Header */}
      <HeaderSection
        colors={colors}
        journalName={journalName || "No Journal Selected"}
        accountName={accountName || ""}
      />

      {/* Show warning if no journal selected */}
      {!selectedJournalId ? (
        <div className="text-center text-sm opacity-70 italic">
          ⚠️ No journal selected. Go back to Dashboard to select one.
        </div>
      ) : (
        <>
          <SessionDonut3D />
          <SessionPerformanceTable />
          <RadarSection />
          <BuySellAreaChartSection />
          <Discipline3DChartSection />
          <CalendarSection trades={trades} accountSize={10000} />
          <EquityCurveSection trades={trades} accountSize={10000} colors={colors} />
          <PieChartSection trades={trades} colors={colors} />
          <HighlightsSection
            biggestProfit={biggestProfit}
            biggestLoss={biggestLoss}
            colors={colors}
          />
        </>
      )}
    </div>
  );
}
