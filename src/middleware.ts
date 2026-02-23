import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // 保護するルート
  const protectedPaths = ["/dashboard", "/resign"];
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (isProtected && !req.auth) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ログイン済みユーザーが認証ページにアクセスしたらダッシュボードへ
  const authPaths = ["/login", "/register"];
  if (authPaths.includes(pathname) && req.auth) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
