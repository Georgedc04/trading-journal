"use client";
import { useEffect, useMemo, useState } from "react";
import { SignedIn, SignedOut, RedirectToSignIn, useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";

import AccountHeader from "@/components/AccountHeader";
import TradeForm from "@/components/TradeForm";
import TradeTable from "@/components/TradeTable";
import PerformanceOverview from "@/components/PerformanceOverview";
import JournalHeader from "./components/JournalHeader";
import JournalModal from "./components/JournalModal";
import Toast from "./components/Toast";
import SessionHeader from "@/components/SessionHeader";
import DashboardAnnouncements from "./components/DashboardAnnouncements";
import PlanUpgrade from "@/components/PlanUpgrade";

export default function DashboardPage() {
  const { user } = useUser();

  const [plan, setPlan] = useState<"FREE" | "NORMAL" | "PRO">("FREE");
  const [trades, setTrades] = useState<any[]>([]);
  const [journals, setJournals] = useState<any[]>([]);
  const [selectedJournal, setSelectedJournal] = useState<number | null>(null);
  const [accountSize, setAccountSize] = useState<number | string>("");
  const [targetPercent, setTargetPercent] = useState<number | string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>("");
  const [toast, setToast] = useState<string>("");
  const [showJournalModal, setShowJournalModal] = useState(false);

  /* === Fetch User Plan === */
  const fetchUserPlan = async () => {
    try {
      const res = await fetch("/api/user/plan");
      if (!res.ok) return;
      const data = await res.json();
      setPlan(data.plan || "FREE");
    } catch {
      console.warn("Could not fetch plan, defaulting to FREE");
      setPlan("FREE");
    }
  };

  /* === Fetch Journals === */
  const fetchJournals = async () => {
    try {
      const res = await fetch("/api/journals");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch journals");
      setJournals(data);

      if (data.length === 0) {
        setShowJournalModal(true);
        return;
      }

      const savedId = localStorage.getItem("selected_journal_id");
      if (savedId) {
        const parsedId = Number(savedId);
        const found = data.find((j: any) => j.id === parsedId);
        if (found) {
          setSelectedJournal(parsedId);
          return;
        }
      }
      setSelectedJournal(data[0].id);
    } catch {
      setError("Couldn't load journals");
    }
  };

  /* === Fetch Trades === */
  const fetchTrades = async (journalId: number) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/trades?journalId=${journalId}`);
      const data = await res.json();
      if (!res.ok) throw new Error("Failed to fetch trades");
      setTrades(data);
    } catch {
      setError("Couldn't fetch trades");
    } finally {
      setLoading(false);
    }
  };

  /* === Effects === */
  useEffect(() => {
    fetchUserPlan();
    fetchJournals();
  }, []);

  // detect upgrade or error messages in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "plan_upgraded") {
      setToast("🎉 Plan successfully upgraded!");
      fetchUserPlan();
      params.delete("success");
      window.history.replaceState({}, "", "/dashboard");
    }
    if (params.get("error")) {
      setToast("❌ There was an issue processing your upgrade. Please try again.");
      params.delete("error");
      window.history.replaceState({}, "", "/dashboard");
    }
  }, []);

  useEffect(() => {
    if (selectedJournal) {
      fetchTrades(selectedJournal);
      localStorage.setItem("selected_journal_id", String(selectedJournal));
    }
  }, [selectedJournal]);

  useEffect(() => {
    if (selectedJournal && journals.length > 0) {
      const current = journals.find((j) => j.id === selectedJournal);
      if (current) {
        localStorage.setItem("selected_journal_name", current.name);
        localStorage.setItem("selected_account_name", current.accountName || "");
      }
    }
  }, [selectedJournal, journals]);

  /* === CRUD === */
  const handleAdd = async (payload: any) => {
    if (!selectedJournal) return setToast("⚠️ Please create or select a journal first.");

    // Free plan trade limit
    if (plan === "FREE" && trades.length >= 10) {
      setToast("🚫 Free plan limit reached (10 trades). Upgrade to add more.");
      return;
    }

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

  /* === Balance === */
  const numericAccount = Number(accountSize) || 0;
  const totalBalance = useMemo(() => {
    const total =
      numericAccount + trades.reduce((sum, t) => sum + (Number(t.result) || 0), 0);
    return isNaN(total) ? 0 : Number(total.toFixed(2));
  }, [numericAccount, trades]);

  /* === Palette === */
  const palette = {
    bg: "radial-gradient(circle at top left, #0B0F14, #111827)",
    card: "#111827",
    text: "#E2E8F0",
    accent: "#38BDF8",
    border: "rgba(56,189,248,0.25)",
    shadow: "0 0 25px rgba(56,189,248,0.15)",
  };

  const progressColor =
    trades.length >= 9
      ? "bg-gradient-to-r from-red-500 to-red-700"
      : trades.length >= 6
      ? "bg-gradient-to-r from-yellow-400 to-orange-500"
      : "bg-gradient-to-r from-cyan-400 to-blue-500";

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
          className="min-h-screen flex flex-col items-center"
          style={{ background: palette.bg, color: palette.text }}
        >
          <div className="w-full max-w-[1344px] p-5 flex flex-col gap-6">
            <DashboardAnnouncements />
            <SessionHeader username={user?.firstName || "Trader"} />

            {/* Plan Info */}
            <div className="text-center text-sm opacity-80">
              Current Plan:{" "}
              <span
                className={`font-semibold ${
                  plan === "PRO"
                    ? "text-yellow-400"
                    : plan === "NORMAL"
                    ? "text-emerald-400"
                    : "text-gray-400"
                }`}
              >
                {plan}
              </span>
            </div>

            {/* === Free Plan Limit === */}
            {plan === "FREE" && trades.length >= 10 ? (
              <div className="mt-6 text-center">
                <p className="text-gray-400 text-sm mb-3">
                  🚫 You’ve reached your <b>Free Plan</b> limit of <b>10 trades</b>.
                  Upgrade to continue adding more.
                </p>
                <PlanUpgrade />
              </div>
            ) : (
              <>
                {/* Progress Bar for Free Plan */}
                {plan === "FREE" && (
                  <div className="w-full mt-3 mb-2">
                    <div className="text-xs text-gray-400 text-center mb-1">
                      {trades.length} / 10 trades used
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                      <div
                        className={`${progressColor} h-2 transition-all`}
                        style={{ width: `${(trades.length / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Journal & Trades */}
                <JournalHeader
                  user={user}
                  journals={journals}
                  selectedJournal={selectedJournal}
                  setSelectedJournal={setSelectedJournal}
                  refreshJournals={fetchJournals}
                  setToast={setToast}
                />

                <AccountHeader
                  accountSize={accountSize}
                  targetPercent={targetPercent}
                  setAccountSize={setAccountSize}
                  setTargetPercent={setTargetPercent}
                  balance={totalBalance}
                />

                <PerformanceOverview
                  trades={trades}
                  accountSize={accountSize}
                  targetPercent={targetPercent}
                />

                <section
                  className="border rounded-2xl shadow-md"
                  style={{
                    background: palette.card,
                    borderColor: palette.border,
                    boxShadow: palette.shadow,
                  }}
                >
                  <TradeForm onAdd={handleAdd} disabled={saving} />
                  {error && (
                    <p className="text-red-500 text-xs sm:text-sm mt-3 italic flex items-center gap-1">
                      ⚠️ {error}
                    </p>
                  )}
                </section>

                <section
                  className="border rounded-2xl shadow-md"
                  style={{
                    background: palette.card,
                    borderColor: palette.border,
                    boxShadow: palette.shadow,
                  }}
                >
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-10 text-gray-400 animate-pulse">
                      <div className="h-5 w-40 rounded-md bg-sky-900/30 mb-2" />
                      <p className="text-sm">Loading trades...</p>
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
                      <p className="text-xs text-gray-500 mt-1">
                        Add your first trade above ⬆️
                      </p>
                    </div>
                  )}
                </section>

                <Toast message={toast} />
              </>
            )}
          </div>
        </motion.div>

        {/* Journal Modal */}
        {showJournalModal && (
          <JournalModal
            closeModal={() => setShowJournalModal(false)}
            refreshJournals={fetchJournals}
            setToast={setToast}
          />
        )}
      </SignedIn>
    </>
  );
}
