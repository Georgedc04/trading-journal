"use client";

export default function UsersTable({
  users,
  setUsers,
}: {
  users: any[];
  setUsers: (fn: any) => void;
}) {
  const handleRoleChange = async (id: string, role: string) => {
    try {
      await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, role }),
      });
      setUsers((prev: any[]) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
    } catch (err) {
      console.error("Role change failed:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setUsers((prev: any[]) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">User Management</h2>
      <div className="overflow-x-auto rounded-lg border border-cyan-400/10 bg-[#111827] shadow-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-[#0F172A] text-cyan-300">
            <tr>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((u) => (
                <tr key={u.id} className="hover:bg-cyan-400/5 transition-all">
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.name}</td>
                  <td className="p-3">{u.role}</td>
                  <td className="p-3">{u.status}</td>
                  <td className="p-3 flex justify-center gap-2">
                    <button
                      onClick={() =>
                        handleRoleChange(u.id, u.role === "ADMIN" ? "USER" : "ADMIN")
                      }
                      className="px-3 py-1 bg-cyan-500 text-black rounded-md text-xs font-semibold hover:bg-cyan-400"
                    >
                      {u.role === "ADMIN" ? "Demote" : "Promote"}
                    </button>
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-500 rounded-md text-xs font-semibold text-white"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-400">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
