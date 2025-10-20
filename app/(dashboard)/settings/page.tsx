"use client"

import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import {
  Download,
  Trash2,
  Sun,
  Moon,
  Laptop,
  Settings,
  Palette,
  Database,
  AlertTriangle,
} from "lucide-react"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [trades, setTrades] = useState<any[]>([])

  // ✅ Load trades for export
  useEffect(() => {
    const loadTrades = async () => {
      try {
        const res = await fetch("/api/trades")
        if (res.ok) setTrades(await res.json())
      } catch (err) {
        console.error("Error fetching trades:", err)
      }
    }
    loadTrades()
  }, [])

  // ✅ Export CSV
  const exportCSV = () => {
    if (!trades.length) return alert("⚠️ No trades to export.")
    const csv = [
      ["Date", "Pair", "Direction", "Quality", "Reason", "Result"],
      ...trades.map((t) => [
        new Date(t.date).toLocaleDateString(),
        t.pair,
        t.direction,
        t.quality,
        `"${t.reason}"`,
        t.result,
      ]),
    ]
      .map((r) => r.join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "DC_Trades_Journal.csv"
    a.click()
  }

  // ✅ Reset Journal
  const resetJournal = async () => {
    if (!confirm("⚠️ Are you sure you want to delete all your trades?")) return
    const res = await fetch("/api/trades/delete-all", { method: "DELETE" })
    alert(res.ok ? "✅ All trades deleted successfully." : "❌ Error clearing journal.")
  }

  // ✅ Color palette (Light/Dark)
  const isDark = theme === "dark"
  const palette = isDark
    ? {
        bg: "linear-gradient(135deg, #0B0F14, #111827)",
        card: "#1E293B",
        text: "#E2E8F0",
        lightText: "#94A3B8",
        border: "#334155",
        primary: "#38BDF8",
      }
    : {
        bg: "linear-gradient(135deg, #F9FAFB, #E0F2FE)",
        card: "#FFFFFF",
        text: "#1E293B",
        lightText: "#64748B",
        border: "#CBD5E1",
        primary: "#2563EB",
      }

  return (
    <div
      className="min-h-screen p-8 transition-colors duration-500 flex flex-col items-center"
      style={{ background: palette.bg, color: palette.text }}
    >
      {/* === Page Header === */}
      <div className="flex items-center gap-3 mb-10">
        <div className="p-3 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 shadow-md">
          <Settings size={26} className="text-white" />
        </div>
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
          Settings
        </h1>
      </div>

      <div className="w-full max-w-3xl flex flex-col gap-8">
        {/* === Theme Mode === */}
        <section
          className="rounded-2xl p-6 shadow-lg transition-all duration-300 border hover:shadow-xl"
          style={{
            background: palette.card,
            borderColor: palette.border,
          }}
        >
          <div className="flex items-center gap-2 mb-5">
            <Palette size={22} style={{ color: palette.primary }} />
            <h2 className="text-xl font-semibold">Theme Mode</h2>
          </div>

          <div className="flex gap-3 flex-wrap">
            {[
              { name: "Light", icon: Sun, value: "light" },
              { name: "Dark", icon: Moon, value: "dark" },
              { name: "System", icon: Laptop, value: "system" },
            ].map(({ name, icon: Icon, value }) => (
              <button
                key={name}
                onClick={() => setTheme(value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  theme === value
                    ? "bg-gradient-to-r from-sky-500 to-cyan-400 text-white shadow-md"
                    : "border hover:bg-sky-100/10"
                }`}
                style={{
                  border: theme === value ? "none" : `1px solid ${palette.border}`,
                }}
              >
                <Icon size={18} /> {name}
              </button>
            ))}
          </div>
        </section>

        {/* === Data Export === */}
        <section
          className="rounded-2xl p-6 shadow-lg transition-all duration-300 border hover:shadow-xl"
          style={{
            background: palette.card,
            borderColor: palette.border,
          }}
        >
          <div className="flex items-center gap-2 mb-5">
            <Database size={22} style={{ color: palette.primary }} />
            <h2 className="text-xl font-semibold">Data Management</h2>
          </div>
          <p className="text-sm mb-4" style={{ color: palette.lightText }}>
            Export your trade history for analytics or personal records.
          </p>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 bg-gradient-to-r from-sky-500 to-cyan-400 text-white font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-all duration-200"
          >
            <Download size={18} /> Export to CSV
          </button>
        </section>

        {/* === Reset Journal === */}
        <section
          className="rounded-2xl p-6 shadow-lg transition-all duration-300 border hover:shadow-xl"
          style={{
            background: palette.card,
            borderColor: palette.border,
          }}
        >
          <div className="flex items-center gap-2 mb-5">
            <AlertTriangle size={22} className="text-rose-500" />
            <h2 className="text-xl font-semibold">Reset Journal</h2>
          </div>
          <p className="text-sm mb-4" style={{ color: palette.lightText }}>
            Permanently remove all your stored trades from the database.
          </p>
          <button
            onClick={resetJournal}
            className="flex items-center gap-2 bg-gradient-to-r from-rose-600 to-red-500 text-white font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-all duration-200"
          >
            <Trash2 size={18} /> Delete All Trades
          </button>
        </section>
      </div>
    </div>
  )
}
