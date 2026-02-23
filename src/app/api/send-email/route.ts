import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "認証が必要です。" }, { status: 401 });
  }

  try {
    const { resignationId, subject, body, smtpPassword } = await req.json();

    const resignation = await prisma.resignation.findFirst({
      where: { id: resignationId, userId: session.user.id },
    });

    if (!resignation) {
      return NextResponse.json({ error: "退職申請が見つかりません。" }, { status: 404 });
    }

    if (resignation.paymentStatus !== "PAID") {
      return NextResponse.json({ error: "お支払いが完了していません。" }, { status: 402 });
    }

    if (!resignation.senderEmail) {
      return NextResponse.json({ error: "差出人メールアドレスが設定されていません。" }, { status: 400 });
    }

    // SMTPでメール送信（かんたんモード）
    if (resignation.sendMethod === "SMTP" && smtpPassword) {
      // Gmailを想定したSMTP設定
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: resignation.senderEmail,
          pass: smtpPassword, // アプリパスワード
        },
        secure: true,
      });

      await transporter.sendMail({
        from: `"${session.user.name || resignation.senderEmail}" <${resignation.senderEmail}>`,
        to: resignation.companyEmail,
        subject,
        text: body,
      });

      // パスワードは使用後即時削除（メモリからも）
      // smtpPasswordはここで参照を切る

      await prisma.resignation.update({
        where: { id: resignationId },
        data: {
          emailSentAt: new Date(),
          status: "EMAIL_SENT",
          generatedEmail: body,
          generatedSubject: subject,
        },
      });

      // 退職後チェックリスト自動生成
      await generateChecklist(resignationId, resignation.resignationDate);

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "送信方式が対応していません。" }, { status: 400 });
  } catch (error) {
    console.error("Send email error:", error);
    return NextResponse.json({ error: "メール送信に失敗しました。設定を確認してください。" }, { status: 500 });
  }
}

async function generateChecklist(resignationId: string, resignationDate: Date) {
  const existing = await prisma.checklistItem.count({ where: { resignationId } });
  if (existing > 0) return;

  const items = [
    {
      title: "健康保険の切替手続き",
      description: "国民健康保険への加入、または任意継続保険の申請が必要です。退職後14日以内に手続きを。",
      category: "社会保険",
      daysAfter: 1,
    },
    {
      title: "年金の種別変更（第2号→第1号）",
      description: "市区町村役場で国民年金への切替手続きが必要です。退職後14日以内が望ましい。",
      category: "社会保険",
      daysAfter: 3,
    },
    {
      title: "失業給付申請（ハローワーク）",
      description: "離職票を持ってハローワークへ。自己都合退職は3ヶ月の給付制限があります。",
      category: "雇用保険",
      daysAfter: 14,
    },
    {
      title: "源泉徴収票の受け取り確認",
      description: "会社から退職後1ヶ月以内に発行されます。確定申告に必要です。",
      category: "税金",
      daysAfter: 30,
    },
    {
      title: "確定申告",
      description: "退職した年は自分で確定申告が必要です。翌年2〜3月が申告期間。",
      category: "税金",
      daysAfter: 180,
    },
  ];

  await prisma.checklistItem.createMany({
    data: items.map((item) => ({
      resignationId,
      title: item.title,
      description: item.description,
      category: item.category,
      dueDate: new Date(
        resignationDate.getTime() + item.daysAfter * 24 * 60 * 60 * 1000
      ),
    })),
  });
}
