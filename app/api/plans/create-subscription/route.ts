import { NextResponse } from "next/server";

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  "https://trading-journal-inky-alpha.vercel.app";

export async function POST(req: Request) {
  try {
    const { plan, duration, email } = await req.json();

    if (!plan || !duration) {
      return NextResponse.json(
        { error: "Missing plan or duration" },
        { status: 400 }
      );
    }

    // ✅ Updated pricing + slight buffer to bypass "less than minimal" crypto issue
    const prices: Record<string, number> = {
      NORMAL_month: 6.1, // ($3/mo * 2) + buffer
      NORMAL_year: 30.1,
      PRO_month: 6.1,
      PRO_year: 50.1,
    };

    const price_amount = prices[`${plan}_${duration}`];
    if (!price_amount) {
      return NextResponse.json(
        { error: "Invalid plan or duration" },
        { status: 400 }
      );
    }

    // ✅ Create NOWPayments invoice (public-safe endpoint)
    const response = await fetch("https://api.nowpayments.io/v1/invoice", {
      method: "POST",
      headers: {
        "x-api-key": process.env.NOWPAYMENTS_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        price_amount,
        price_currency: "usd",
        pay_currency: "usdttrc20", // Recommended for stability and low fees
        order_id: `${plan}_${duration}_${Date.now()}`,
        order_description: `${plan} ${duration} subscription`,
        customer_email: email || "user@example.com",
        ipn_callback_url: `${BASE_URL}/api/payments/ipn`,
        success_url: `${BASE_URL}/dashboard?success=${plan}_${duration}`,
        cancel_url: `${BASE_URL}/plans?cancelled=true`,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.invoice_url) {
      console.error("❌ NOWPayments error:", data);
      return NextResponse.json(
        { error: data.message || "Failed to create invoice" },
        { status: 400 }
      );
    }

    // ✅ Return valid payment link
    return NextResponse.json({ payment_url: data.invoice_url });
  } catch (err) {
    console.error("🔥 Payment creation failed:", err);
    return NextResponse.json(
      { error: "Server error while creating payment" },
      { status: 500 }
    );
  }
}
