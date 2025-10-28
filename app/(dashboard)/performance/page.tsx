"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { getColors } from "./utils/chartUtils";
import useTrades from "./hook/useTrades";
import SessionDonut3D from "./sections/SessionDonut3D";
import SessionPerformanceTable from "./sections/SessionPerformanceTable";
import TradingProgressChart from "@/components/TradingProgressChart";
import TradingRevenueChart from "@/components/TradingRevenueChart";
import PairBarChart from "@/components/PairBarChart";
import SharpPerformanceChart from "@/components/SharpPerformanceChart";

// ✅ Lazy-load heavy components
const HeaderSection = dynamic(() => import("./sections/HeaderSection"), { ssr: false });
const RadarSection = dynamic(() => import("./sections/RadarSection"), { ssr: false });
const CalendarSection = dynamic(() => import("./sections/CalendarSection"), { ssr: false });
const PieChartSection = dynamic(() => import("./sections/PieChartSection"), { ssr: false });
const HighlightsSection = dynamic(() => import("./sections/HighlightsSection"), { ssr: false });
const BuySellAreaChartSection = dynamic(() => import("./sections/BuySellAreaChartSection"), { ssr: false });
const Discipline3DChartSection = dynamic(() => import("./sections/TradeFrequency3DChart"), { ssr: false });

export default function PerformancePage() {
  const { trades, loading, biggestProfit, biggestLoss } = useTrades();

  const [journalName, setJournalName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [selectedJournalId, setSelectedJournalId] = useState<string | null>(null);
  const [accountSize, setAccountSize] = useState<number>(10000);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const savedJournal = localStorage.getItem("selected_journal_name");
    const savedAccount = localStorage.getItem("selected_account_name");
    const savedId = localStorage.getItem("selected_journal_id");
    const savedBalance = localStorage.getItem("selected_account_balance");

    if (savedJournal) setJournalName(savedJournal);
    if (savedAccount) setAccountName(savedAccount);
    if (savedId) setSelectedJournalId(savedId);
    if (savedBalance) setAccountSize(Number(savedBalance));
  }, []);

  if (!mounted) return null;

  // ✅ Always use dark neon theme
  const colors = getColors();

  return (
    <div
      suppressHydrationWarning
      className="relative flex flex-col gap-10 min-h-screen p-5 sm:p-8 text-slate-200 transition-all duration-500"
      style={{
        background:
          "radial-gradient(circle at top left, #0B0F14, #0B0F14 60%, #0B0F14 100%)",
        color: colors.text,
      }}
    >
      {/* === Header === */}
      <HeaderSection
        colors={colors}
        journalName={journalName || "No Journal Selected"}
        accountName={accountName || ""}
      />

      {/* === Conditional Data === */}
      {!selectedJournalId ? (
        <div className="text-center text-sm italic text-slate-400">
          ⚠️ No journal selected. Go back to Dashboard to select one.
        </div>
      ) : (
        <>
          {/* === Charts & Sections === */}
          <SharpPerformanceChart trades={trades} accountSize={accountSize} />
          <SessionDonut3D />
          <SessionPerformanceTable />
          <PairBarChart trades={trades} />
          <RadarSection />
          <TradingRevenueChart trades={trades} />
          <TradingProgressChart trades={trades} accountSize={accountSize} />
          <BuySellAreaChartSection />
          <Discipline3DChartSection />
          <CalendarSection trades={trades} accountSize={accountSize} />
          <PieChartSection trades={trades}  />
          <HighlightsSection
            biggestProfit={biggestProfit}
            biggestLoss={biggestLoss}
          />
        </>
      )}
    </div>
  );
}
