import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Ensure the user exists
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: { id: userId },
    });

    // Find user's current plan
    let userPlan = await prisma.userPlan.findUnique({
      where: { userId },
      select: { id: true, plan: true, expiresAt: true },
    });

    const now = new Date();

    // Auto downgrade expired plans
    if (userPlan?.expiresAt && userPlan.expiresAt < now) {
      userPlan = await prisma.userPlan.update({
        where: { userId },
        data: { plan: "FREE", expiresAt: null },
        select: { id: true, plan: true, expiresAt: true },
      });
    }

    // If user has no plan entry, create FREE by default
    if (!userPlan) {
      userPlan = await prisma.userPlan.create({
        data: { userId, plan: "FREE" },
        select: { id: true, plan: true, expiresAt: true },
      });
    }

    return NextResponse.json(
      { plan: userPlan.plan, expiresAt: userPlan.expiresAt },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("🔥 Error fetching user plan:", err);
    return NextResponse.json(
      { error: "Failed to fetch user plan" },
      { status: 500 }
    );
  }
}
