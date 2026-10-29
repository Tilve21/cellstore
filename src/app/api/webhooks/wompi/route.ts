import { NextResponse } from "next/server";
import { verifyEvent, type WompiEvent, type WompiTransaction } from "@/lib/wompi";

export const runtime = "nodejs";

/**
 * Eventos de Wompi. Aquí se confirma el pago de forma confiable
 * (la página de resultado puede no cargarse si el cliente cierra el navegador).
 * Configura la "URL de Eventos" en el dashboard de Wompi apuntando a /api/webhooks/wompi
 */
export async function POST(request: Request) {
  if (!process.env.WOMPI_EVENTS_SECRET) {
    console.error("[webhook] Falta WOMPI_EVENTS_SECRET");
    return NextResponse.json({ error: "Webhook no configurado" }, { status: 500 });
  }

  let event: WompiEvent;
  try {
    event = await request.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });
  }

  if (!verifyEvent(event)) {
    console.error("[webhook] Firma inválida");
    return NextResponse.json({ error: "Firma inválida" }, { status: 400 });
  }

  if (event.event === "transaction.updated") {
    const transaction = event.data.transaction;
    if (transaction.status === "APPROVED") {
      await fulfillOrder(transaction);
    } else {
      console.warn("[webhook] Transacción", transaction.status, transaction.reference);
    }
  }

  return NextResponse.json({ received: true });
}

async function fulfillOrder(transaction: WompiTransaction) {
  // TODO: guardar el pedido en tu base de datos, descontar stock y enviar email de confirmación.
  console.log("[webhook] ✅ Pedido pagado", {
    transactionId: transaction.id,
    reference: transaction.reference,
    email: transaction.customer_email,
    total: transaction.amount_in_cents / 100,
    currency: transaction.currency,
    shipping: transaction.shipping_address,
  });
}
