import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Better Auth cookies
  const token =
    req.cookies.get("better-auth.session_token")?.value ||
    req.cookies.get("__Secure-better-auth.session_token")?.value;

  // Protected routes
  const protectedRoutes = ["/post-a-job", "/employers/dashboard"];

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // Redirect if not logged in
  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/post-a-job/:path*", "/employers/dashboard/:path*"],
};
