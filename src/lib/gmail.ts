import { google } from "googleapis";

/**
 * Gmail OAuth2クライアント
 * ユーザー自身のGmailアカウントからメールを送信する
 */
export function createOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    `${process.env.NEXTAUTH_URL}/api/oauth/gmail/callback`
  );
}

/**
 * OAuth認証URLを生成
 */
export function getGmailAuthUrl(state: string): string {
  const oauth2Client = createOAuth2Client();
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/gmail.send"],
    state,
    prompt: "consent", // 毎回同意画面を表示してrefresh_tokenを取得
  });
}

/**
 * 認証コードからトークンを取得
 */
export async function getTokensFromCode(code: string) {
  const oauth2Client = createOAuth2Client();
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
}

/**
 * Gmail APIでメール送信
 */
export async function sendGmailWithOAuth(params: {
  accessToken: string;
  refreshToken: string;
  from: string;
  fromName: string;
  to: string;
  subject: string;
  body: string;
}): Promise<void> {
  const oauth2Client = createOAuth2Client();
  oauth2Client.setCredentials({
    access_token: params.accessToken,
    refresh_token: params.refreshToken,
  });

  const gmail = google.gmail({ version: "v1", auth: oauth2Client });

  // RFC 2822形式のメッセージを構築
  const emailLines = [
    `From: "${params.fromName}" <${params.from}>`,
    `To: ${params.to}`,
    `Subject: =?UTF-8?B?${Buffer.from(params.subject).toString("base64")}?=`,
    "MIME-Version: 1.0",
    'Content-Type: text/plain; charset="UTF-8"',
    "Content-Transfer-Encoding: base64",
    "",
    Buffer.from(params.body).toString("base64"),
  ];

  const rawMessage = Buffer.from(emailLines.join("\r\n"))
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

  await gmail.users.messages.send({
    userId: "me",
    requestBody: { raw: rawMessage },
  });
}
