import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getGmailAuthUrl } from "@/lib/gmail";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "認証が必要です。" }, { status: 401 });
  }

  const resignationId = req.nextUrl.searchParams.get("resignationId");
  if (!resignationId) {
    return NextResponse.json({ error: "resignationIdが必要です。" }, { status: 400 });
  }

  // stateにユーザーIDと退職申請IDを含める（CSRF対策）
  const state = Buffer.from(
    JSON.stringify({ userId: session.user.id, resignationId })
  ).toString("base64url");

  const authUrl = getGmailAuthUrl(state);
  return NextResponse.redirect(authUrl);
}
