// filepath: c:\Users\Launchpad2\Downloads\gym-app-demonstration\gym-app-demonstration\middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public routes
  if (pathname.startsWith("/login") || pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // The root page will redirect, so we can protect everything else
  const protectedPrefixes = ["/dashboard", "/workout", "/analytics", "/ai"];
  const isProtected = protectedPrefixes.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const authed = req.cookies.get(SESSION_COOKIE)?.value === "1";
  if (authed) return NextResponse.next();

  // Redirect to login if not authenticated
  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  // Run middleware on all paths except for static assets and internal Next.js paths
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};