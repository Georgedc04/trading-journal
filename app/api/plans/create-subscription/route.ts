import { NextResponse } from "next/server";

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://trading-journal-inky-alpha.vercel.app";

export async function POST(req: Request) {
  try {
    const { plan, duration, email } = await req.json();

    if (!plan || !duration) {
      return NextResponse.json({ error: "Missing plan or duration" }, { status: 400 });
    }

    const planMap: Record<string, string | undefined> = {
      NORMAL_month: process.env.NORMAL_MONTH_PLAN_ID,
      NORMAL_year: process.env.NORMAL_YEAR_PLAN_ID,
      PRO_month: process.env.PRO_MONTH_PLAN_ID,
      PRO_year: process.env.PRO_YEAR_PLAN_ID,
    };

    const planId = planMap[`${plan}_${duration}`];
    if (!planId) {
      return NextResponse.json({ error: "Invalid plan or duration" }, { status: 400 });
    }

    // ✅ Correct NOWPayments endpoint (plural)
    const response = await fetch("https://api.nowpayments.io/v1/subscriptions", {
      method: "POST",
      headers: {
        "x-api-key": process.env.NOWPAYMENTS_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        plan_id: planId,
        price_currency: "usd",
        customer_email: email || "user@example.com",
        ipn_callback_url: `${BASE_URL}/api/payments/ipn`,
        success_url: `${BASE_URL}/dashboard?success=${plan}_${duration}`,
        cancel_url: `${BASE_URL}/plans?cancelled=true`,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ NOWPayments error:", data);
      return NextResponse.json(
        { error: data.message || "NOWPayments request failed" },
        { status: 400 }
      );
    }

    return NextResponse.json({ payment_url: data.subscription_url });
  } catch (err) {
    console.error("🔥 Subscription creation failed:", err);
    return NextResponse.json(
      { error: "Server error while creating subscription" },
      { status: 500 }
    );
  }
}
