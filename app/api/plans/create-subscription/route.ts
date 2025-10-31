import { NextResponse } from "next/server";

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  "https://trading-journal-inky-alpha.vercel.app";

export async function POST(req: Request) {
  try {
    const { plan, duration, email } = await req.json();

    if (!plan || !duration || !email) {
      return NextResponse.json(
        { error: "Missing plan, duration, or email" },
        { status: 400 }
      );
    }

    // ✅ 1. Map your plan IDs
    const planMap: Record<string, string | undefined> = {
      NORMAL_month: process.env.NORMAL_MONTH_PLAN_ID,
      NORMAL_year: process.env.NORMAL_YEAR_PLAN_ID,
      PRO_month: process.env.PRO_MONTH_PLAN_ID,
      PRO_year: process.env.PRO_YEAR_PLAN_ID,
    };

    const planId = planMap[`${plan}_${duration}`];

    // ✅ 2. Try creating subscription (if plan ID exists)
    if (planId) {
      const subscriptionRes = await fetch("https://api.nowpayments.io/v1/subscriptions", {
        method: "POST",
        headers: {
          "x-api-key": process.env.NOWPAYMENTS_API_KEY!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan_id: planId,
          customer_email: email,
          ipn_callback_url: `${BASE_URL}/api/payments/ipn`,
          success_url: `${BASE_URL}/dashboard?success=${plan}_${duration}`,
          cancel_url: `${BASE_URL}/plans?cancelled=true`,
        }),
      });

      const subscriptionData = await subscriptionRes.json();

      if (subscriptionRes.ok && subscriptionData.subscription_url) {
        console.log("✅ Subscription created successfully");
        return NextResponse.json({ payment_url: subscriptionData.subscription_url });
      }

      console.warn("⚠️ Subscription creation failed, using invoice fallback:", subscriptionData);
    }

    // ✅ 3. Fallback: create a direct invoice (multi-coin enabled)
    const fallbackPrices: Record<string, number> = {
      NORMAL_month: 15, // 3 months
      NORMAL_year: 40,
      PRO_month: 16, // 2 months
      PRO_year: 60,
    };

    const price_amount = fallbackPrices[`${plan}_${duration}`];
    if (!price_amount)
      return NextResponse.json({ error: "Invalid plan or duration" }, { status: 400 });

    const invoiceRes = await fetch("https://api.nowpayments.io/v1/invoice", {
      method: "POST",
      headers: {
        "x-api-key": process.env.NOWPAYMENTS_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        price_amount,
        price_currency: "usd",
        // ✅ Removed pay_currency → users can now choose any supported coin
        order_id: `${plan}_${duration}_${Date.now()}`,
        order_description: `${plan} ${duration} subscription`,
        customer_email: email || "user@example.com",
        ipn_callback_url: `${BASE_URL}/api/payments/ipn`,
        success_url: `${BASE_URL}/dashboard?success=${plan}_${duration}`,
        cancel_url: `${BASE_URL}/plans?cancelled=true`,
      }),
    });

    const invoiceData = await invoiceRes.json();

    if (!invoiceRes.ok || !invoiceData.invoice_url) {
      console.error("❌ NOWPayments invoice error:", invoiceData);
      return NextResponse.json(
        { error: invoiceData.message || "Failed to create payment" },
        { status: 400 }
      );
    }

    console.log("✅ Multi-coin invoice created successfully");
    return NextResponse.json({ payment_url: invoiceData.invoice_url });
  } catch (err: any) {
    console.error("🔥 Payment creation error:", err);
    return NextResponse.json(
      { error: err.message || "Server error while creating payment" },
      { status: 500 }
    );
  }
}
