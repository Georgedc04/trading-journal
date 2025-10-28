import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ✅ Ensure user exists in DB
  const existing = await prisma.user.findUnique({ where: { id: userId } });

  if (!existing) {
    await prisma.user.create({
      data: { id: userId, role: "USER" },
    });
  }

  // ✅ Create free plan if not exists
  const plan = await prisma.userPlan.upsert({
    where: { userId },
    update: {},
    create: {
      userId,
      plan: "FREE",
    },
  });

  return NextResponse.json({ message: "User setup complete", plan });
}
