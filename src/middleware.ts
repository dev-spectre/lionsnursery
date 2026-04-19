import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLogin = req.nextUrl.pathname === "/admin/login";
  if (!req.auth && !isLogin) {
    return NextResponse.redirect(new URL("/admin/login", req.nextUrl.origin));
  }
  if (req.auth && isLogin) {
    return NextResponse.redirect(
      new URL("/admin/dashboard", req.nextUrl.origin),
    );
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
