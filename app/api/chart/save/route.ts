import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { layout, journalId } = await req.json();

    if (!layout || !journalId)
      return NextResponse.json({ error: "Missing layout or journalId" }, { status: 400 });

    // ✅ Ensure the journal belongs to the user
    const journal = await prisma.journalAccount.findFirst({
      where: { id: Number(journalId), userId },
    });

    if (!journal)
      return NextResponse.json(
        { error: "Journal not found or unauthorized" },
        { status: 403 }
      );

    // ✅ Upsert chart per journal
    const result = await prisma.chart.upsert({
      where: { journalId: Number(journalId) },
      update: { data: layout },
      create: { journalId: Number(journalId), data: layout },
    });

    return NextResponse.json({ success: true, chart: result });
  } catch (err: any) {
    console.error("🔥 Chart save error:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
