import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

export async function DELETE(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { id } = await req.json()
    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: "Invalid or missing trade ID" }, { status: 400 })
    }

    // ✅ Find trade and check ownership
    const trade = await prisma.trade.findFirst({
      where: { id: Number(id) },
      include: { journal: true },
    })

    if (!trade || trade.journal.userId !== userId) {
      return NextResponse.json({ error: "Trade not found or unauthorized" }, { status: 404 })
    }

    // ✅ Delete trade
    await prisma.trade.delete({
      where: { id: Number(id) },
    })

    return NextResponse.json(
      { success: true, message: "Trade deleted successfully" },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("🔥 Delete trade error:", error)
    return NextResponse.json(
      { error: error?.message || "Server error while deleting trade" },
      { status: 500 }
    )
  }
}
