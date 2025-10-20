import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

// ✅ UPDATE (PUT) — Rename Journal
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // ✅ Await params properly
    const { id } = await context.params;
    const journalId = Number(id);

    const { name } = await req.json();
    if (!name?.trim())
      return NextResponse.json(
        { error: "Journal name required" },
        { status: 400 }
      );

    // ✅ Check journal ownership
    const existing = await prisma.journalAccount.findFirst({
      where: { id: journalId, userId },
    });
    if (!existing)
      return NextResponse.json({ error: "Journal not found" }, { status: 404 });

    // ✅ Update journal name
    const updated = await prisma.journalAccount.update({
      where: { id: journalId },
      data: { name: name.trim() },
    });

    return NextResponse.json({ journal: updated }, { status: 200 });
  } catch (err: any) {
    console.error("🔥 PUT /api/journals/[id]", err);
    return NextResponse.json(
      { error: "Failed to update journal" },
      { status: 500 }
    );
  }
}

// ✅ DELETE — Delete Journal
export async function DELETE(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // ✅ Await params properly
    const { id } = await context.params;
    const journalId = Number(id);

    const journal = await prisma.journalAccount.findFirst({
      where: { id: journalId, userId },
    });

    if (!journal)
      return NextResponse.json({ error: "Journal not found" }, { status: 404 });

    await prisma.trade.deleteMany({ where: { journalId } });
    await prisma.journalAccount.delete({ where: { id: journalId } });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    console.error("🔥 DELETE /api/journals/[id]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
