import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

/**
 * Webhook de Stripe. Aquí se confirma el pago de forma confiable
 * (la página de éxito puede no cargarse si el cliente cierra el navegador).
 * Configúralo en https://dashboard.stripe.com/webhooks apuntando a /api/webhooks/stripe
 */
export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[webhook] Falta STRIPE_WEBHOOK_SECRET");
    return NextResponse.json({ error: "Webhook no configurado" }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Falta firma" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const payload = await request.text();
    event = getStripe().webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    console.error("[webhook] Firma inválida:", error);
    return NextResponse.json({ error: "Firma inválida" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.payment_status === "paid") {
        await fulfillOrder(session);
      }
      break;
    }
    case "checkout.session.async_payment_failed":
      console.warn("[webhook] Pago fallido:", event.data.object.id);
      break;
  }

  return NextResponse.json({ received: true });
}

async function fulfillOrder(session: Stripe.Checkout.Session) {
  // TODO: guardar el pedido en tu base de datos, descontar stock y enviar email de confirmación.
  console.log("[webhook] ✅ Pedido pagado", {
    sessionId: session.id,
    email: session.customer_details?.email,
    total: session.amount_total,
    currency: session.currency,
    cart: session.metadata?.cart,
  });
}
