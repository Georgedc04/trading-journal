"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Trash2,
  Loader2,
  Crown,
  Search,
  Filter,
  ShieldOff,
} from "lucide-react";

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | "ADMIN" | "USER">("ALL");

  // 🔹 Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/users", { cache: "no-store" });
        const data = await res.json();
        setUsers(data.users || []);
      } catch (err) {
        console.error("Fetch users failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // 🔹 Filter & search logic
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.name.toLowerCase().includes(search.toLowerCase());
      const matchRole =
        filter === "ALL" ||
        (filter === "ADMIN" ? u.role === "ADMIN" : u.role !== "ADMIN");
      return matchSearch && matchRole;
    });
  }, [users, search, filter]);

  // 🔹 Delete user
  const handleDelete = async (email: string) => {
    if (!confirm(`Are you sure you want to delete ${email}?`)) return;
    setProcessing(email);
    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.email !== email));
        showAlert(`🗑️ ${email} deleted successfully`, "success");
      } else showAlert(data.error || "Failed to delete user", "error");
    } catch {
      showAlert("Server error while deleting user", "error");
    } finally {
      setProcessing(null);
    }
  };

  // 🔹 Make Admin
  const handleMakeAdmin = async (email: string) => {
    if (!confirm(`Grant admin privileges to ${email}?`)) return;
    setProcessing(email);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role: "ADMIN" }),
      });
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.email === email ? { ...u, role: "ADMIN" } : u))
        );
        showAlert(`👑 ${email} is now an Admin`, "success");
      } else showAlert(data.error || "Failed to update role", "error");
    } catch {
      showAlert("Server error while updating role", "error");
    } finally {
      setProcessing(null);
    }
  };

  // 🔹 Remove Admin (Demote)
  const handleRemoveAdmin = async (email: string) => {
    if (!confirm(`Remove admin privileges from ${email}?`)) return;
    setProcessing(email);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role: "USER" }),
      });
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.email === email ? { ...u, role: "USER" } : u))
        );
        showAlert(`🛡️ ${email} is no longer an Admin`, "success");
      } else showAlert(data.error || "Failed to update role", "error");
    } catch {
      showAlert("Server error while updating role", "error");
    } finally {
      setProcessing(null);
    }
  };

  // ✅ Simple custom alert
  const showAlert = (message: string, type: "success" | "error") => {
    const div = document.createElement("div");
    div.textContent = message;
    div.className = `fixed bottom-5 right-5 px-4 py-2 rounded-md text-sm font-medium shadow-lg transition-all z-[9999] ${
      type === "success"
        ? "bg-emerald-500 text-black"
        : "bg-red-500 text-white"
    }`;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 2500);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-cyan-300">
        <Loader2 className="animate-spin w-6 h-6 mr-2" /> Loading Users...
      </div>
    );

  return (
    <div className="bg-[#0B0F14] text-gray-100 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="p-6 sm:p-10"
      >
        <h1 className="text-3xl font-bold mb-4 text-cyan-300 flex items-center gap-2">
          <Users size={24} /> User Management
        </h1>

        {/* 🔍 Search + Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <div className="relative w-full sm:w-1/2">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-md bg-[#111827] border border-cyan-400/10 focus:ring-2 focus:ring-cyan-400 outline-none text-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={18} className="text-cyan-300" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-3 py-2 rounded-md bg-[#111827] border border-cyan-400/10 focus:ring-2 focus:ring-cyan-400 outline-none text-sm"
            >
              <option value="ALL">All Users</option>
              <option value="USER">Normal Users</option>
              <option value="ADMIN">Admins</option>
            </select>
          </div>
        </div>

        {/* 📋 Users Table */}
        <div className="bg-[#0E1522]/90 border border-cyan-400/10 rounded-2xl shadow-xl p-6 backdrop-blur-xl overflow-x-auto">
          {filteredUsers.length ? (
            <table className="min-w-full text-sm">
              <thead className="bg-[#0F172A] text-cyan-300">
                <tr>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Role</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Created</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u, i) => (
                  <tr
                    key={i}
                    className="border-b border-cyan-400/10 hover:bg-cyan-400/5 transition-all"
                  >
                    <td className="p-3">{u.email}</td>
                    <td className="p-3">{u.name}</td>
                    <td className="p-3">{u.role}</td>
                    <td className="p-3">{u.status}</td>
                    <td className="p-3">{u.createdAt}</td>
                    <td className="p-3 flex flex-wrap gap-2">
                      {u.role === "ADMIN" ? (
                        <button
                          onClick={() => handleRemoveAdmin(u.email)}
                          disabled={processing === u.email}
                          className="flex items-center gap-1 px-3 py-1 rounded-md bg-gradient-to-r from-sky-500 to-cyan-400 text-black hover:opacity-90 text-xs font-semibold"
                        >
                          <ShieldOff size={14} />
                          Remove Admin
                        </button>
                      ) : (
                        <button
                          onClick={() => handleMakeAdmin(u.email)}
                          disabled={processing === u.email}
                          className="flex items-center gap-1 px-3 py-1 rounded-md text-black bg-gradient-to-r from-amber-400 to-yellow-300 hover:opacity-90 text-xs font-semibold"
                        >
                          <Crown size={14} />
                          Make Admin
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(u.email)}
                        disabled={processing === u.email}
                        className="flex items-center gap-1 px-3 py-1 rounded-md bg-gradient-to-r from-red-500 to-rose-500 text-white hover:opacity-90 text-xs font-semibold"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-400 text-center py-6">
              No users match your search/filter.
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
