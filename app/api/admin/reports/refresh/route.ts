export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

// In-memory cache (auto-clears when the server restarts)
let cachedReport: any = null;
let lastUpdated: number = 0;
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

export async function GET() {
  try {
    // ✅ 1. Admin authentication
    const admin = await currentUser();
    if (!admin)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const email = admin.emailAddresses?.[0]?.emailAddress || "";
    const role = admin.publicMetadata?.role;
    if (email !== "gkasmiro@gmail.com" && role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // ✅ 2. Use cached report if still valid
    const now = Date.now();
    if (cachedReport && now - lastUpdated < CACHE_TTL) {
      return NextResponse.json({
        ...cachedReport,
        cached: true,
        lastUpdated: new Date(lastUpdated).toLocaleString(),
      });
    }

    // ✅ 3. Generate fresh report
    const totalUsers = await prisma.user.count();
    const totalJournals = await prisma.journalAccount.count();

    // 🧠 Safe fallback if Prisma type misses updatedAt
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    let activeToday = 0;

    try {
      activeToday = await prisma.journalAccount.count({
        where: {
          OR: [
            { updatedAt: { not: null, gte: since } }, // normal path
            { createdAt: { gte: since } }, // fallback if updatedAt missing
          ],
        },
      });
    } catch {
      // fallback for Vercel or schema mismatch
      activeToday = await prisma.journalAccount.count({
        where: { createdAt: { gte: since } },
      });
    }

    const recentTrades = await prisma.trade.findMany({
      orderBy: { createdAt: "desc" },
      take: 25,
      include: {
        journal: {
          include: { user: true },
        },
      },
    });

    const logs = recentTrades.map((t) => ({
      time: new Date(t.createdAt).toLocaleString(),
      user: t.journal.user?.email || "Unknown",
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
    console.error("Reports Refresh API error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
