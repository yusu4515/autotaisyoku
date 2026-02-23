import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  generateResignationEmail,
  generateResignationLetter,
} from "@/lib/anthropic";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "認証が必要です。" }, { status: 401 });
  }

  try {
    const { resignationId } = await req.json();

    const resignation = await prisma.resignation.findFirst({
      where: { id: resignationId, userId: session.user.id },
    });

    if (!resignation) {
      return NextResponse.json({ error: "退職申請が見つかりません。" }, { status: 404 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    const input = {
      companyName: resignation.companyName,
      recipientName: resignation.recipientName || undefined,
      resignationDate: format(resignation.resignationDate, "yyyy年M月d日", { locale: ja }),
      lastWorkingDate: format(resignation.lastWorkingDate, "yyyy年M月d日", { locale: ja }),
      resignationReason: resignation.resignationReason,
      customReason: resignation.customReason || undefined,
      paidLeave: resignation.paidLeave,
      equipmentReturn: resignation.equipmentReturn,
      documentDelivery: resignation.documentDelivery,
      senderName: user?.name || undefined,
    };

    const [emailResult, letter] = await Promise.all([
      generateResignationEmail(input),
      generateResignationLetter(input),
    ]);

    // 生成結果を保存
    await prisma.resignation.update({
      where: { id: resignationId },
      data: {
        generatedSubject: emailResult.subject,
        generatedEmail: emailResult.body,
        generatedLetter: letter,
        status: "READY",
      },
    });

    return NextResponse.json({
      subject: emailResult.subject,
      body: emailResult.body,
      letter,
    });
  } catch (error) {
    console.error("Generate email error:", error);
    return NextResponse.json({ error: "文面の生成に失敗しました。" }, { status: 500 });
  }
}
