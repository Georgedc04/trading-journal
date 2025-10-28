export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const admin = await currentUser();
    if (!admin)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const email = admin.emailAddresses?.[0]?.emailAddress || "";
    const role = admin.publicMetadata?.role;

    // ✅ Only admin can access
    if (email !== "gkasmiro@gmail.com" && role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // ✅ Fetch from correct Prisma models
    const users = await prisma.user.count();
    const journals = await prisma.journalAccount.count();

    // ✅ Clean single-line dev log
    if (process.env.NODE_ENV === "development") {
      console.log(`✅ Admin Summary — Users: ${users}, Journals: ${journals}`);
    }

    return NextResponse.json({ users, journals });
  } catch (err: any) {
    console.error("Admin Summary API error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
