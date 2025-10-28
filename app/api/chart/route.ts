import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/* -------------------- 🟢 GET: Load chart -------------------- */
export async function GET(req: Request) {
  const user = await currentUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const journalId = searchParams.get("journalId");
    if (!journalId)
      return NextResponse.json({ error: "Missing journalId" }, { status: 400 });

    const journal = await prisma.journalAccount.findFirst({
      where: { id: Number(journalId), userId: user.id },
    });
    if (!journal)
      return NextResponse.json(
        { error: "Journal not found or unauthorized" },
        { status: 403 }
      );

    const chart = await prisma.chart.findFirst({
      where: { journalId: Number(journalId) },
    });

    return NextResponse.json({ chart });
  } catch (err) {
    console.error("🔥 Load failed:", err);
    return NextResponse.json({ error: "Failed to load chart" }, { status: 500 });
  }
}

/* -------------------- 🟡 POST: Save or Update chart -------------------- */
export async function POST(req: Request) {
  const user = await currentUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { journalId, chartData } = body;

  if (!journalId)
    return NextResponse.json({ error: "Missing journalId" }, { status: 400 });

  try {
    const journal = await prisma.journalAccount.findFirst({
      where: { id: Number(journalId), userId: user.id },
    });

    if (!journal)
      return NextResponse.json(
        { error: "Journal not found or unauthorized" },
        { status: 403 }
      );

    // ✅ Manual check instead of upsert
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
        data: {
          journalId: Number(journalId),
          data: chartData,
        },
      });
    }

    return NextResponse.json({ success: true, chart: saved });
  } catch (err) {
    console.error("🔥 Chart save failed:", err);
    return NextResponse.json(
      { error: "Failed to save chart" },
      { status: 500 }
    );
  }
}