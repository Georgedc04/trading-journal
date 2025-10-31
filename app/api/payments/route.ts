import { NextResponse } from "next/server";

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  "https://trading-journal-inky-alpha.vercel.app";

export async function POST(req: Request) {
  try {
    const { plan, duration, email } = await req.json();

    // ✅ Check required fields
    if (!plan || !duration || !email) {
      return NextResponse.json(
        { error: "Missing plan, duration, or email" },
        { status: 400 }
      );
    }

    // ✅ Define updated pricing
    const prices: Record<string, number> = {
      NORMAL_month: 15, // 3 months
      NORMAL_year: 40,
      PRO_month: 16, // 2 months
      PRO_year: 60,
    };

    const price_amount = prices[`${plan}_${duration}`];
    if (!price_amount) {
      return NextResponse.json(
        { error: "Invalid plan or duration" },
        { status: 400 }
      );
    }

    // ✅ Create invoice on NOWPayments
    const res = await fetch("https://api.nowpayments.io/v1/invoice", {
      method: "POST",
      headers: {
        "x-api-key": process.env.NOWPAYMENTS_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        price_amount,
        price_currency: "usd",
        pay_currency: "usdttrc20", // Stable network (USDT on TRON)
        order_id: `dc-trades-${Date.now()}`,
        order_description: `${plan} ${duration} subscription`,
        customer_email: email,
        ipn_callback_url: `${BASE_URL}/api/payments/ipn`,
        success_url: `${BASE_URL}/dashboard?success=${plan}_${duration}`,
        cancel_url: `${BASE_URL}/plans?cancelled=true`,
      }),
    });

    const data = await res.json();

    // ✅ Handle NOWPayments errors
    if (!res.ok || !data.invoice_url) {
      console.error("❌ NOWPayments error:", data);
      return NextResponse.json(
        { error: data.message || "Failed to create invoice" },
        { status: 400 }
      );
    }

    // ✅ Return invoice payment link to frontend
    return NextResponse.json({ payment_url: data.invoice_url });
  } catch (err: any) {
    console.error("💥 Payment API error:", err);
    return NextResponse.json(
      { error: err.message || "Server error while creating payment" },
      { status: 500 }
    );
  }
}
