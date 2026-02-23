import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

/**
 * 送信証明書（テキスト形式）の生成
 * 退職通知メールを送信した事実を記録した証明書
 */
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "認証が必要です。" }, { status: 401 });
  }

  const resignationId = req.nextUrl.searchParams.get("id");
  if (!resignationId) {
    return NextResponse.json({ error: "idが必要です。" }, { status: 400 });
  }

  try {
    const resignation = await prisma.resignation.findFirst({
      where: { id: resignationId, userId: session.user.id },
      include: { user: { select: { name: true, email: true } } },
    });

    if (!resignation) {
      return NextResponse.json({ error: "退職申請が見つかりません。" }, { status: 404 });
    }

    if (!resignation.emailSentAt) {
      return NextResponse.json({ error: "メールはまだ送信されていません。" }, { status: 400 });
    }

    const now = format(new Date(), "yyyy年M月d日 HH:mm:ss", { locale: ja });
    const sentAt = format(resignation.emailSentAt, "yyyy年M月d日 HH:mm:ss", { locale: ja });

    const certificate = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            退職通知メール 送信証明書
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

証明書発行日時：${now}
証明書発行ID ：${resignationId}

━━━ 送信情報 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

送信日時：${sentAt}
送信方式：${
  resignation.sendMethod === "SMTP"
    ? "かんたんモード（SMTP）"
    : resignation.sendMethod === "OAUTH"
    ? "OAuth連携モード（Gmail）"
    : "コピペモード（ユーザー自身が送信）"
}

差出人（依頼者）
  メールアドレス：${resignation.senderEmail ?? "（コピペモード）"}
  氏名：${resignation.user.name ?? "（未設定）"}

送付先（会社）
  会社名：${resignation.companyName}
  担当者：${resignation.recipientName ?? "ご担当者様"}
  メールアドレス：${resignation.companyEmail}

━━━ 退職内容 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

メール件名：${resignation.generatedSubject ?? "（未設定）"}
退職希望日：${format(resignation.resignationDate, "yyyy年M月d日", { locale: ja })}
最終出社日：${format(resignation.lastWorkingDate, "yyyy年M月d日", { locale: ja })}
退職理由  ：${resignation.resignationReason === "PERSONAL" ? "一身上の都合" : resignation.customReason ?? "（その他）"}

━━━ 郵送情報 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${
  resignation.postalSentAt
    ? `郵送日時：${format(resignation.postalSentAt, "yyyy年M月d日 HH:mm:ss", { locale: ja })}
郵送種別：内容証明郵便＋配達証明
追跡番号：${resignation.postalTrackingId ?? "（未取得）"}`
    : "（郵送未実施）"
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

本証明書は、オートマ退職サービスを通じて
上記日時に退職通知メールが送信されたことを証明します。

本証明書はサービス内のログデータを基に自動生成されており、
法的証拠として補助的に使用することを目的としています。

オートマ退職
https://autotaisyoku.jp

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`.trim();

    return new NextResponse(certificate, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Disposition": `attachment; filename="resignation-certificate-${resignationId}.txt"`,
      },
    });
  } catch (error) {
    console.error("Certificate error:", error);
    return NextResponse.json({ error: "証明書の生成に失敗しました。" }, { status: 500 });
  }
}
