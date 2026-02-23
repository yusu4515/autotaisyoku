import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createSchema = z.object({
  companyName: z.string().min(1),
  companyEmail: z.string().email(),
  recipientName: z.string().optional(),
  resignationDate: z.string(),
  lastWorkingDate: z.string(),
  resignationReason: z.enum(["PERSONAL", "OTHER"]),
  customReason: z.string().optional(),
  paidLeave: z.enum(["FULL", "NEGOTIATE", "NONE"]),
  equipmentReturn: z.enum(["BY_MAIL", "AT_DESK", "IN_PERSON"]),
  documentDelivery: z.enum(["BY_MAIL", "NONE"]),
  senderName: z.string().min(1),
  senderEmail: z.string().email(),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "認証が必要です。" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "入力内容が正しくありません。" }, { status: 400 });
    }

    const data = parsed.data;

    const resignation = await prisma.resignation.create({
      data: {
        userId: session.user.id,
        companyName: data.companyName,
        companyEmail: data.companyEmail,
        recipientName: data.recipientName,
        resignationDate: new Date(data.resignationDate),
        lastWorkingDate: new Date(data.lastWorkingDate),
        resignationReason: data.resignationReason,
        customReason: data.customReason,
        paidLeave: data.paidLeave,
        equipmentReturn: data.equipmentReturn,
        documentDelivery: data.documentDelivery,
        senderEmail: data.senderEmail,
        status: "DRAFT",
      },
    });

    // ユーザー名を更新
    if (data.senderName) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { name: data.senderName },
      });
    }

    return NextResponse.json({ id: resignation.id }, { status: 201 });
  } catch (error) {
    console.error("Create resignation error:", error);
    return NextResponse.json({ error: "サーバーエラーが発生しました。" }, { status: 500 });
  }
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "認証が必要です。" }, { status: 401 });
  }

  try {
    const resignations = await prisma.resignation.findMany({
      where: { userId: session.user.id },
      include: {
        replies: {
          select: {
            id: true,
            fromEmail: true,
            fromName: true,
            subject: true,
            summary: true,
            hasKeywords: true,
            detectedKeywords: true,
            isRead: true,
            receivedAt: true,
          },
          orderBy: { receivedAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(resignations);
  } catch (error) {
    console.error("Get resignations error:", error);
    return NextResponse.json({ error: "サーバーエラーが発生しました。" }, { status: 500 });
  }
}
