import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

    const resignation = await prisma.resignation.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!resignation) {
      return NextResponse.json({ error: "見つかりません。" }, { status: 404 });
    }

    const updated = await prisma.resignation.update({
      where: { id },
      data: {
        ...(body.sendMethod && { sendMethod: body.sendMethod }),
        ...(body.scheduledAt !== undefined && {
          scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
        }),
        ...(body.generatedEmail && { generatedEmail: body.generatedEmail }),
        ...(body.generatedSubject && { generatedSubject: body.generatedSubject }),
        ...(body.generatedLetter && { generatedLetter: body.generatedLetter }),
        ...(body.status && { status: body.status }),
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
