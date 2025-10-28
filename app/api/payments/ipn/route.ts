import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PlanType } from "@prisma/client";

/**
 * ✅ NOWPayments IPN Handler
 * Receives POST requests when a payment is completed.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("💰 NOWPayments IPN:", body);

    const { payment_status, price_amount, customer_email } = body;

    // ✅ 1. Check if payment was successful
    if (!["finished", "confirmed"].includes(payment_status)) {
      return NextResponse.json({ message: "Payment pending or failed" }, { status: 200 });
    }

    if (!customer_email) {
      console.warn("⚠️ Missing customer email in IPN payload");
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    // ✅ 2. Find user by email
    const user = await prisma.user.findFirst({
      where: { email: customer_email },
    });

    if (!user) {
      console.warn(`⚠️ No user found for email: ${customer_email}`);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ 3. Determine plan from payment amount
    let newPlan: PlanType = PlanType.FREE;
    let duration: "month" | "year" = "month";

    const amount = Number(price_amount);

    if (amount === 3 || amount === 30) newPlan = PlanType.NORMAL;
    if (amount === 5.99 || amount === 50) newPlan = PlanType.PRO;

    if (amount === 30 || amount === 50) duration = "year";

    // ✅ 4. Set expiration date
    const now = new Date();
    const expiresAt =
      duration === "year"
        ? new Date(now.setFullYear(now.getFullYear() + 1))
        : new Date(now.setMonth(now.getMonth() + 1));

    // ✅ 5. Update or create userPlan
    await prisma.userPlan.upsert({
      where: { userId: user.id },
      update: { plan: newPlan, expiresAt },
      create: { userId: user.id, plan: newPlan, expiresAt },
    });

    console.log(`✅ ${customer_email} upgraded to ${newPlan} (${duration})`);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("🔥 NOWPayments IPN Error:", err);
    return NextResponse.json(
      { error: "Server error processing payment" },
      { status: 500 }
    );
  }
}
