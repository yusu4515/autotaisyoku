import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { summarizeReply } from "@/lib/anthropic";
import { z } from "zod";

const schema = z.object({
  resignationId: z.string(),
  rawContent: z.string().min(1),
  fromEmail: z.string().email(),
  fromName: z.string().optional(),
  subject: z.string(),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "認証が必要です。" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
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

    const { summary, hasKeywords, detectedKeywords } = await summarizeReply(data.rawContent);

    const reply = await prisma.reply.create({
      data: {
        resignationId: data.resignationId,
        rawContent: data.rawContent,
        summary,
        hasKeywords,
        detectedKeywords,
        fromEmail: data.fromEmail,
        fromName: data.fromName,
        subject: data.subject,
      },
    });

    return NextResponse.json({
      id: reply.id,
      summary,
      hasKeywords,
      detectedKeywords,
    });
  } catch (error) {
    console.error("Summarize reply error:", error);
    return NextResponse.json({ error: "要約の生成に失敗しました。" }, { status: 500 });
  }
}
