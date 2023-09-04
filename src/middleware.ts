import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  let { pathname } = request.nextUrl;
  
  let env = process.env.NODE_ENV;

  if (env === "production") {
    if (pathname === "/auth/signin" || pathname === "/auth/verify") {
      if (request.cookies.has("__Secure-next-auth.session-token")) {
        return NextResponse.redirect(new URL("/app", request.url));
      } else {
        return NextResponse.next();
      }
    } else {
      if (request.cookies.has("__Secure-next-auth.session-token")) {
        return NextResponse.next();
      } else {
        return NextResponse.redirect(new URL("/auth/signin", request.url));
      }
    }
  } else {
    if (pathname === "/auth/signin" || pathname === "/auth/verify") {
      if (request.cookies.has("next-auth.session-token")) {
        return NextResponse.redirect(new URL("/app", request.url));
      } else {
        return NextResponse.next();
      }
    } else {
      if (request.cookies.has("next-auth.session-token")) {
        return NextResponse.next();
      } else {
        return NextResponse.redirect(new URL("/auth/signin", request.url));
      }
    }
  }
}

export const config = {
  matcher: ["/app/:path*", "/auth/signin", "/auth/verify"],
};
