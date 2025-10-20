import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// ✅ Define protected routes (dashboard + all API endpoints)
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/api/trades(.*)",
  "/api/journals(.*)",
  "/api/charts(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // 🔒 If route requires auth but user not logged in
  if (isProtectedRoute(req) && !userId) {
    const isApi = req.nextUrl.pathname.startsWith("/api/");

    // ✅ For API requests — respond with JSON
    if (isApi) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // ✅ For UI routes — redirect to Clerk sign-in
    const signInUrl = new URL("/signin", req.url);
    signInUrl.searchParams.set("redirect_url", req.url);
    return Response.redirect(signInUrl);
  }
});

// ✅ Apply to everything except static assets
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
