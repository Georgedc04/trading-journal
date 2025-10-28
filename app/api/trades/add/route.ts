import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await req.json();
    const {
      date,
      direction,
      quality,
      pair,
      reason,
      type,
      amount,
      session,
      beforeImageUrl,
      afterImageUrl,
      journalId,
    } = data;

    // ✅ 1. Validate inputs
    if (
      !date ||
      !direction ||
      !quality ||
      !pair ||
      !reason ||
      !type ||
      amount == null ||
      !journalId
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ 2. Convert and verify journal
    const journalIdNum = Number(journalId);
    if (Number.isNaN(journalIdNum))
      return NextResponse.json({ error: "Invalid journalId" }, { status: 400 });

    const journal = await prisma.journalAccount.findFirst({
      where: { id: journalIdNum, userId },
    });
    if (!journal)
      return NextResponse.json(
        { error: "Journal not found or not owned by user" },
        { status: 403 }
      );

    const numericAmount = Number(amount);
    if (Number.isNaN(numericAmount))
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });

    const result =
      type === "loss" ? -Math.abs(numericAmount) : Math.abs(numericAmount);

    // ✅ 3. Ensure user + plan exist
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: { id: userId },
    });

    let userPlan = await prisma.userPlan.findUnique({ where: { userId } });
    if (!userPlan) {
      userPlan = await prisma.userPlan.create({
        data: { userId, plan: "FREE" },
      });
    }

    // ✅ 4. Enforce plan limits
    if (userPlan.plan === "FREE") {
      const totalTrades = await prisma.trade.count({
        where: { journal: { userId } },
      });

      if (totalTrades >= 10) {
        return NextResponse.json(
          {
            error:
              "Free plan limit reached (10 trades). Upgrade to add more trades.",
          },
          { status: 403 }
        );
      }
    }

    // ✅ 5. Validate images (Base64 or URL)
    const validBase64 = (val?: string | null) => {
      if (!val || val.trim() === "") return null;
      if (val.startsWith("data:image") || val.startsWith("http")) return val;
      return null;
    };

    // ✅ 6. Create trade
    const trade = await prisma.trade.create({
      data: {
        journalId: journalIdNum,
        date: new Date(date),
        direction,
        quality,
        pair,
        reason,
        session: session || null,
        result,
        beforeImageUrl: validBase64(beforeImageUrl),
        afterImageUrl: validBase64(afterImageUrl),
      },
      select: {
        id: true,
        date: true,
        pair: true,
        direction: true,
        quality: true,
        result: true,
        reason: true,
        session: true,
        beforeImageUrl: true,
        afterImageUrl: true,
      },
    });

    return NextResponse.json(trade, { status: 201 });
  } catch (err: any) {
    console.error("🔥 Error adding trade:", err);
    return NextResponse.json(
      { error: err?.message || "Server error while adding trade" },
      { status: 500 }
    );
  }
}
