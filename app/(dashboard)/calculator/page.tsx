"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Copy, BarChart3, Percent, CircleDollarSign } from "lucide-react";
import { useTheme } from "next-themes";
import Logo from "@/components/Logo";

// ✅ Conversion rates for deposit currency
const rates: Record<string, number> = {
  USD: 1,
  EUR: 1.167,
  GBP: 1.206,
};

// ✅ Pip value data per pair
const pairRates: Record<string, number> = {
  EURUSD: 10.0,
  AUDCAD: 7.12845,
  AUDCHF: 12.60891,
  AUDJPY: 6.63354,
  AUDUSD: 10.0,
  CADCHF: 12.60891,
  CADJPY: 6.63354,
  CHFJPY: 6.63354,
  EURAUD: 6.4962,
  EURCAD: 7.12845,
  EURCHF: 12.60891,
  EURGBP: 13.4178,
  EURHKD: 1.2875,
  EURJPY: 6.63354,
  EURNOK: 0.99492,
  EURNZD: 5.7333,
  EURPLN: 2.75069,
  EURSEK: 1.06067,
  EURTRY: 0.23835,
  GBPAUD: 6.4962,
  GBPCAD: 7.12845,
  GBPCHF: 12.60891,
  GBPJPY: 6.63354,
  GBPNZD: 5.7333,
  GBPPLN: 2.75069,
  GBPSEK: 1.06067,
  GBPUSD: 10.0,
  NZDCAD: 7.12845,
  NZCHF: 12.60891,
  NZDJPY: 6.63354,
  NZDUSD: 10.0,
  USDCAD: 7.12845,
  USDCHF: 12.60891,
  USDJPY: 6.63354,
  USDHKD: 1.2875,
  USDZAR: 0.57737,
  XAUUSD: 1.0,
  XAGUSD: 50.0,
};

// ✅ Currency symbols
const getSymbol = (cur: string) =>
  cur === "USD" ? "$" : cur === "EUR" ? "€" : cur === "GBP" ? "£" : "";

