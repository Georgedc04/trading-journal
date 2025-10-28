export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

let cachedReport: any = null;
let lastUpdated = 0;
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

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

    // ✅ 2. Cache check
    const now = Date.now();
    if (cachedReport && now - lastUpdated < CACHE_TTL) {
      return NextResponse.json({
        ...cachedReport,
        cached: true,
        lastUpdated: new Date(lastUpdated).toLocaleString(),
      });
    }

    // ✅ 3. Generate report
    const totalUsers = await prisma.user.count();
    const totalJournals = await prisma.journalAccount.count();

    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const activeToday = await prisma.journalAccount.count({
      where: { createdAt: { gte: since } },
    });

    // ✅ Include user with email field (works with your schema)
    const recentTrades = await prisma.trade.findMany({
      orderBy: { createdAt: "desc" },
      take: 25,
      include: {
        journal: {
          include: {
            user: true, // ✅ Full user model, includes email & name
          },
        },
      },
    });

    const logs = recentTrades.map((t) => ({
      time: new Date(t.createdAt).toLocaleString(),
      user: t.journal.user?.email || t.journal.user?.name || "Unknown User",
      action: `Logged a ${t.direction} trade on ${t.pair}`,
      status: Number(t.result) >= 0 ? "Success" : "Loss",
    }));

    cachedReport = {
      totalUsers,
      totalJournals,
      activeToday,
      logs,
      lastUpdated: new Date().toLocaleString(),
    };
    lastUpdated = now;

    return NextResponse.json({ ...cachedReport, cached: false });
  } catch (err: any) {
    console.error("⚠️ Admin report API error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
