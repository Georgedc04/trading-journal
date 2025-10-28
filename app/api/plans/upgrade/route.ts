import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { plan, duration } = await req.json();
    if (!plan || !["FREE", "NORMAL", "PRO"].includes(plan))
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });

    // ✅ Ensure user exists first
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: { id: userId },
    });

    // Calculate expiry date
    const now = new Date();
    const expiresAt =
      plan === "FREE"
        ? null
        : duration === "year"
        ? new Date(now.setFullYear(now.getFullYear() + 1))
        : new Date(now.setMonth(now.getMonth() + 1));

    // ✅ Create or update user plan
    const userPlan = await prisma.userPlan.upsert({
      where: { userId },
      update: { plan, expiresAt },
      create: { userId, plan, expiresAt },
    });

    return NextResponse.json({
      success: true,
      message: `Plan upgraded to ${plan}`,
      userPlan,
    });
  } catch (err: any) {
    console.error("🔥 Plan upgrade error:", err);
    return NextResponse.json(
      { error: err.message || "Server error while upgrading plan" },
      { status: 500 }
    );
  }
}
