import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

export async function PUT(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    let data: any = {}
    const contentType = req.headers.get("content-type") || ""

    // ✅ Handle JSON or multipart/form-data
    if (contentType.includes("application/json")) {
      data = await req.json()
    } else if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData()
      data = Object.fromEntries(formData.entries())
    } else {
      return NextResponse.json({ error: "Unsupported Content-Type" }, { status: 400 })
    }

    const {
      id,
      date,
      direction,
      quality,
      pair,
      reason,
      type,
      amount,
      session,
      beforeImageUrl,
      afterImageUrl,
    } = data

    // ✅ Validate required fields
    if (!id || !date || !direction || !pair || !reason || !type || amount == null) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const numericAmount = Number(amount)
    if (Number.isNaN(numericAmount)) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    const result = type === "loss" ? -Math.abs(numericAmount) : Math.abs(numericAmount)

    // ✅ Fetch the trade and verify ownership
    const trade = await prisma.trade.findFirst({
      where: { id: Number(id) },
      include: { journal: true },
    })

    if (!trade || trade.journal.userId !== userId) {
      return NextResponse.json({ error: "Trade not found or unauthorized" }, { status: 404 })
    }

    // ✅ Update the trade
    const updatedTrade = await prisma.trade.update({
      where: { id: Number(id) },
      data: {
        date: new Date(date),
        direction,
        quality,
        pair,
        reason,
        result,
        session: session || null,
        beforeImageUrl: beforeImageUrl || null,
        afterImageUrl: afterImageUrl || null,
      },
    })

    return NextResponse.json({ success: true, trade: updatedTrade })
  } catch (err: any) {
    console.error("🔥 Update trade error:", err.message || err)
    return NextResponse.json(
      { error: err.message || "Server error while updating trade" },
      { status: 500 }
    )
  }
}
