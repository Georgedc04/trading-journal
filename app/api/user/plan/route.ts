import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Ensure the user record exists
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: { id: userId },
    });

    // ✅ Fetch user plan or create a FREE one if missing
    let userPlan = await prisma.userPlan.findUnique({ where: { userId } });
    if (!userPlan) {
      userPlan = await prisma.userPlan.create({
        data: { userId, plan: "FREE", expiresAt: null },
      });
    }

    // ✅ Auto-downgrade expired plans
    const now = new Date();
    if (userPlan.expiresAt && userPlan.expiresAt < now) {
      userPlan = await prisma.userPlan.update({
        where: { userId },
        data: { plan: "FREE", expiresAt: null },
      });
    }

    // ✅ Return clean response
    return NextResponse.json({
      plan: userPlan.plan,
      expiresAt: userPlan.expiresAt,
      message:
        userPlan.plan === "FREE"
          ? "Using free plan"
          : `Active ${userPlan.plan} plan`,
    });
  } catch (error) {
    console.error("🔥 Error fetching user plan:", error);
    return NextResponse.json(
      { error: "Failed to fetch user plan" },
      { status: 500 }
    );
  }
}
