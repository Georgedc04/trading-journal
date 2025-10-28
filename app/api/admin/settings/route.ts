import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

/* -------------------- GET — Fetch current admin settings -------------------- */
export async function GET() {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const email = user.emailAddresses?.[0]?.emailAddress;
    const role = user.publicMetadata?.role;

    // ✅ Only admin can access
    if (email !== "gkasmiro@gmail.com" && role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // ✅ Fetch or create settings record
    const settings =
      (await prisma.adminSetting.findFirst()) ||
      (await prisma.adminSetting.create({ data: {} }));

    return NextResponse.json({
      supportEmail: settings.supportEmail,
      maintenance: settings.maintenance,
    });
  } catch (err: any) {
    console.error("🔥 GET /api/admin/settings error:", err);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

/* -------------------- POST — Update admin settings -------------------- */
export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const email = user.emailAddresses?.[0]?.emailAddress;
    const role = user.publicMetadata?.role;

    // ✅ Only admin can update
    if (email !== "gkasmiro@gmail.com" && role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { supportEmail, maintenance } = await req.json();

    const updated = await prisma.adminSetting.upsert({
      where: { id: 1 },
      update: { supportEmail, maintenance },
      create: { supportEmail, maintenance },
    });

    return NextResponse.json({ success: true, updated });
  } catch (err: any) {
    console.error("🔥 POST /api/admin/settings error:", err);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
