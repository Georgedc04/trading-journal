import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

/* -------------------- 🟢 GET — Fetch all security logs -------------------- */
export async function GET() {
  try {
    const user = await currentUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const email = user.emailAddresses?.[0]?.emailAddress;
    const role = user.publicMetadata?.role;

    // ✅ Only admin can access
    if (email !== "gkasmiro@gmail.com" && role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // ✅ Fetch recent 100 logs (you can change limit)
    const logs = await prisma.securityLog.findMany({
      orderBy: { time: "desc" },
      take: 100,
    });

    return NextResponse.json({ logs });
  } catch (err: any) {
    console.error("🔥 Security logs fetch error:", err);
    return NextResponse.json(
      { error: "Failed to fetch security logs" },
      { status: 500 }
    );
  }
}

/* -------------------- 🟡 POST — Create new security log -------------------- */
export async function POST(req: Request) {
  try {
    const { user, action, ip } = await req.json();

    if (!user || !action)
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );

    await prisma.securityLog.create({
      data: { user, action, ip: ip || "Unknown" },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err: any) {
    console.error("🔥 Failed to create log:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/* -------------------- 🗑️ DELETE — Clear all logs -------------------- */
export async function DELETE() {
  try {
    const admin = await currentUser();
    if (!admin)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const email = admin.emailAddresses?.[0]?.emailAddress || "";
    const role = admin.publicMetadata?.role;

    // ✅ Only admin can delete logs
    if (email !== "gkasmiro@gmail.com" && role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // ✅ Delete all logs from DB
    await prisma.securityLog.deleteMany();

    // ✅ Optionally log this delete action
    await prisma.securityLog.create({
      data: {
        user: email,
        action: "Cleared all security logs",
        ip: "System",
      },
    });

    return NextResponse.json({ success: true, message: "All logs cleared." });
  } catch (err: any) {
    console.error("🔥 Failed to clear logs:", err);
    return NextResponse.json(
      { error: "Server error while deleting logs" },
      { status: 500 }
    );
  }
}
