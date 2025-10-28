// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

/* ------------------ 🔒 ROUTE MATCHERS ------------------ */
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/performance(.*)",
  "/api/trades(.*)",
  "/api/journals(.*)",
  "/api/charts(.*)",
]);

const isAdminRoute = createRouteMatcher([
  "/admin(.*)",
  "/api/admin(.*)", // secure admin API routes too
]);

/* ------------------ 🔐 MIDDLEWARE ------------------ */
export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // 🧱 1️⃣ Require Sign-In for protected routes
  if ((isProtectedRoute(req) || isAdminRoute(req)) && !userId) {
    const isApi = req.nextUrl.pathname.startsWith("/api/");
    if (isApi) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const signInUrl = new URL("/signin", req.url);
    signInUrl.searchParams.set("redirect_url", req.url);
    return NextResponse.redirect(signInUrl);
  }

  // 🧱 2️⃣ Admin check (for /admin and /api/admin)
  if (isAdminRoute(req)) {
    const user = await (await clerkClient()).users.getUser(userId!);
    const email = user.emailAddresses?.[0]?.emailAddress || "";
    const role = user.publicMetadata?.role;

    // ❌ Not an admin → block access
    if (email !== "gkasmiro@gmail.com" && role !== "ADMIN") {
      const isApi = req.nextUrl.pathname.startsWith("/api/");
      if (isApi) {
        return new NextResponse(JSON.stringify({ error: "Forbidden" }), {
          status: 403,
          headers: { "Content-Type": "application/json" },
        });
      }

      // For UI routes — show 403 page or redirect
      return NextResponse.redirect(new URL("/403", req.url)); // you can create a 403 page
    }
  }

  // ✅ Allow access to valid users
  return NextResponse.next();
});

/* ------------------ ⚙️ CONFIG ------------------ */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sign-in|sign-up|how-to-use).*)",
  ],
};
