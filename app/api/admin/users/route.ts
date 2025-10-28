export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import Clerk from "@clerk/clerk-sdk-node";

/* -------------------- 🧠 Helper: Log Security Events -------------------- */
async function logSecurity(action: string, user: string, req?: Request) {
  try {
    await fetch(
      `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/api/admin/security`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user,
          action,
          ip: req?.headers.get("x-forwarded-for") || "Unknown",
        }),
      }
    );
  } catch (err) {
    console.error("⚠️ Failed to log security event:", err);
  }
}

/* -------------------- 🧍 ADMIN USERS API -------------------- */
export async function GET(req: Request) {
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

    // ✅ Fetch all Clerk users
    const clerkUsers = await Clerk.users.getUserList({ limit: 100 });

    // ✅ Process user list
    const users = clerkUsers.map((u) => {
      const lastSignIn = u.lastSignInAt ? new Date(u.lastSignInAt) : null;
      const createdAt = new Date(u.createdAt);
      const now = new Date();
      let status = "⚪ New";

      if (lastSignIn) {
        const diffDays = Math.floor(
          (now.getTime() - lastSignIn.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (diffDays <= 30) status = "🟢 Active";
        else if (diffDays <= 60) status = "🟡 Idle";
        else status = "🔴 Inactive";
      }

      return {
        id: u.id,
        email: u.emailAddresses?.[0]?.emailAddress || "—",
        name: `${u.firstName || ""} ${u.lastName || ""}`.trim() || "—",
        role: u.publicMetadata?.role || "USER",
        verified: u.emailAddresses?.[0]?.verification?.status === "verified",
        status,
        lastActive: lastSignIn ? lastSignIn.toLocaleDateString() : "Never",
        createdAt: createdAt.toLocaleDateString(),
      };
    });

    // ✅ Log security event
    await logSecurity("Viewed all users", email, req);

    return NextResponse.json({ users });
  } catch (err: any) {
    console.error("🔥 Admin API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/* -------------------- 🗑️ DELETE — Remove User -------------------- */
export async function DELETE(req: Request) {
  try {
    const admin = await currentUser();
    if (!admin)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const email = admin.emailAddresses?.[0]?.emailAddress || "";
    const role = admin.publicMetadata?.role;

    if (email !== "gkasmiro@gmail.com" && role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { email: targetEmail } = await req.json();
    if (!targetEmail)
      return NextResponse.json({ error: "Missing target email" }, { status: 400 });

    // ✅ Find user by email
    const list = await Clerk.users.getUserList({ emailAddress: [targetEmail] });
    const user = list?.[0];
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    // ✅ Delete user from Clerk
    await Clerk.users.deleteUser(user.id);

    // ✅ Log security event
    await logSecurity(`Deleted user: ${targetEmail}`, email, req);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("🔥 Delete user error:", err);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}

/* -------------------- 👑 PUT — Promote User to Admin -------------------- */
export async function PUT(req: Request) {
  try {
    const admin = await currentUser();
    if (!admin)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const email = admin.emailAddresses?.[0]?.emailAddress || "";
    const role = admin.publicMetadata?.role;

    if (email !== "gkasmiro@gmail.com" && role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { email: targetEmail, role: newRole } = await req.json();
    if (!targetEmail || !newRole)
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });

    // ✅ Find target user
    const list = await Clerk.users.getUserList({ emailAddress: [targetEmail] });
    const user = list?.[0];
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    // ✅ Update Clerk metadata
    await Clerk.users.updateUserMetadata(user.id, {
      publicMetadata: { role: newRole },
    });

    // ✅ Log action
    await logSecurity(`Promoted user to ${newRole}: ${targetEmail}`, email, req);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("🔥 Promote user error:", err);
    return NextResponse.json({ error: "Failed to update user role" }, { status: 500 });
  }
}
