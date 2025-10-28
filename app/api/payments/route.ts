import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { amount, email, plan } = await req.json();

    if (!amount || !email || !plan)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const res = await fetch("https://api.nowpayments.io/v1/invoice", {
      method: "POST",
      headers: {
        "x-api-key": process.env.NOWPAYMENTS_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        price_amount: amount,
        price_currency: "usd",
        order_id: `dc-trades-${Date.now()}`,
        order_description: `${plan} Plan Subscription`,
        customer_email: email,
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/plans/confirm?plan=${plan}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?cancel=true`,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Payment creation failed");
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("💥 Payment API error:", err);
    return NextResponse.json(
      { error: err.message || "Server error creating payment" },
      { status: 500 }
    );
  }
}
