import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const journalId = searchParams.get("journalId");
    const chartData = await req.json();

    if (!journalId)
      return NextResponse.json({ error: "Missing journalId" }, { status: 400 });

    // ✅ Verify user owns this journal
    const journal = await prisma.journalAccount.findFirst({
      where: { id: Number(journalId), userId: user.id },
    });

    if (!journal)
      return NextResponse.json(
        { error: "Journal not found or unauthorized" },
        { status: 403 }
      );

    // ✅ Instead of upsert(), do findFirst + update/create manually
    const existingChart = await prisma.chart.findFirst({
      where: { journalId: Number(journalId) },
    });

    let saved;
    if (existingChart) {
      saved = await prisma.chart.update({
        where: { id: existingChart.id },
        data: { data: chartData },
      });
    } else {
      saved = await prisma.chart.create({
        data: { journalId: Number(journalId), data: chartData },
      });
    }

    return NextResponse.json({ chart: saved });
  } catch (err) {
    console.error("🔥 Save chart error:", err);
    return NextResponse.json(
      { error: "Failed to save chart" },
      { status: 500 }
    );
  }
}
