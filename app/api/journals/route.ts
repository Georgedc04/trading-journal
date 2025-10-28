import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

/* -------------------- Helper: Log Security Events -------------------- */
async function recordSecurityLog(user: string, action: string, ip?: string) {
  try {
    await prisma.securityLog.create({
      data: {
        user,
        action,
        ip: ip || "Unknown",
      },
    });
  } catch (err) {
    console.error("⚠️ Failed to record security log:", err);
  }
}

/* -------------------- GET: Fetch all journals -------------------- */
export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const journals = await prisma.journalAccount.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        createdAt: true,
        _count: { select: { trades: true } },
      },
      orderBy: { createdAt: "asc" },
    });

    // 🧠 Log the action
    const ip = req.headers.get("x-forwarded-for") || "Unknown";
    await recordSecurityLog(userId, "Viewed all journals", ip);

    return NextResponse.json(
      journals.map((j) => ({
        id: j.id,
        name: j.name,
        createdAt: j.createdAt,
        tradeCount: j._count.trades,
      })),
      { status: 200 }
    );
  } catch (err: any) {
    console.error("🔥 Error fetching journals:", err);
    return NextResponse.json(
      { error: err.message || "Server error while fetching journals" },
      { status: 500 }
    );
  }
}

/* -------------------- POST: Create a new journal -------------------- */
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name } = await req.json();
    if (!name || name.trim() === "")
      return NextResponse.json(
        { error: "Journal name is required" },
        { status: 400 }
      );

    // ✅ Ensure user exists
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: { id: userId },
    });

    // ✅ Ensure plan exists (if missing, default to FREE)
    let userPlan = await prisma.userPlan.findUnique({ where: { userId } });
    if (!userPlan) {
      userPlan = await prisma.userPlan.create({
        data: { userId, plan: "FREE" },
      });
    }

    // ✅ Apply plan restrictions
    const journalCount = await prisma.journalAccount.count({ where: { userId } });

    if (userPlan.plan === "FREE" && journalCount >= 1) {
      return NextResponse.json(
        { error: "Free plan allows only 1 journal. Upgrade to create more." },
        { status: 403 }
      );
    }

    if (userPlan.plan === "NORMAL" && journalCount >= 1) {
      return NextResponse.json(
        { error: "Normal plan allows only 1 journal. Upgrade to Pro for unlimited." },
        { status: 403 }
      );
    }

    // ✅ Prevent duplicate names
    const existing = await prisma.journalAccount.findFirst({
      where: { userId, name: name.trim() },
    });
    if (existing)
      return NextResponse.json(
        { error: "A journal with this name already exists." },
        { status: 409 }
      );

    // ✅ Create new journal
    const journal = await prisma.journalAccount.create({
      data: { name: name.trim(), userId },
      select: { id: true, name: true, createdAt: true },
    });

    // 🧠 Log creation
    const ip = req.headers.get("x-forwarded-for") || "Unknown";
    await recordSecurityLog(userId, `Created journal "${name}"`, ip);

    return NextResponse.json({ success: true, journal }, { status: 201 });
  } catch (err: any) {
    console.error("🔥 Error creating journal:", err);
    return NextResponse.json(
      { error: err.message || "Server error while creating journal" },
      { status: 500 }
    );
  }
}
