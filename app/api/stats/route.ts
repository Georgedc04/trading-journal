// ✅ app/api/stats/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Clerk from "@clerk/clerk-sdk-node"; // ✅ Use correct Clerk server SDK import

export async function GET() {
  try {
    // ✅ Get Clerk users safely (limit 100 for now)
    const clerkUsers = await Clerk.users.getUserList({ limit: 100 });
    const totalUsers = clerkUsers.length; // Clerk SDK returns a normal array

    // ✅ Count all trades in your DB
    const totalTrades = await prisma.trade.count();

    return NextResponse.json({
      totalUsers,
      totalTrades,
      updatedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("Stats API error:", err);
    return NextResponse.json(
      { error: "Internal Server Error", message: err.message },
      { status: 500 }
    );
  }
}
