"use client";
import { useEffect, useMemo, useState } from "react";
import { SignedIn, SignedOut, RedirectToSignIn, useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

import AccountHeader from "@/components/AccountHeader";
import TradeForm from "@/components/TradeForm";
import TradeTable from "@/components/TradeTable";
import PerformanceOverview from "@/components/PerformanceOverview";
import JournalHeader from "./components/JournalHeader";
import Toast from "./components/Toast";

export default function DashboardPage() {
  const { user } = useUser();
  const { theme, setTheme } = useTheme();

  const [trades, setTrades] = useState<any[]>([]);
  const [journals, setJournals] = useState<any[]>([]);
  const [selectedJournal, setSelectedJournal] = useState<number | null>(null);
  const [accountSize, setAccountSize] = useState<number | string>("");
  const [targetPercent, setTargetPercent] = useState<number | string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>("");
  const [toast, setToast] = useState<string>("");

  // 🧠 Fetch all journals
  const fetchJournals = async () => {
    try {
      const res = await fetch("/api/journals");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch journals");

      setJournals(data);

      // ✅ Restore saved journal ID from localStorage
      const savedId = localStorage.getItem("selected_journal_id");
      if (savedId) {
        const parsedId = Number(savedId);
        const found = data.find((j: any) => j.id === parsedId);
        if (found) {
          setSelectedJournal(parsedId);
          return;
        }
      }

      // Default to first journal if none saved
      if (data.length > 0) setSelectedJournal(data[0].id);
    } catch (err) {
      console.error(err);
      setError("Couldn't load journals");
    }
  };

  // 📊 Fetch trades for selected journal
  const fetchTrades = async (journalId: number) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/trades?journalId=${journalId}`);
      const data = await res.json();
      if (!res.ok) throw new Error("Failed to fetch trades");
      setTrades(data);
    } catch (err) {
      console.error(err);
      setError("Couldn't fetch trades");
    } finally {
      setLoading(false);
    }
  };

  // 🚀 Load journals on mount
  useEffect(() => {
    fetchJournals();
  }, []);

  // 🔁 Fetch trades whenever selected journal changes
  useEffect(() => {
    if (selectedJournal) {
      fetchTrades(selectedJournal);
      localStorage.setItem("selected_journal_id", String(selectedJournal));
    }
  }, [selectedJournal]);

  // ✅ Save selected journal details for Performance Page
  useEffect(() => {
    if (selectedJournal && journals.length > 0) {
      const current = journals.find((j) => j.id === selectedJournal);
      if (current) {
        localStorage.setItem("selected_journal_name", current.name);
        localStorage.setItem("selected_account_name", current.accountName || "");
      }
    }
  }, [selectedJournal, journals]);

  // ➕ Add Trade
  const handleAdd = async (payload: any) => {
    if (!selectedJournal) return alert("Select a journal first");
    try {
      setSaving(true);
      const res = await fetch("/api/trades/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, journalId: selectedJournal }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setTrades((prev) => [...prev, data]);
      setToast("✅ Trade added!");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ✏️ Edit Trade
  const handleEdit = async (payload: any) => {
    try {
      setSaving(true);
      const res = await fetch("/api/trades", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setTrades((prev) =>
        prev.map((t) => (t.id === data.trade.id ? { ...t, ...data.trade } : t))
      );
      setToast("✅ Trade updated!");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // 🗑️ Delete Trade
  const handleDelete = async (id: number) => {
    try {
      setSaving(true);
      await fetch("/api/trades/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setTrades((prev) => prev.filter((t) => t.id !== id));
      setToast("🗑️ Trade deleted");
    } finally {
      setSaving(false);
    }
  };

  // 💰 Calculate Total Balance
  const numericAccount = Number(accountSize) || 0;
  const totalBalance = useMemo(
    () => numericAccount + trades.reduce((sum, t) => sum + (t.result || 0), 0),
    [numericAccount, trades]
  );

  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>

      <SignedIn>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className={`min-h-screen flex flex-col items-center transition-colors duration-500 ${
            theme === "dark"
              ? "bg-[#0b0f14] text-gray-100"
              : "bg-gray-50 text-gray-900"
          }`}
        >
          {/* === Main Content (max 14-inch width) === */}
          <div className="w-full max-w-[1344px] p-5 flex flex-col gap-6">

            {/* === Header === */}
            <div className="flex justify-between items-center">
              <JournalHeader
                user={user}
                journals={journals}
                selectedJournal={selectedJournal}
                setSelectedJournal={setSelectedJournal}
                refreshJournals={fetchJournals}
                setToast={setToast}
              />

              {/* 🌗 Theme Toggle (Sun / Moon) */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className={`p-2 rounded-full border transition-all duration-300 ${
                  theme === "dark"
                    ? "border-emerald-400/40 text-emerald-400 hover:bg-emerald-400/10"
                    : "border-blue-600/40 text-blue-600 hover:bg-blue-600/10"
                }`}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </motion.button>
            </div>

            {/* === Account Info === */}
            <AccountHeader
              accountSize={accountSize}
              targetPercent={targetPercent}
              setAccountSize={setAccountSize}
              setTargetPercent={setTargetPercent}
              balance={totalBalance}
            />

            {/* === Performance Overview === */}
            <PerformanceOverview
              trades={trades}
              accountSize={accountSize}
              targetPercent={targetPercent}
            />

            {/* === Add Trade Section === */}
            <section
              className={`border rounded-xl sm:rounded-2xl shadow-md 
                 transition-all duration-300 
                mb-4 sm:mb-5 mt-4 sm:mt-5 hover:shadow-lg w-full max-w-full overflow-x-auto 
                ${
                  theme === "dark"
                    ? "bg-[#111827] border-gray-700"
                    : "bg-white border-gray-200"
                }`}
            >
              <div className="w-full max-w-md sm:max-w-none mx-auto">
                <TradeForm onAdd={handleAdd} disabled={saving} />
                {error && (
                  <p className="text-red-500 text-xs sm:text-sm mt-3 italic flex items-center gap-1">
                    ⚠️ {error}
                  </p>
                )}
              </div>
            </section>


            {/* === Trade History Section === */}
            <section
              className={`border rounded-2xl shadow-md  transition-all duration-300 hover:shadow-lg ${
                theme === "dark"
                  ? "bg-[#111827] border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              {loading ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <div className="h-5 w-40 rounded-md bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 animate-pulse mb-2" />
                  <p className="text-sm text-gray-400 animate-pulse">
                    Loading trades...
                  </p>
                </div>
              ) : trades.length > 0 ? (
                <TradeTable
                  trades={trades}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center opacity-70">
                  <p className="italic text-sm sm:text-base">
                    No trades recorded yet.
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Add your first trade above ⬆️
                  </p>
                </div>
              )}
            </section>

            {/* ✅ Toast Notification */}
            <Toast message={toast} />
          </div>
        </motion.div>
      </SignedIn>
    </>
  );
}
