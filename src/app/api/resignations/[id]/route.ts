import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const patchSchema = z.object({
  sendMethod: z.enum(["SMTP", "OAUTH", "COPY_PASTE"]).optional(),
  scheduledAt: z.string().nullable().optional(),
  generatedEmail: z.string().optional(),
  generatedSubject: z.string().optional(),
  generatedLetter: z.string().optional(),
  // status はクライアントから直接書き換え不可（send-email等のサーバーアクションのみで更新）
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "認証が必要です。" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await req.json();
    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "入力内容が正しくありません。" }, { status: 400 });
    }

    const resignation = await prisma.resignation.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!resignation) {
      return NextResponse.json({ error: "見つかりません。" }, { status: 404 });
    }

    const data = parsed.data;
    const updated = await prisma.resignation.update({
      where: { id },
      data: {
        ...(data.sendMethod && { sendMethod: data.sendMethod }),
        ...(data.scheduledAt !== undefined && {
          scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
        }),
        ...(data.generatedEmail && { generatedEmail: data.generatedEmail }),
        ...(data.generatedSubject && { generatedSubject: data.generatedSubject }),
        ...(data.generatedLetter && { generatedLetter: data.generatedLetter }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update resignation error:", error);
    return NextResponse.json({ error: "サーバーエラーが発生しました。" }, { status: 500 });
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "認証が必要です。" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const resignation = await prisma.resignation.findFirst({
      where: { id, userId: session.user.id },
      include: {
        replies: true,
        checklistItems: true,
      },
    });

    if (!resignation) {
      return NextResponse.json({ error: "見つかりません。" }, { status: 404 });
    }

    return NextResponse.json(resignation);
  } catch (error) {
    console.error("Get resignation error:", error);
    return NextResponse.json({ error: "サーバーエラーが発生しました。" }, { status: 500 });
  }
}
