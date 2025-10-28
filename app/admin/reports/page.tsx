"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Download,
  BarChart3,
  Users,
  BookOpen,
  AlertTriangle,
  RefreshCcw,
} from "lucide-react";

export default function AdminReports() {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 📦 Fetch report (auto-refresh every 3 minutes)
  useEffect(() => {
    const fetchReport = async () => {
      setRefreshing(true);
      try {
        const res = await fetch("/api/admin/reports/refresh", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch report");
        const data = await res.json();
        setReport(data);
      } catch (err) {
        console.error("Report fetch failed:", err);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };

    fetchReport();
    const interval = setInterval(fetchReport, 3 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // 💾 Download handler
  const handleDownload = (format: "csv" | "json") => {
    if (!report) return;
    const dataStr =
      format === "json"
        ? JSON.stringify(report, null, 2)
        : Object.keys(report)
            .map((key) => `${key},${report[key]}`)
            .join("\n");
    const blob = new Blob([dataStr], {
      type: format === "json" ? "application/json" : "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dc_trades_report.${format}`;
    a.click();
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-cyan-300">
        Loading Reports...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0B0F14] text-gray-100 p-6 sm:p-10">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* === Header === */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-cyan-300 flex items-center gap-2">
              <BarChart3 size={26} /> Platform Reports
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Insight into user activity, system performance, and journal stats.
            </p>
            {report?.lastUpdated && (
              <p className="text-xs text-gray-500 mt-2">
                Last updated: {report.lastUpdated}{" "}
                {report.cached && "(cached)"}
              </p>
            )}
          </div>

          {/* === Download + Refresh Buttons === */}
          <div className="flex gap-3 mt-4 sm:mt-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleDownload("csv")}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-sky-400 text-black font-semibold rounded-md shadow-md hover:opacity-90"
            >
              <Download size={16} /> CSV
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleDownload("json")}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-semibold rounded-md shadow-md hover:opacity-90"
            >
              <Download size={16} /> JSON
            </motion.button>

            <motion.button
              whileHover={{ rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              disabled={refreshing}
              onClick={async () => {
                setRefreshing(true);
                const res = await fetch("/api/admin/reports/refresh?force=true");
                const data = await res.json();
                setReport(data);
                setRefreshing(false);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold shadow-md transition-all ${
                refreshing
                  ? "bg-gray-700 text-gray-400"
                  : "bg-gradient-to-r from-sky-500 to-cyan-400 text-black"
              }`}
            >
              <RefreshCcw size={16} /> {refreshing ? "Refreshing..." : "Refresh"}
            </motion.button>
          </div>
        </div>

        {/* === Summary Cards === */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <ReportCard
            title="Total Users"
            icon={<Users className="text-cyan-300 w-6 h-6" />}
            value={report?.totalUsers || 0}
            color="from-sky-500 to-cyan-400"
          />
          <ReportCard
            title="Total Journals"
            icon={<BookOpen className="text-emerald-400 w-6 h-6" />}
            value={report?.totalJournals || 0}
            color="from-emerald-500 to-green-400"
          />
          <ReportCard
            title="Active Today"
            icon={<Activity className="text-teal-300 w-6 h-6" />}
            value={report?.activeToday || 0}
            color="from-teal-500 to-emerald-400"
          />
        </div>

        {/* === Detailed Logs === */}
        <div className="bg-[#0E1522]/90 border border-cyan-400/10 rounded-2xl shadow-xl p-6 backdrop-blur-xl">
          <h2 className="text-xl font-semibold text-cyan-300 flex items-center gap-2 mb-4">
            <AlertTriangle size={18} /> Activity Logs
          </h2>

          {report?.logs?.length ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-[#0F172A] text-cyan-300">
                  <tr>
                    <th className="p-3 text-left">Time</th>
                    <th className="p-3 text-left">User</th>
                    <th className="p-3 text-left">Action</th>
                    <th className="p-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {report.logs.map((log: any, i: number) => (
                    <tr
                      key={i}
                      className="border-b border-cyan-400/10 hover:bg-cyan-400/5 transition-all"
                    >
                      <td className="p-3 text-gray-400 text-xs sm:text-sm">
                        {log.time}
                      </td>
                      <td className="p-3 text-gray-300">{log.user}</td>
                      <td className="p-3 text-gray-300">{log.action}</td>
                      <td
                        className={`p-3 font-medium ${
                          log.status === "Success"
                            ? "text-emerald-400"
                            : "text-red-400"
                        }`}
                      >
                        {log.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-400 text-sm text-center py-6">
              No recent activity logs found.
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}

/* === Report Card Component === */
function ReportCard({
  title,
  value,
  color,
  icon,
}: {
  title: string;
  value: any;
  color: string;
  icon: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`rounded-xl p-6 bg-gradient-to-r ${color} text-black font-bold shadow-lg`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold opacity-80">{title}</h3>
          <p className="text-3xl">{value}</p>
        </div>
        <div className="p-2 bg-black/10 rounded-full">{icon}</div>
      </div>
    </motion.div>
  );
}
