import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

/* -------------------- ⚡ CONFIG -------------------- */
export const revalidate = 0; // no cache
export const dynamic = "force-dynamic";

/* -------------------- 🟢 GET: Fetch Trades for a Journal -------------------- */
export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const journalId = searchParams.get("journalId");

    if (!journalId)
      return NextResponse.json({ error: "Missing journalId" }, { status: 400 });

    // ✅ Ensure journal belongs to this user
    const journal = await prisma.journalAccount.findFirst({
      where: { id: Number(journalId), userId },
      select: { id: true },
    });

    if (!journal)
      return NextResponse.json({ error: "Journal not found" }, { status: 403 });

    // ✅ Fetch trades — all necessary fields
    const trades = await prisma.trade.findMany({
      where: { journalId: Number(journalId) },
      orderBy: { date: "asc" },
      select: {
        id: true,
        date: true,
        pair: true,
        direction: true,
        session: true,
        result: true,
        quality: true,
        reason: true,
        beforeImageUrl: true,
        afterImageUrl: true,
      },
    });

    console.log(`✅ Trades fetched: ${trades.length} for journal ${journalId}`);

    return NextResponse.json(trades, {
      status: 200,
      headers: {
        // 🚀 always fetch fresh, no stale data
        "Cache-Control": "no-store",
      },
    });
  } catch (err: any) {
    console.error("🔥 GET /api/trades error:", err);

    if (err.code === "P2024" || err.message?.includes("Response from the Engine")) {
      return NextResponse.json(
        { error: "Database temporarily unreachable. Please retry." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Server error while fetching trades" },
      { status: 500 }
    );
  }
}

/* -------------------- 🟡 PUT: Update Trade -------------------- */
export async function PUT(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await req.json();
    const {
      id,
      date,
      direction,
      quality,
      pair,
      reason,
      session,
      result,
      beforeImageUrl,
      afterImageUrl,
    } = data;

    if (!id)
      return NextResponse.json({ error: "Missing trade ID" }, { status: 400 });

    // ✅ Find trade with its journal relation
    const trade = await prisma.trade.findFirst({
      where: { id: Number(id) },
      include: { journal: true },
    });

    if (!trade || trade.journal.userId !== userId)
      return NextResponse.json(
        { error: "Trade not found or unauthorized" },
        { status: 404 }
      );

    const numericResult = Number(result);
    if (Number.isNaN(numericResult))
      return NextResponse.json(
        { error: "Invalid result value" },
        { status: 400 }
      );

    const validImage = (val?: string | null) =>
      val && (val.startsWith("data:image") || val.startsWith("http"))
        ? val
        : null;

    const updatedTrade = await prisma.trade.update({
      where: { id: Number(id) },
      data: {
        date: date ? new Date(date) : trade.date,
        direction: direction ?? trade.direction,
        quality: quality ?? trade.quality,
        pair: pair ?? trade.pair,
        reason: reason ?? trade.reason,
        session: session ?? trade.session,
        result: numericResult,
        beforeImageUrl: validImage(beforeImageUrl) ?? trade.beforeImageUrl,
        afterImageUrl: validImage(afterImageUrl) ?? trade.afterImageUrl,
      },
    });

    return NextResponse.json({ success: true, trade: updatedTrade }, { status: 200 });
  } catch (err: any) {
    console.error("🔥 PUT /api/trades error:", err);
    return NextResponse.json(
      { error: err.message || "Server error while updating trade" },
      { status: 500 }
    );
  }
}
