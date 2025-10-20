import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { journalId, chartData } = body;

  if (!journalId)
    return NextResponse.json({ error: "Missing journalId" }, { status: 400 });

  try {
    // ✅ Ensure journal belongs to this user
    const journal = await prisma.journalAccount.findFirst({
      where: { id: Number(journalId), userId: user.id },
    });

    if (!journal)
      return NextResponse.json(
        { error: "Journal not found or unauthorized" },
        { status: 403 }
      );

    // ✅ Each journal has exactly one chart (enforced in schema with @unique)
    const saved = await prisma.chart.upsert({
      where: { journalId: Number(journalId) },
      update: { data: chartData },
      create: { journalId: Number(journalId), data: chartData },
    });

    return NextResponse.json({ success: true, chart: saved });
  } catch (err) {
    console.error("🔥 Chart save failed:", err);
    return NextResponse.json(
      { error: "Failed to save chart" },
      { status: 500 }
    );
  }
}
