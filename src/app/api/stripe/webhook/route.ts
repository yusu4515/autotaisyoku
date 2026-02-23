import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "署名がありません。" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json({ error: "署名の検証に失敗しました。" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const resignationId = session.metadata?.resignationId;

    if (!resignationId) {
      return NextResponse.json({ error: "resignationIdがありません。" }, { status: 400 });
    }

    try {
      await prisma.resignation.update({
        where: { id: resignationId },
        data: {
          paymentStatus: "PAID",
          paidAt: new Date(),
        },
      });

      console.log(`Payment completed for resignation: ${resignationId}`);
    } catch (error) {
      console.error("Failed to update payment status:", error);
      return NextResponse.json({ error: "データ更新に失敗しました。" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
