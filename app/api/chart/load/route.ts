import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const user = await currentUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    // ✅ Get journalId from query string
    const { searchParams } = new URL(req.url);
    const journalId = searchParams.get("journalId");

    if (!journalId)
      return NextResponse.json({ error: "Missing journalId" }, { status: 400 });

    // ✅ Check journal ownership
    const journal = await prisma.journalAccount.findFirst({
      where: { id: Number(journalId), userId: user.id },
    });

    if (!journal)
      return NextResponse.json(
        { error: "Journal not found or unauthorized" },
        { status: 403 }
      );

    // ✅ Fetch chart linked to this journal
    const chart = await prisma.chart.findUnique({
      where: { journalId: Number(journalId) },
    });

    return NextResponse.json({ chart });
  } catch (err) {
    console.error("🔥 Load failed:", err);
    return NextResponse.json(
      { error: "Failed to load chart" },
      { status: 500 }
    );
  }
}
