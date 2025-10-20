import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

/* -------------------- GET: Fetch all journals -------------------- */
export async function GET() {
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

    // ✅ Ensure user exists in DB
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: { id: userId },
    });

    // ✅ Prevent duplicate journals
    const existing = await prisma.journalAccount.findFirst({
      where: { userId, name },
    });
    if (existing)
      return NextResponse.json(
        { error: "A journal with this name already exists" },
        { status: 409 }
      );

    const journal = await prisma.journalAccount.create({
      data: { name: name.trim(), userId },
      select: { id: true, name: true, createdAt: true },
    });

    return NextResponse.json({ success: true, journal }, { status: 201 });
  } catch (err: any) {
    console.error("🔥 Error creating journal:", err);
    return NextResponse.json(
      { error: err.message || "Server error while creating journal" },
      { status: 500 }
    );
  }
}
