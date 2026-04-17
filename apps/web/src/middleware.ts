import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "astromath_token";

// Routes that require authentication
const PROTECTED_PREFIXES = ["/", "/room"];
// Routes that are always public
const PUBLIC_PATHS = ["/login", "/auth/callback", "/ranking"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hasToken = req.cookies.has(COOKIE_NAME);

  const isPublic = PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );

  if (isPublic) {
    // Logged-in user visiting /login → send to home
    if (pathname === "/login" && hasToken) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  const isProtected = PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );

  if (isProtected && !hasToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  // Skip _next internals, static files, and API routes
  matcher: ["/((?!_next|api|favicon\\.ico|.*\\..*).*)" ],
};
