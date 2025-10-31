import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PlanType } from "@prisma/client";

/**
 * ✅ NOWPayments IPN Handler
 * Triggered automatically when a user payment succeeds.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("💰 NOWPayments IPN received:", body);

    const { payment_status, price_amount, customer_email } = body;

    // ✅ 1. Verify successful payment
    if (!["finished", "confirmed"].includes(payment_status?.toLowerCase())) {
      return NextResponse.json(
        { message: "Payment not completed yet" },
        { status: 200 }
      );
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

    // ✅ 3. Identify plan and duration based on paid amount
    const amount = parseFloat(price_amount);
    let newPlan: PlanType = PlanType.FREE;
    let duration: "month" | "year" = "month";

    // Normal plan: $15 (3 months) or $40 (year)
    if (amount === 15 || amount === 40) newPlan = PlanType.NORMAL;

    // Pro plan: $16 (2 months) or $60 (year)
    if (amount === 16 || amount === 60) newPlan = PlanType.PRO;

    // Determine duration
    if (amount === 40 || amount === 60) duration = "year";

    // ✅ 4. Calculate expiration date
    const now = new Date();
    let expiresAt: Date;

    if (duration === "year") {
      expiresAt = new Date(now.setFullYear(now.getFullYear() + 1));
    } else {
      // For monthly-like subscriptions:
      // Normal = 3 months, Pro = 2 months
      const monthsToAdd = newPlan === PlanType.PRO ? 2 : 3;
      expiresAt = new Date(now.setMonth(now.getMonth() + monthsToAdd));
    }

    // ✅ 5. Update or create user plan
    await prisma.userPlan.upsert({
      where: { userId: user.id },
      update: { plan: newPlan, expiresAt },
      create: { userId: user.id, plan: newPlan, expiresAt },
    });

    console.log(`✅ ${customer_email} upgraded to ${newPlan} (${duration})`);

    // ✅ 6. Acknowledge success
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("🔥 NOWPayments IPN Error:", err);
    return NextResponse.json(
      { error: "Server error processing IPN" },
      { status: 500 }
    );
  }
}
