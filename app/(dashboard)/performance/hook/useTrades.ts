"use client";
import { useEffect, useState, useCallback, useRef } from "react";

export default function useTrades() {
  const [trades, setTrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [biggestProfit, setBiggestProfit] = useState<any | null>(null);
  const [biggestLoss, setBiggestLoss] = useState<any | null>(null);
  const currentJournalRef = useRef<string | null>(null);

  // ✅ Fetch trades for selected journal
  const fetchTrades = useCallback(async (force = false) => {
    try {
      if (typeof window === "undefined") return;

      const savedJournalId = localStorage.getItem("selected_journal_id");
      if (!savedJournalId) {
        console.warn("⚠️ No journal selected");
        setTrades([]);
        setLoading(false);
        return;
      }

      // Skip if journal hasn't changed and no force fetch
      if (!force && savedJournalId === currentJournalRef.current) return;
      currentJournalRef.current = savedJournalId;

      setLoading(true);

      const res = await fetch(`/api/trades?journalId=${savedJournalId}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch trades");

      const data = await res.json();
      setTrades(data);
      calculateExtremes(data);

      sessionStorage.setItem(`trades_cache_${savedJournalId}`, JSON.stringify(data));
      console.log(`✅ Trades fetched: ${data.length} for journal ${savedJournalId}`);
    } catch (err) {
      console.error("❌ Error fetching trades:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Calculate best/worst trades
  const calculateExtremes = (data: any[]) => {
    if (!data.length) {
      setBiggestProfit(null);
      setBiggestLoss(null);
      return;
    }
    const sorted = [...data].sort((a, b) => b.result - a.result);
    setBiggestProfit(sorted[0]);
    setBiggestLoss(sorted[sorted.length - 1]);
  };

  // ✅ Initial load
  useEffect(() => {
    fetchTrades(true); // force fresh load once
  }, [fetchTrades]);

  // ✅ Auto-refresh only on trade events (from dashboard)
  useEffect(() => {
    const handleUpdate = () => fetchTrades(true);
    window.addEventListener("tradeAdded", handleUpdate);
    window.addEventListener("tradeDeleted", handleUpdate);
    window.addEventListener("tradeUpdated", handleUpdate);

    return () => {
      window.removeEventListener("tradeAdded", handleUpdate);
      window.removeEventListener("tradeDeleted", handleUpdate);
      window.removeEventListener("tradeUpdated", handleUpdate);
    };
  }, [fetchTrades]);

  // 🧠 Removed the interval-based auto-refresh
  // (you can manually trigger with refreshTrades() if needed)

  return {
    trades,
    loading,
    biggestProfit,
    biggestLoss,
    refreshTrades: () => fetchTrades(true),
  };
}
