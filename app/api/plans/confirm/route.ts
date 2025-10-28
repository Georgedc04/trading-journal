import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Confirm plan upgrade after NOWPayments success redirect.
 * Example redirect: /api/plans/confirm?plan=NORMAL&email=user@email.com
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const planParam = searchParams.get("plan");
    const email = searchParams.get("email");

    // 🧩 Validate
    if (!planParam || !email) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=missing_data`
      );
    }

    // 🧠 Normalize plan (ensure uppercase for Prisma enum)
    const plan = planParam.toUpperCase() as "FREE" | "NORMAL" | "PRO";
    if (!["FREE", "NORMAL", "PRO"].includes(plan)) {
      console.error("Invalid plan value received:", planParam);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=invalid_plan`
      );
    }

    // 🔍 Find user by email
    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) {
      console.error("User not found for email:", email);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=user_not_found`
      );
    }

    // 📆 Set expiry (1 month)
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1);

    // 💾 Save or update plan
    await prisma.userPlan.upsert({
      where: { userId: user.id },
      update: { plan, expiresAt },
      create: { userId: user.id, plan, expiresAt },
    });

    console.log(`✅ Upgraded ${email} to ${plan} plan`);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=plan_upgraded`
    );
  } catch (err) {
    console.error("💥 Confirm plan error:", err);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=server`
    );
  }
}
