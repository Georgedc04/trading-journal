"use client";

import { useState, Fragment } from "react";
import { useTheme } from "next-themes";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  BarChart3,
  AlignLeft,
  Check,
  ChevronDown,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import { Listbox, Transition } from "@headlessui/react";

type TradeFormProps = {
  onAdd: (payload: any) => Promise<void>;
  disabled?: boolean;
};

export default function TradeForm({ onAdd, disabled }: TradeFormProps) {
  const { theme } = useTheme();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    id: crypto.randomUUID(),
    date: "",
    direction: "Buy",
    quality: "A+",
    pair: "EURUSD",
    reason: "",
    type: "profit",
    amount: "",
    session: "London",
    beforeImageUrl: "",
    afterImageUrl: "",
  });

  // ✅ Lightweight async image handler
  const handleImageUpload = (e: any, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError("⚠️ Image too large (max 2MB)");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () =>
      setForm((prev) => ({ ...prev, [field]: reader.result as string }));
    reader.readAsDataURL(file);
  };

  // ✅ Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.date || !form.direction || !form.reason || !form.amount) {
      return setError("⚠️ Please fill all required fields. before adding");
    }
    setError("");
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        amount: Number(form.amount),
        result:
          form.type === "loss"
            ? -Math.abs(Number(form.amount))
            : Math.abs(Number(form.amount)),
      };
      await onAdd(payload);
      setForm({
        id: crypto.randomUUID(),
        date: "",
        direction: "Buy",
        quality: "A+",
        pair: "EURUSD",
        reason: "",
        type: "profit",
        amount: "",
        session: "London",
        beforeImageUrl: "",
        afterImageUrl: "",
      });
    } catch {
      setError("❌ Failed to add trade. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const isDark = theme === "dark";
  const palette = isDark
    ? {
        bg: "linear-gradient(145deg, #0B0F14, #111827)",
        border: "#1E293B",
        text: "#E2E8F0",
        accent: "#38BDF8",
        shadow: "0 8px 25px rgba(56,189,248,0.2)",
      }
    : {
        bg: "linear-gradient(145deg, #F9FAFB, #E0F2FE)",
        border: "#CBD5E1",
        text: "#1E293B",
        accent: "#2563EB",
        shadow: "0 8px 25px rgba(37,99,235,0.15)",
      };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl p-6 flex flex-col gap-4 transition-all duration-300"
      style={{
        background: palette.bg,
        border: `1px solid ${palette.border}`,
        boxShadow: palette.shadow,
        color: palette.text,
      }}
    >
      <h2
        className="text-xl font-bold flex items-center gap-2 bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent"
      >
        <BarChart3 size={20} /> Add New Trade
      </h2>

      {/* === Basic Inputs === */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <InputField
          icon={<Calendar size={18} />}
          type="date"
          value={form.date}
          onChange={(e: any) => setForm({ ...form, date: e.target.value })}
          palette={palette}
        />

        <DropdownField
          label="Direction"
          value={form.direction}
          setValue={(v: string) => setForm({ ...form, direction: v })}
          options={[
            { name: "Buy", icon: <TrendingUp color="#22c55e" size={16} /> },
            { name: "Sell", icon: <TrendingDown color="#ef4444" size={16} /> },
          ]}
          palette={palette}
        />

        <InputField
          icon={<DollarSign size={18} />}
          type="number"
          placeholder="Amount ($)"
          value={form.amount}
          onChange={(e: any) => setForm({ ...form, amount: e.target.value })}
          palette={palette}
        />
      </div>

      {/* === Type / Session / Quality === */}
      <div className="grid sm:grid-cols-3 gap-4">
        <DropdownField
          label="Type"
          value={form.type}
          setValue={(v: string) => setForm({ ...form, type: v })}
          options={[
            { name: "profit", icon: <TrendingUp color="#22c55e" size={16} /> },
            { name: "loss", icon: <TrendingDown color="#ef4444" size={16} /> },
          ]}
          palette={palette}
        />

        <DropdownField
          label="Session"
          value={form.session}
          setValue={(v: string) => setForm({ ...form, session: v })}
          options={[
            { name: "London" },
            { name: "New York" },
            { name: "Asian" },
          ]}
          palette={palette}
        />

        <DropdownField
          label="Quality"
          value={form.quality}
          setValue={(v: string) => setForm({ ...form, quality: v })}
          options={[{ name: "A+" }, { name: "A" }, { name: "B" }, { name: "C" }]}
          palette={palette}
        />
      </div>

      {/* === Images === */}
      <div className="grid sm:grid-cols-2 gap-4">
        {(["beforeImageUrl", "afterImageUrl"] as const).map((key) => (
          <div key={key} className="flex flex-col gap-2">
            <InputField
              icon={<ImageIcon size={18} />}
              type="file"
              accept="image/*"
              onChange={(e: any) => handleImageUpload(e, key)}
              palette={palette}
            />
            {form[key] && (
              <img
                src={form[key]}
                alt={key}
                className="rounded-lg w-full h-40 object-cover shadow-md border border-gray-600/20"
              />
            )}
          </div>
        ))}
      </div>

      {/* === Reason === */}
      <div className="flex items-start gap-2">
        <AlignLeft size={18} className="mt-2 text-sky-400" />
        <textarea
          placeholder="Reason for trade..."
          value={form.reason}
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
          className="w-full rounded-md p-2 border text-sm resize-none h-20 outline-none focus:ring-2 focus:ring-sky-400"
          style={{
            background: "rgba(255,255,255,0.03)",
            borderColor: palette.border,
            color: palette.text,
          }}
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* === Submit === */}
      <button
        type="submit"
        disabled={disabled || submitting}
        className="mt-2 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all text-white active:scale-95"
        style={{
          background: disabled
            ? "#94a3b8"
            : "linear-gradient(90deg, #38bdf8, #06b6d4)",
          boxShadow: "0 4px 15px rgba(56,189,248,0.3)",
        }}
      >
        {submitting ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Adding...
          </>
        ) : (
          "Add Trade"
        )}
      </button>
    </form>
  );
}

