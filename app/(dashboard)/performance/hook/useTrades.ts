"use client";
import { useEffect, useState, useCallback } from "react";

export default function useTrades() {
  const [trades, setTrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [biggestProfit, setBiggestProfit] = useState<any | null>(null);
  const [biggestLoss, setBiggestLoss] = useState<any | null>(null);

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

      const cacheKey = `trades_cache_${savedJournalId}`;
      const cached = sessionStorage.getItem(cacheKey);

      if (cached && !force) {
        const parsed = JSON.parse(cached);
        setTrades(parsed);
        calculateExtremes(parsed);
        setLoading(false);
        return;
      }

      setLoading(true);
      const res = await fetch(`/api/trades?journalId=${savedJournalId}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch trades");

      const data = await res.json();
      setTrades(data);
      calculateExtremes(data);
      sessionStorage.setItem(cacheKey, JSON.stringify(data));
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
    fetchTrades();
  }, [fetchTrades]);

  // ✅ Auto-refresh on changes (trade events)
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

  return {
    trades,
    loading,
    biggestProfit,
    biggestLoss,
    refreshTrades: () => fetchTrades(true),
  };
}
