import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTokensFromCode } from "@/lib/gmail";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const error = req.nextUrl.searchParams.get("error");

  if (error || !code || !state) {
    return NextResponse.redirect(
      new URL("/resign/method?error=oauth_cancelled", process.env.NEXTAUTH_URL!)
    );
  }

  try {
    const { userId, resignationId } = JSON.parse(
      Buffer.from(state, "base64url").toString()
    );

    const tokens = await getTokensFromCode(code);

    if (!tokens.access_token) {
      throw new Error("アクセストークンが取得できませんでした。");
    }

    await prisma.resignation.update({
      where: { id: resignationId, userId },
      data: { sendMethod: "OAUTH" },
    });

    // トークンをURLに含めず、HttpOnly Cookieに保存（10分間有効）
    const tokenData = JSON.stringify({
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiryDate: tokens.expiry_date,
    });

    const redirectUrl = new URL(
      `/resign/preview?id=${resignationId}&method=OAUTH&paid=pending`,
      process.env.NEXTAUTH_URL!
    );

    const response = NextResponse.redirect(redirectUrl);
    response.cookies.set("gmail_oauth_token", tokenData, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 600, // 10分
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Gmail OAuth callback error:", err);
    return NextResponse.redirect(
      new URL("/resign/method?error=oauth_failed", process.env.NEXTAUTH_URL!)
    );
  }
}
