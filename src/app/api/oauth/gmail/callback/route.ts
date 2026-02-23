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

    // トークンを暗号化してDBに保存
    // 本番ではAES-256-GCM等で暗号化することを推奨
    // ここではシンプルにBase64エンコードのみ
    await prisma.resignation.update({
      where: { id: resignationId, userId },
      data: {
        sendMethod: "OAUTH",
        // OAuthトークンはgeneratedEmail欄に一時保存（本来は専用カラムを追加すべき）
        // 実運用ではOAuthTokenモデルを別途作成することを推奨
      },
    });

    // トークンをセッションストレージ相当のものに格納（簡易実装）
    // 本番ではRedisやDBの専用テーブルを使う
    const tokenData = Buffer.from(JSON.stringify({
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiryDate: tokens.expiry_date,
    })).toString("base64");

    const redirectUrl = new URL(
      `/resign/preview?id=${resignationId}&method=OAUTH&gmailToken=${tokenData}`,
      process.env.NEXTAUTH_URL!
    );

    return NextResponse.redirect(redirectUrl);
  } catch (err) {
    console.error("Gmail OAuth callback error:", err);
    return NextResponse.redirect(
      new URL("/resign/method?error=oauth_failed", process.env.NEXTAUTH_URL!)
    );
  }
}
