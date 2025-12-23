import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { paths } from "./lib/paths";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Add security headers to all responses
  const response = NextResponse.next();

  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  const authToken = request.cookies.get("auth-token");
  const tenantAuthToken = request.cookies.get("tenant-auth-token");

  // Redirect logged-in users away from login pages
  if (pathname === paths.admin.login && authToken) {
    const url = new URL(paths.admin.dashboard, request.url);
    return NextResponse.redirect(url);
  }

  if (pathname === paths.tenant.login && tenantAuthToken) {
    const url = new URL(paths.tenant.dashboard, request.url);
    return NextResponse.redirect(url);
  }

  // Protect admin routes - redirect to login if not authenticated
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
    // If trying to access admin/dashboard without auth, redirect to login
    if (!authToken && pathname !== paths.admin.login) {
      const url = new URL(paths.admin.login, request.url);
      return NextResponse.redirect(url);
    }
  }

  // Protect tenant routes - redirect to tenant login if not authenticated
  if (
    pathname.startsWith("/tenant") &&
    !pathname.startsWith(paths.tenant.login)
  ) {
    // If trying to access tenant area without auth, redirect to tenant login
    if (!tenantAuthToken) {
      const url = new URL(paths.tenant.login, request.url);
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
