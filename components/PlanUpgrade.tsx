"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Crown, Star, Zap } from "lucide-react";
import { useUser } from "@clerk/nextjs";

export default function PlanUpgrade() {
  const { user } = useUser();
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [activePlan, setActivePlan] = useState<string>("FREE");

  const handleUpgrade = async (plan: string, duration: "month" | "year") => {
    try {
      setLoading(plan);
      setMessage(null);

      const res = await fetch("/api/plans/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          duration,
          email: user?.primaryEmailAddress?.emailAddress || "user@example.com",
        }),
      });

      const data = await res.json();
      setLoading(null);

      if (data.payment_url) {
        window.location.href = data.payment_url; // redirect to NOWPayments
      } else {
        setMessage(`❌ ${data.error || "Failed to start payment."}`);
      }
    } catch (err) {
      console.error("💥 Payment error:", err);
      setMessage("❌ Error connecting to payment server.");
      setLoading(null);
    }
  };

  const plans = [
    {
      name: "Free Plan",
      icon: <Star className="text-sky-400" size={26} />,
      monthly: "Free",
      yearly: "Free",
      features: ["✅ Create up to 1 journal", "🚫 No analytics"],
      color: "from-gray-700 to-gray-800",
      plan: "FREE",
    },
    {
      name: "Normal Plan",
      icon: <Zap className="text-emerald-400" size={26} />,
      monthly: "$7.5 / 2 months",
      yearly: "$30 / year",
      features: [
        "✅ Unlimited trades",
        "✅ 1 journal account",
        "⚡ Basic performance charts",
      ],
      color: "from-emerald-600 to-emerald-800",
      plan: "NORMAL",
    },
    {
      name: "Pro Plan",
      icon: <Crown className="text-yellow-400" size={26} />,
      monthly: "$7.5 / month",
      yearly: "$50 / year",
      features: [
        "✅ Unlimited journals & trades",
        "✅ All analytics & charts",
        "🚀 AI-powered insights",
      ],
      color: "from-indigo-600 to-purple-700",
      plan: "PRO",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto mt-10 p-6"
    >
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-sky-400 mb-6">
        Choose Your Trading Plan
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((p) => (
          <motion.div
            key={p.name}
            whileHover={{ scale: 1.03 }}
            className={`rounded-2xl p-6 shadow-lg border backdrop-blur-md bg-gradient-to-br ${p.color} border-sky-500/20 flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                {p.icon}
                <h2 className="text-xl font-semibold text-white">{p.name}</h2>
              </div>

              <div className="text-lg font-medium text-cyan-200 mb-3">
                <p>{p.monthly}</p>
                {p.plan !== "FREE" && (
                  <p className="text-gray-300 text-sm">{p.yearly}</p>
                )}
              </div>

              <ul className="text-sm text-gray-200 space-y-1 mb-4">
                {p.features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>

            {p.plan === "FREE" ? (
              <button
                disabled
                className="w-full mt-4 py-2 rounded-lg font-semibold bg-gray-700 text-gray-300 cursor-not-allowed"
              >
                ✅ Free Plan Active
              </button>
            ) : (
              <div className="flex gap-2 mt-4">
                <button
                  disabled={loading === `${p.plan}_month`}
                  onClick={() => handleUpgrade(p.plan, "month")}
                  className={`flex-1 py-2 rounded-lg font-semibold text-white transition-all ${
                    loading === `${p.plan}_month`
                      ? "bg-sky-600 cursor-wait"
                      : "bg-gradient-to-r from-sky-500 to-cyan-500 hover:opacity-90"
                  }`}
                >
                  {loading === `${p.plan}_month` ? "Processing..." : "Monthly"}
                </button>

                <button
                  disabled={loading === `${p.plan}_year`}
                  onClick={() => handleUpgrade(p.plan, "year")}
                  className={`flex-1 py-2 rounded-lg font-semibold text-white transition-all ${
                    loading === `${p.plan}_year`
                      ? "bg-sky-600 cursor-wait"
                      : "bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-90"
                  }`}
                >
                  {loading === `${p.plan}_year` ? "Processing..." : "Yearly"}
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {message && (
        <div className="mt-6 text-center text-sm font-medium text-cyan-300">
          {message}
        </div>
      )}
    </motion.div>
  );
}
