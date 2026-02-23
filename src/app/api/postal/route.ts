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

    // ここでWebゆうびんAPIを呼び出す予定
    // 現在はモック実装
    // TODO: 実際のWebゆうびんAPI連携
    const mockTrackingId = `YBN${Date.now()}`;

    await prisma.resignation.update({
      where: { id: data.resignationId },
      data: {
        companyAddress: data.companyAddress,
        postalSentAt: new Date(),
        postalTrackingId: mockTrackingId,
        status: "POSTAL_SENT",
      },
    });

    return NextResponse.json({
      success: true,
      trackingId: mockTrackingId,
      message: "郵送の手配が完了しました。追跡番号でお荷物の状況を確認できます。",
    });
  } catch (error) {
    console.error("Postal error:", error);
    return NextResponse.json({ error: "郵送手配に失敗しました。" }, { status: 500 });
  }
}
