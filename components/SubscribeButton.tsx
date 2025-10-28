"use client";
import { useState } from "react";

export default function SubscribeButton({ plan, price }: { plan: string; price: number }) {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    const res = await fetch("/api/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: price, plan, duration: "month" }),
    });
    const data = await res.json();
    setLoading(false);

    if (data.invoice_url) {
      window.location.href = data.invoice_url;
    } else {
      alert(data.error || "Payment failed");
    }
  };

  return (
    <button
      onClick={handleSubscribe}
      disabled={loading}
      className="px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold hover:opacity-90 transition-all"
    >
      {loading ? "Processing..." : `Subscribe to ${plan}`}
    </button>
  );
}
