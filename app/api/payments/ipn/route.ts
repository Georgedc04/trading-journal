import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PlanType } from "@prisma/client";

/**
 * ✅ NOWPayments IPN Handler
 * Called automatically when a payment is completed or updated.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("💰 NOWPayments IPN received:", body);

    const { payment_status, price_amount, customer_email } = body;

    // ✅ 1. Only handle completed payments
    if (!["finished", "confirmed"].includes(payment_status?.toLowerCase())) {
      return NextResponse.json({ message: "Payment not completed yet" }, { status: 200 });
    }

    if (!customer_email) {
      console.warn("⚠️ Missing customer_email in NOWPayments payload");
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    // ✅ 2. Find matching user by email
    const user = await prisma.user.findFirst({
      where: { email: customer_email },
    });

    if (!user) {
      console.warn(`⚠️ No user found for email: ${customer_email}`);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ 3. Determine plan from amount
    const amount = parseFloat(price_amount);
    let newPlan: PlanType = PlanType.FREE;
    let duration: "month" | "year" = "month";

    if (amount === 3 || amount === 30) newPlan = PlanType.NORMAL;
    if (amount === 5.99 || amount === 50) newPlan = PlanType.PRO;

    if (amount === 30 || amount === 50) duration = "year";

    // ✅ 4. Set expiration date
    const now = new Date();
    const expiresAt =
      duration === "year"
        ? new Date(now.setFullYear(now.getFullYear() + 1))
        : new Date(now.setMonth(now.getMonth() + 1));

    // ✅ 5. Upsert plan safely
    await prisma.userPlan.upsert({
      where: { userId: user.id },
      update: { plan: newPlan, expiresAt },
      create: { userId: user.id, plan: newPlan, expiresAt },
    });

    console.log(`✅ ${customer_email} upgraded to ${newPlan} (${duration})`);

    // ✅ 6. Respond 200 OK (NOWPayments requires 200 to confirm IPN)
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("🔥 NOWPayments IPN Error:", err);
    return NextResponse.json(
      { error: "Server error processing IPN" },
      { status: 500 }
    );
  }
}
