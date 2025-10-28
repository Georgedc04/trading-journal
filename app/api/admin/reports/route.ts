export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma"; // ✅ same import style as your other admin APIs

export async function GET() {
  try {
    // ✅ 1. Verify admin
    const admin = await currentUser();
    if (!admin)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const email = admin.emailAddresses?.[0]?.emailAddress || "";
    const role = admin.publicMetadata?.role;

    if (email !== "gkasmiro@gmail.com" && role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // ✅ 2. Fetch key platform stats
    const totalUsers = await prisma.user.count();
    const totalJournals = await prisma.journalAccount.count();

    // 🕒 Users active in the last 24 hours (recently created/updated journals)
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const activeToday = await prisma.journalAccount.count({
      where: { updatedAt: { gte: since } },
    });

    // ✅ 3. Generate recent trade logs
    const recentTrades = await prisma.trade.findMany({
      orderBy: { createdAt: "desc" },
      take: 25,
      include: {
        journal: {
          include: { user: true },
        },
      },
    });

    const logs = recentTrades.map((trade) => ({
      time: new Date(trade.createdAt).toLocaleString(),
      user: trade.journal.user?.email || "Unknown",
      action: `Logged a ${trade.direction} trade on ${trade.pair}`,
      status:
        Number(trade.result) >= 0 ? "Success" : "Loss",
    }));

    // ✅ 4. Return structured JSON
    const report = {
      totalUsers,
      totalJournals,
      activeToday,
      logs,
    };

    // 👀 Optional: Development log
    if (process.env.NODE_ENV === "development") {
      console.log("✅ Admin Report Generated", report);
    }

    return NextResponse.json(report);
  } catch (err: any) {
    console.error("Admin Reports API error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
