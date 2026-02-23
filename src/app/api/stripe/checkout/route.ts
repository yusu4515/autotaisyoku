import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe, PRICE_AMOUNT, PRICE_CURRENCY } from "@/lib/stripe";

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

    if (resignation.paymentStatus === "PAID") {
      return NextResponse.json({ error: "既に支払い済みです。" }, { status: 400 });
    }

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: PRICE_CURRENCY,
            product_data: {
              name: "オートマ退職",
              description: `退職通知メール送信サービス（${resignation.companyName}宛）`,
            },
            unit_amount: PRICE_AMOUNT,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/dashboard?paid=true&id=${resignationId}`,
      cancel_url: `${baseUrl}/resign/preview?id=${resignationId}&method=${resignation.sendMethod}`,
      metadata: {
        resignationId,
        userId: session.user.id,
      },
      locale: "ja",
      payment_method_options: {
        card: {
          request_three_d_secure: "automatic",
        },
      },
    });

    await prisma.resignation.update({
      where: { id: resignationId },
      data: { stripeSessionId: checkoutSession.id },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json({ error: "決済処理に失敗しました。" }, { status: 500 });
  }
}
