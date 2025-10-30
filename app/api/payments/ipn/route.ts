import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PlanType } from "@prisma/client";

/**
 * ✅ NOWPayments IPN Handler
 * Automatically triggered by NOWPayments when a payment succeeds.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("💰 NOWPayments IPN received:", body);

    const { payment_status, price_amount, customer_email } = body;

    // ✅ 1. Ensure payment is confirmed or finished
    if (!["finished", "confirmed"].includes(payment_status?.toLowerCase())) {
      return NextResponse.json({ message: "Payment not completed yet" }, { status: 200 });
    }

    if (!customer_email) {
      console.warn("⚠️ Missing customer_email in NOWPayments payload");
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    // ✅ 2. Find the user by email
    const user = await prisma.user.findFirst({
      where: { email: customer_email },
    });

    if (!user) {
      console.warn(`⚠️ No user found for email: ${customer_email}`);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ 3. Identify plan based on payment amount
    const amount = parseFloat(price_amount);
    let newPlan: PlanType = PlanType.FREE;
    let duration: "month" | "year" = "month";

    if (amount === 10 || amount === 30) newPlan = PlanType.NORMAL;
    if (amount === 15 || amount === 50) newPlan = PlanType.PRO;

    if (amount === 30 || amount === 50) duration = "year";

    // ✅ 4. Set expiration: 3 months for short-term, 1 year for yearly
    const now = new Date();
    const expiresAt =
      duration === "year"
        ? new Date(now.setFullYear(now.getFullYear() + 1))
        : new Date(now.setMonth(now.getMonth() + 3));

    // ✅ 5. Save or update user’s plan
    await prisma.userPlan.upsert({
      where: { userId: user.id },
      update: { plan: newPlan, expiresAt },
      create: { userId: user.id, plan: newPlan, expiresAt },
    });

    console.log(`✅ ${customer_email} upgraded to ${newPlan} (${duration})`);

    // ✅ 6. Acknowledge success to NOWPayments
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("🔥 NOWPayments IPN Error:", err);
    return NextResponse.json(
      { error: "Server error processing IPN" },
      { status: 500 }
    );
  }
}
