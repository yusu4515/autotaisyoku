import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const postalSchema = z.object({
  resignationId: z.string(),
  companyName: z.string().min(1),
  companyAddress: z.string().min(1),
  recipientName: z.string().min(1),
  senderName: z.string().min(1),
  senderAddress: z.string().min(1),
  senderPostalCode: z.string().min(7),
});

/**
 * 内容証明郵便フォーマットに変換する
 * 規則: 1行20字以内、1枚26行以内
 */
function formatForCertifiedMail(text: string): string {
  const maxCharsPerLine = 20;
  const lines: string[] = [];

  for (const rawLine of text.split("\n")) {
    if (rawLine.length === 0) {
      lines.push("");
      continue;
    }
    // 20字ごとに折り返し
    for (let i = 0; i < rawLine.length; i += maxCharsPerLine) {
      lines.push(rawLine.slice(i, i + maxCharsPerLine));
    }
  }

  return lines.join("\n");
}

/**
 * Webゆうびん API リクエスト構造（内容証明郵便）
 * 実際のAPIキーが設定されている場合のみ呼び出す
 * https://www.post.japanpost.jp/webyu/
 */
async function sendViaWebYubin(params: {
  senderName: string;
  senderPostalCode: string;
  senderAddress: string;
  recipientName: string;
  recipientPostalCode?: string;
  recipientAddress: string;
  content: string;
}): Promise<{ trackingId: string; receiptNumber: string }> {
  const apiKey = process.env.YUBIN_API_KEY;
  const apiUrl = process.env.YUBIN_API_URL;

  if (!apiKey || !apiUrl) {
    // APIキー未設定 → モック動作
    console.info("[postal] Webゆうびん APIキー未設定。モック追跡番号を発行します。");
    return {
      trackingId: `MOCK-${Date.now()}`,
      receiptNumber: `RCP-${Date.now()}`,
    };
  }

  // 内容証明フォーマットに変換
  const formattedContent = formatForCertifiedMail(params.content);

  // Webゆうびん API呼び出し（仕様に合わせて実装）
  const response = await fetch(`${apiUrl}/certified-mail`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "X-Api-Version": "1",
    },
    body: JSON.stringify({
      mailType: "CERTIFIED_DELIVERY", // 内容証明＋配達証明
      sender: {
        name: params.senderName,
        postalCode: params.senderPostalCode.replace("-", ""),
        address: params.senderAddress,
      },
      recipient: {
        name: params.recipientName,
        postalCode: params.recipientPostalCode?.replace("-", "") ?? "",
        address: params.recipientAddress,
      },
      content: formattedContent,
      options: {
        deliveryConfirmation: true, // 配達証明
        electronicCertification: true, // 電子内容証明
      },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Webゆうびん APIエラー: ${response.status} ${err}`);
  }

  const data = await response.json();
  return {
    trackingId: data.trackingNumber,
    receiptNumber: data.receiptNumber,
  };
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "認証が必要です。" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = postalSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "入力内容が正しくありません。" }, { status: 400 });
    }

    const data = parsed.data;

    const resignation = await prisma.resignation.findFirst({
      where: { id: data.resignationId, userId: session.user.id },
    });

    if (!resignation) {
      return NextResponse.json({ error: "退職申請が見つかりません。" }, { status: 404 });
    }

    if (!resignation.generatedLetter) {
      return NextResponse.json({ error: "退職届が生成されていません。" }, { status: 400 });
    }

    const { trackingId, receiptNumber } = await sendViaWebYubin({
      senderName: data.senderName,
      senderPostalCode: data.senderPostalCode,
      senderAddress: data.senderAddress,
      recipientName: `${data.companyName} ${data.recipientName} 殿`,
      recipientAddress: data.companyAddress,
      content: resignation.generatedLetter,
    });

    await prisma.resignation.update({
      where: { id: data.resignationId },
      data: {
        companyAddress: data.companyAddress,
        postalSentAt: new Date(),
        postalTrackingId: trackingId,
        status: "POSTAL_SENT",
      },
    });

    return NextResponse.json({
      success: true,
      trackingId,
      receiptNumber,
      message: "郵送の手配が完了しました。追跡番号でお荷物の状況を確認できます。",
      trackingUrl: `https://www.post.japanpost.jp/send/specify/tracking/index.html?number=${trackingId}`,
    });
  } catch (error) {
    console.error("Postal error:", error);
    return NextResponse.json({ error: "郵送手配に失敗しました。" }, { status: 500 });
  }
}
