// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const { pathname } = request.nextUrl;

  // Redirect to /login if accessing protected routes without a token.
  const protectedPaths = ["/dashboard", "/my-transactions"];
  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // If at the root route, redirect based on the session status.
  if (pathname === "/") {
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } else {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // If a user is already logged in and trying to access /login, redirect them.
  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Allow the request to proceed for all other cases.
  return NextResponse.next();
}

// Specify the routes the middleware should run on.
export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/my-transactions/:path*",
    "/login",
    "/api/:path*",
  ],
};
