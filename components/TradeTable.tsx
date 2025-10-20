"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import {
  Pencil,
  Trash2,
  TrendingUp,
  TrendingDown,
  ClipboardList,
  X,
  Loader2,
} from "lucide-react";
import TradeDetails from "./TradeDetails";
import LoadingScreen from "@/components/LoadingScreen";

type TradeTableProps = {
  trades: any[];
  onDelete: (id: number) => Promise<void>;
  onEdit: (payload: any) => Promise<void>;
};

export default function TradeTable({ trades, onDelete, onEdit }: TradeTableProps) {
  const { theme } = useTheme();
  const [tradeList, setTradeList] = useState(trades);
  const [selectedTrade, setSelectedTrade] = useState<any | null>(null);
  const [editTrade, setEditTrade] = useState<any | null>(null);
  const [isOpening, setIsOpening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const isDark = theme === "dark";

  const palette = isDark
    ? {
        bg: "linear-gradient(145deg, #0B0F14, #111827)",
        border: "#1E293B",
        text: "#E2E8F0",
        accent: "#38BDF8",
        profit: "#22C55E",
        loss: "#EF4444",
        spinner: "#38BDF8",
        shadow: "0 4px 15px rgba(56,189,248,0.2)",
      }
    : {
        bg: "linear-gradient(145deg, #F9FAFB, #E0F2FE)",
        border: "#CBD5E1",
        text: "#1E293B",
        accent: "#2563EB",
        profit: "#16A34A",
        loss: "#DC2626",
        spinner: "#2563EB",
        shadow: "0 4px 15px rgba(37,99,235,0.15)",
      };

  useEffect(() => setTradeList(trades), [trades]);

  const getQualityColor = (q: string) => {
    const colors: any = {
      "A+": "bg-emerald-600 text-white",
      A: "bg-green-500 text-white",
      B: "bg-yellow-400 text-black",
      C: "bg-rose-500 text-white",
    };
    return colors[q] || "bg-gray-500 text-white";
  };

  const handleDeleteClick = async (e: any, id: number) => {
    e.stopPropagation();
    try {
      setDeletingId(id);
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/trades", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editTrade),
      });
      if (!res.ok) throw new Error("Failed to update trade");
      const data = await res.json();
      await onEdit(data.trade);
      setEditTrade(null);
    } catch (err) {
      alert("Failed to update trade");
    } finally {
      setLoading(false);
    }
  };

  const openTradeDetails = (trade: any) => {
    setIsOpening(true);
    setTimeout(() => {
      setSelectedTrade(trade);
      setIsOpening(false);
    }, 250);
  };

  return (
    <div
      className="p-4 rounded-xl border shadow-md transition-all duration-300 w-full overflow-x-auto relative"
      style={{
        background: palette.bg,
        borderColor: palette.border,
        boxShadow: palette.shadow,
        color: palette.text,
      }}
    >
      {isOpening && (
        <div className="absolute inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <LoadingScreen />
        </div>
      )}

{/* === Edit Modal === */}
{editTrade && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
    <form
      onSubmit={handleEditSubmit}
      className={`p-6 my-1.5 rounded-xl shadow-xl w-full max-w-md flex flex-col gap-3 border transition-all duration-300
        ${
          isDark
            ? "bg-[#0F172A] border-[rgba(56,189,248,0.3)] text-slate-100"
            : "bg-white border-[rgba(37,99,235,0.2)] text-slate-800"
        }`}
    >
      <h2
        className={`text-lg font-semibold mb-2 ${
          isDark ? "text-sky-400" : "text-blue-600"
        }`}
      >
        Edit Trade
      </h2>

      <input
        type="text"
        value={editTrade.pair}
        onChange={(e) => setEditTrade({ ...editTrade, pair: e.target.value })}
        placeholder="Pair"
        className={`p-2 rounded outline-none focus:ring-2 mb-2 placeholder:opacity-70
          ${
            isDark
              ? "bg-slate-800 border border-slate-700 focus:ring-sky-400 text-slate-100 placeholder-slate-500"
              : "bg-gray-100 border border-gray-300 focus:ring-blue-400 text-gray-900 placeholder-gray-500"
          }`}
      />

      <select
        value={editTrade.direction}
        onChange={(e) =>
          setEditTrade({ ...editTrade, direction: e.target.value })
        }
        className={`p-2 rounded outline-none mb-2
          ${
            isDark
              ? "bg-slate-800 border border-slate-700 text-slate-100"
              : "bg-gray-100 border border-gray-300 text-gray-900"
          }`}
      >
        <option>Buy</option>
        <option>Sell</option>
      </select>

      <select
        value={editTrade.session || ""}
        onChange={(e) =>
          setEditTrade({ ...editTrade, session: e.target.value })
        }
        className={`p-2 rounded outline-none mb-2
          ${
            isDark
              ? "bg-slate-800 border border-slate-700 text-slate-100"
              : "bg-gray-100 border border-gray-300 text-gray-900"
          }`}
      >
        <option value="">Select Session</option>
        <option>London</option>
        <option>New York</option>
        <option>Asian</option>
        <option>_____</option>
      </select>

      <select
        value={editTrade.quality}
        onChange={(e) =>
          setEditTrade({ ...editTrade, quality: e.target.value })
        }
        className={`p-2 rounded outline-none mb-2
          ${
            isDark
              ? "bg-slate-800 border border-slate-700 text-slate-100"
              : "bg-gray-100 border border-gray-300 text-gray-900"
          }`}
      >
        <option>A+</option>
        <option>A</option>
        <option>B</option>
        <option>C</option>
      </select>

      <input
        type="number"
        value={editTrade.result}
        onChange={(e) =>
          setEditTrade({ ...editTrade, result: e.target.value })
        }
        placeholder="Result ($)"
        className={`p-2 rounded outline-none mb-2 placeholder:opacity-70
          ${
            isDark
              ? "bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500"
              : "bg-gray-100 border border-gray-300 text-gray-900 placeholder-gray-500"
          }`}
      />

      <textarea
        value={editTrade.reason || ""}
        onChange={(e) =>
          setEditTrade({ ...editTrade, reason: e.target.value })
        }
        placeholder="Reason"
        className={`p-2 rounded h-20 outline-none placeholder:opacity-70
          ${
            isDark
              ? "bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500"
              : "bg-gray-100 border border-gray-300 text-gray-900 placeholder-gray-500"
          }`}
      />

      <div className="flex gap-3 mt-4">
        <button
          type="button"
          onClick={() => setEditTrade(null)}
          className={`flex-1 py-2 rounded transition font-medium
            ${
              isDark
                ? "bg-gray-700 hover:bg-gray-600 text-slate-100"
                : "bg-gray-300 hover:bg-gray-400 text-gray-900"
            }`}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className={`flex-1 py-2 rounded font-semibold flex items-center justify-center gap-2 transition
            ${
              isDark
                ? "bg-gradient-to-r from-sky-500 to-cyan-400 hover:opacity-90 text-black"
                : "bg-gradient-to-r from-blue-500 to-sky-400 hover:opacity-90 text-white"
            }`}
        >
          {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Save"}
        </button>
      </div>
    </form>
  </div>
)}



      {/* === Trade Details Modal === */}
      {selectedTrade ? (
        <div className="relative min-h-[60vh] flex items-center justify-center">
          <button
              onClick={() => setSelectedTrade(null)}
              className="absolute top-3 right-3 p-2 rounded-full transition-all duration-200
                       bg-gradient-to-r from-sky-500 to-cyan-400 hover:opacity-90  border border-white/30 
                        flex items-center justify-center backdrop-blur-md"
            >
              <X
                size={15}
                className="text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]"
              />
            </button>

          <TradeDetails trade={selectedTrade} />
        </div>
      ) : (
        <>
          {/* === Header === */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ClipboardList size={20} style={{ color: palette.accent }} />
              <h2
                className="text-xl font-semibold bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent"
              >
                Trade History
              </h2>
            </div>
          </div>

          {/* === Table === */}
          <div className="hidden sm:block w-full overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr
                  className="border-b"
                  style={{ borderColor: palette.border, color: palette.text }}
                >
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-left">Pair</th>
                  <th className="p-2 text-left">Dir</th>
                  <th className="p-2 text-left">Session</th>
                  <th className="p-2 text-left">Type</th>
                  <th className="p-2 text-left">Quality</th>
                  <th className="p-2 text-left">Reason</th>
                  <th className="p-2 text-right">Result ($)</th>
                  <th className="p-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tradeList.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-6 opacity-70">
                      No trades found
                    </td>
                  </tr>
                ) : (
                  tradeList.map((t) => (
                    <tr
                      key={t.id}
                      onClick={() => openTradeDetails(t)}
                      className="border-b hover:bg-sky-500/5 cursor-pointer transition-all"
                      style={{ borderColor: palette.border }}
                    >
                      <td className="p-2">{new Date(t.date).toLocaleDateString()}</td>
                      <td className="p-2 font-medium">{t.pair}</td>
                      <td className="p-2 flex items-center gap-1">
                        {t.direction === "Buy" ? (
                          <TrendingUp color={palette.profit} size={14} />
                        ) : (
                          <TrendingDown color={palette.loss} size={14} />
                        )}
                        {t.direction}
                      </td>
                      <td className="p-2">{t.session || "—"}</td>
                      <td className="p-2">
                        <span
                          className={`px-2 py-1 rounded-md text-xs font-semibold ${
                            t.result > 0 ? "bg-emerald-600" : "bg-rose-600"
                          } text-white`}
                        >
                          {t.result > 0 ? "Profit" : "Loss"}
                        </span>
                      </td>
                      <td className="p-2">
                        <span
                          className={`px-2 py-1 rounded-md text-xs font-semibold ${getQualityColor(
                            t.quality || "-"
                          )}`}
                        >
                          {t.quality || "—"}
                        </span>
                      </td>
                      <td className="p-2 truncate max-w-[80px]">{t.reason || "—"}</td>
                      <td
                        className="p-2 text-right font-semibold"
                        style={{ color: t.result > 0 ? palette.profit : palette.loss }}
                      >
                        {t.result.toFixed(2)}
                      </td>
                      <td className="p-2 flex justify-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditTrade(t);
                          }}
                          className="px-3 py-1 bg-gradient-to-r from-blue-600 to-sky-500 hover:opacity-90 text-white text-xs rounded flex items-center justify-center gap-1 transition"
                        >
                          <Pencil size={12} /> Edit
                        </button>
                        <button
                          onClick={(e) => handleDeleteClick(e, t.id)}
                          disabled={deletingId === t.id}
                          className="px-3 py-1 bg-gradient-to-r from-rose-600 to-red-500 hover:opacity-90 text-white text-xs rounded flex items-center justify-center gap-1 transition"
                        >
                          {deletingId === t.id ? (
                            <Loader2 className="animate-spin w-3 h-3" />
                          ) : (
                            <Trash2 size={12} />
                          )}
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
