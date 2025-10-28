"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Loader2,
  Users,
  Activity,
  PieChart as PieIcon,
  BarChart3,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function AdminJournals() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [journals, setJournals] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>({ users: 0, journals: 0 });

  // 🧩 Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userRes = await fetch("/api/admin/users", { cache: "no-store" });
        const userData = await userRes.json();
        setUsers(userData.users || []);

        const journalRes = await fetch("/api/admin/journals", { cache: "no-store" });
        const journalData = await journalRes.json();
        setSummary(journalData);
        setJournals(journalData.journalsList || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  /* === Compute Data (Always before any return) === */
  const usersByMonth = useMemo(() => {
    const map: Record<string, number> = {};
    users.forEach((u) => {
      const date = new Date(u.createdAt);
      const key = date.toLocaleString("default", { month: "short" });
      map[key] = (map[key] || 0) + 1;
    });
    return Object.entries(map).map(([month, users]) => ({ month, users }));
  }, [users]);

  const journalsByMonth = useMemo(() => {
    const map: Record<string, number> = {};
    (journals || []).forEach((j: any) => {
      const date = new Date(j.createdAt || new Date());
      const key = date.toLocaleString("default", { month: "short" });
      map[key] = (map[key] || 0) + 1;
    });
    return Object.entries(map).map(([month, journals]) => ({ month, journals }));
  }, [journals]);

  const roleDistribution = useMemo(() => {
    const admins = users.filter((u) => u.role === "ADMIN").length;
    const normal = users.length - admins;
    return [
      { name: "Admins", value: admins },
      { name: "Users", value: normal },
    ];
  }, [users]);

  const activeUsers = useMemo(() => {
    const active = users.filter((u) => u.status.includes("🟢")).length;
    const inactive = users.length - active;
    return [
      { status: "Active", count: active },
      { status: "Inactive", count: inactive },
    ];
  }, [users]);

  const COLORS = ["#06b6d4", "#34d399", "#fbbf24", "#f43f5e"];

  /* === Conditional Rendering (after hooks) === */
  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-cyan-300">
        <Loader2 className="animate-spin w-6 h-6 mr-2" /> Loading Analytics...
      </div>
    );

  /* === Render === */
  return (
    <div className="text-gray-100 p-6 sm:p-10">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold mb-6 text-cyan-300 flex items-center gap-2">
          <BookOpen size={24} /> Journals & User Analytics
        </h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <SummaryCard title="Total Users" value={summary.users || users.length} color="from-sky-500 to-cyan-400" />
          <SummaryCard title="Total Journals" value={summary.journals || 0} color="from-emerald-500 to-teal-400" />
          <SummaryCard title="Active Users" value={users.filter((u) => u.status.includes('🟢')).length || 'N/A'} color="from-yellow-400 to-amber-500" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ChartCard title="User Growth Over Time" icon={<Users className="text-cyan-300" size={18} />}>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={usersByMonth}>
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#06b6d4" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Journals Created Monthly" icon={<BarChart3 className="text-emerald-400" size={18} />}>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={journalsByMonth}>
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Bar dataKey="journals" fill="#34d399" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="User Role Distribution" icon={<PieIcon className="text-yellow-400" size={18} />}>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={roleDistribution} cx="50%" cy="50%" outerRadius={90} fill="#8884d8" dataKey="value" label>
                  {roleDistribution.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Active vs Inactive Users" icon={<Activity className="text-rose-400" size={18} />}>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={activeUsers}>
                <XAxis dataKey="status" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Bar dataKey="count" fill="#f43f5e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </motion.div>
    </div>
  );
}

/* === Components === */
function SummaryCard({ title, value, color }: any) {
  return (
    <div className={`rounded-xl p-6 text-black font-bold bg-gradient-to-r ${color} shadow-lg`}>
      <h3 className="text-sm opacity-80 mb-1">{title}</h3>
      <p className="text-3xl">{value}</p>
    </div>
  );
}

function ChartCard({ title, icon, children }: any) {
  return (
    <div className="bg-[#0E1522]/90 border border-cyan-400/10 rounded-xl p-5 shadow-lg backdrop-blur-xl">
      <div className="flex items-center gap-2 mb-3 text-cyan-300 font-semibold">
        {icon} <span>{title}</span>
      </div>
      {children}
    </div>
  );
}