/* === Input Field === */
function InputField({ icon, palette, ...props }: any) {
  return (
    <div
      className="flex items-center gap-2 rounded-md px-2 border focus-within:ring-2 focus-within:ring-sky-400"
      style={{ borderColor: palette.border }}
    >
      {icon}
      <input
        {...props}
        className="w-full bg-transparent outline-none p-2 text-sm"
        style={{ color: palette.text }}
      />
    </div>
  );
}

/* === Dropdown Field === */
function DropdownField({ label, value, setValue, options, palette }: any) {
  return (
    <Listbox value={value} onChange={(v) => setValue(v || label)}>
      <div className="relative">
        <Listbox.Button
          className="flex items-center justify-between w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-sky-400"
          style={{
            borderColor: palette.border,
            background: "transparent",
            color: palette.text,
          }}
        >
          <span className="flex items-center gap-2">
            {options.find((o: any) => o.name === value)?.icon}
            {value || label}
          </span>
          <ChevronDown size={16} />
        </Listbox.Button>

        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options
            className="absolute mt-1 w-full rounded-md shadow-lg max-h-60 overflow-auto z-50"
            style={{
              background: palette.bg,
              border: `1px solid ${palette.border}`,
            }}
          >
            {options.map((opt: any) => (
              <Listbox.Option
                key={opt.name}
                value={opt.name}
                className={({ active }) =>
                  `cursor-pointer flex items-center justify-between px-3 py-2 text-sm ${
                    active ? "bg-sky-500 text-white" : ""
                  }`
                }
              >
                {({ selected }) => (
                  <>
                    <span className="flex items-center gap-2">
                      {opt.icon}
                      {opt.name}
                    </span>
                    {selected && <Check size={16} />}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}
