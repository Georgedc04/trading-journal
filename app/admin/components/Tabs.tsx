"use client";

export default function Tabs({ tab, setTab }: { tab: string; setTab: (t: string) => void }) {
  return (
    <div className="flex gap-4 mb-6 border-b border-cyan-400/10">
      {["users", "journals"].map((t) => (
        <button
          key={t}
          onClick={() => setTab(t)}
          className={`pb-2 font-medium border-b-2 ${
            tab === t
              ? "border-cyan-400 text-cyan-400"
              : "border-transparent text-gray-500 hover:text-cyan-300"
          }`}
        >
          {t === "users" ? "Users" : "Summary"}
        </button>
      ))}
    </div>
  );
}