export default function ForexCalculator() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [mode, setMode] = useState<"pip" | "risk">("pip");
  const [depositCurrency, setDepositCurrency] = useState("USD");
  const [pair, setPair] = useState("EURUSD");

  // 🧮 Pip Calculator fields
  const [lots, setLots] = useState<number | "">("");
  const [pips, setPips] = useState<number | "">("");

  // 🧮 Risk Calculator fields
  const [accountSize, setAccountSize] = useState<number | "">("");
  const [riskPercent, setRiskPercent] = useState<number | "">("");
  const [stopLossPips, setStopLossPips] = useState<number | "">("");

  const symbol = getSymbol(depositCurrency);

  // ✅ Pip Mode Calculation
  const pipResult = useMemo(() => {
    if (lots === "" || pips === "") return 0;
    const baseValue = pairRates[pair] ?? 0;
    let value = baseValue * Number(lots) * Number(pips);
    if (depositCurrency === "EUR") value = value / rates.EUR;
    if (depositCurrency === "GBP") value = value / rates.GBP;
    return value;
  }, [pair, lots, pips, depositCurrency]);

  // ✅ Risk Mode Calculation
  const riskResult = useMemo(() => {
    if (accountSize === "" || riskPercent === "" || stopLossPips === "") return { lotSize: 0, riskAmount: 0 };
    const pipValue = pairRates[pair] ?? 0;
    let riskAmount = (Number(accountSize) * Number(riskPercent)) / 100;
    let lotSize = riskAmount / (Number(stopLossPips) * pipValue);

    // Adjust conversion for EUR / GBP
    if (depositCurrency === "EUR") {
      riskAmount = riskAmount / rates.EUR;
      lotSize = lotSize / rates.EUR;
    }
    if (depositCurrency === "GBP") {
      riskAmount = riskAmount / rates.GBP;
      lotSize = lotSize / rates.GBP;
    }

    return { lotSize, riskAmount };
  }, [accountSize, riskPercent, stopLossPips, pair, depositCurrency]);

  const reset = () => {
    setLots("");
    setPips("");
    setAccountSize("");
    setRiskPercent("");
    setStopLossPips("");
  };

  const copyToClipboard = () => {
    const text =
      mode === "pip"
        ? `
Deposit Currency: ${depositCurrency}
Currency Pair: ${pair}
Trade Size (Lots): ${lots || 0}
Pip Amount: ${pips || 0}
Result: ${symbol}${pipResult.toFixed(5)}
        `.trim()
        : `
Deposit Currency: ${depositCurrency}
Currency Pair: ${pair}
Account Size: ${symbol}${accountSize || 0}
Risk %: ${riskPercent || 0}%
Stop Loss: ${stopLossPips || 0} pips
Risk Amount: ${symbol}${riskResult.riskAmount.toFixed(2)}
Recommended Lot Size: ${riskResult.lotSize.toFixed(3)}
        `.trim();

    navigator.clipboard.writeText(text);
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-6 ${
        isDark
          ? "bg-gradient-to-br from-[#0B0F14] via-[#111827] to-[#1E293B]"
          : "bg-gradient-to-br from-[#F9FAFB] via-[#E0F2FE] to-[#D0E2FA]"
      }`}
    >
      {/* ✅ Header with Logo + Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center mb-6"
      >
        <Logo isDark={false} />
        <motion.h1
          className="text-2xl sm:text-4xl font-extrabold bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent pb-2"
          whileHover={{ scale: 1.03 }}
        >
          Forex Calculator
        </motion.h1>
        <p
          className={`text-sm ${
            isDark ? "text-gray-400" : "text-slate-600"
          } mt-1`}
        >
          {mode === "pip" ? "Forex Pip Calculator" : "Risk Percentage Calculator"}
        </p>
      </motion.div>

      {/* ✅ Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`w-full max-w-lg rounded-2xl shadow-2xl border p-6 lg:p-8 ${
          isDark
            ? "bg-[rgba(30,41,59,0.8)] border-[rgba(56,189,248,0.2)]"
            : "bg-[rgba(255,255,255,0.9)] border-[rgba(148,163,184,0.2)]"
        }`}
      >
        {/* Toggle */}
        <div className="flex justify-center gap-2 mb-6">
          <button
            onClick={() => setMode("pip")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition ${
              mode === "pip"
                ? "bg-gradient-to-r from-sky-500 to-cyan-400 text-black"
                : "bg-slate-700 text-gray-200"
            }`}
          >
            <CircleDollarSign size={16} /> Pip Mode
          </button>
          <button
            onClick={() => setMode("risk")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition ${
              mode === "risk"
                ? "bg-gradient-to-r from-emerald-500 to-teal-400 text-black"
                : "bg-slate-700 text-gray-200"
            }`}
          >
            <Percent size={16} /> Risk Mode
          </button>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">
              Currency Pair
            </label>
            <select
              value={pair}
              onChange={(e) => setPair(e.target.value)}
              className={`w-full px-3 py-2 rounded-md border text-sm ${
                isDark
                  ? "bg-slate-800 border-slate-600 text-gray-100"
                  : "bg-white border-sky-300 text-sky-800"
              }`}
            >
              {Object.keys(pairRates).map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>

          {mode === "pip" ? (
            <>
              {/* Pip Mode Inputs */}
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Deposit Currency
                </label>
                <select
                  value={depositCurrency}
                  onChange={(e) => setDepositCurrency(e.target.value)}
                  className={`w-full px-3 py-2 rounded-md border text-sm ${
                    isDark
                      ? "bg-slate-800 border-slate-600 text-gray-100"
                      : "bg-white border-sky-300 text-sky-800"
                  }`}
                >
                  <option>USD</option>
                  <option>EUR</option>
                  <option>GBP</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Trade Size (Lots)
                </label>
                <input
                  type="number"
                  value={lots}
                  onChange={(e) =>
                    setLots(e.target.value === "" ? "" : Number(e.target.value))
                  }
                  placeholder="Enter lots"
                  className={`w-full px-3 py-2 rounded-md border text-sm ${
                    isDark
                      ? "bg-slate-800 border-slate-600 text-gray-100"
                      : "bg-white border-sky-300 text-sky-800"
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Pip Amount
                </label>
                <input
                  type="number"
                  value={pips}
                  onChange={(e) =>
                    setPips(e.target.value === "" ? "" : Number(e.target.value))
                  }
                  placeholder="Enter pips"
                  className={`w-full px-3 py-2 rounded-md border text-sm ${
                    isDark
                      ? "bg-slate-800 border-slate-600 text-gray-100"
                      : "bg-white border-sky-300 text-sky-800"
                  }`}
                />
              </div>
            </>
          ) : (
            <>
              {/* Risk Mode Inputs */}
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Deposit Currency
                </label>
                <select
                  value={depositCurrency}
                  onChange={(e) => setDepositCurrency(e.target.value)}
                  className={`w-full px-3 py-2 rounded-md border text-sm ${
                    isDark
                      ? "bg-slate-800 border-slate-600 text-gray-100"
                      : "bg-white border-sky-300 text-sky-800"
                  }`}
                >
                  <option>USD</option>
                  <option>EUR</option>
                  <option>GBP</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Account Size ({symbol})
                </label>
                <input
                  type="number"
                  value={accountSize}
                  onChange={(e) =>
                    setAccountSize(e.target.value === "" ? "" : Number(e.target.value))
                  }
                  placeholder="Enter account size"
                  className={`w-full px-3 py-2 rounded-md border text-sm ${
                    isDark
                      ? "bg-slate-800 border-slate-600 text-gray-100"
                      : "bg-white border-sky-300 text-sky-800"
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Risk Percentage (%)
                </label>
                <input
                  type="number"
                  value={riskPercent}
                  onChange={(e) =>
                    setRiskPercent(e.target.value === "" ? "" : Number(e.target.value))
                  }
                  placeholder="Enter risk %"
                  className={`w-full px-3 py-2 rounded-md border text-sm ${
                    isDark
                      ? "bg-slate-800 border-slate-600 text-gray-100"
                      : "bg-white border-sky-300 text-sky-800"
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Stop Loss (Pips)
                </label>
                <input
                  type="number"
                  value={stopLossPips}
                  onChange={(e) =>
                    setStopLossPips(e.target.value === "" ? "" : Number(e.target.value))
                  }
                  placeholder="Enter stop loss in pips"
                  className={`w-full px-3 py-2 rounded-md border text-sm ${
                    isDark
                      ? "bg-slate-800 border-slate-600 text-gray-100"
                      : "bg-white border-sky-300 text-sky-800"
                  }`}
                />
              </div>
            </>
          )}
        </div>

        {/* ✅ Results */}
        <div
          className={`mt-6 p-5 rounded-xl text-center border ${
            isDark
              ? "bg-gradient-to-br from-sky-950/40 to-cyan-900/40 border-slate-700 text-sky-100"
              : "bg-gradient-to-br from-sky-50 to-cyan-100 border-sky-200 text-sky-800"
          }`}
        >
          {mode === "pip" ? (
            <>
              <p className="text-sm opacity-80 mb-1">Total Value</p>
              <h2 className="text-3xl font-bold">
                {symbol}
                {pipResult ? pipResult.toFixed(5) : "0.00000"}
              </h2>
            </>
          ) : (
            <>
              <p className="text-sm opacity-80 mb-1">Recommended Lot Size</p>
              <h2 className="text-3xl font-bold">
                {riskResult.lotSize ? riskResult.lotSize.toFixed(3) : "0.000"}
              </h2>
              <p className="text-sm mt-2 opacity-75">
                Risk Amount: {symbol}
                {riskResult.riskAmount ? riskResult.riskAmount.toFixed(2) : "0.00"}
              </p>
            </>
          )}

          <button
            onClick={copyToClipboard}
            className={`mt-4 flex mx-auto items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition ${
              isDark
                ? "bg-gradient-to-r from-sky-500 to-cyan-400 text-black"
                : "bg-gradient-to-r from-sky-600 to-cyan-400 text-white"
            } hover:opacity-90`}
          >
            <Copy size={14} /> Copy Info
          </button>
        </div>

        {/* Reset Button */}
        <button
          onClick={reset}
          className={`mt-6 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md font-medium border text-sm ${
            isDark
              ? "bg-slate-800 border-slate-600 text-sky-300 hover:bg-slate-700"
              : "bg-white border-sky-300 text-sky-700 hover:bg-sky-50"
          }`}
        >
          <RefreshCw size={14} /> Reset
        </button>
      </motion.div>
    </div>
  );
}
