import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { storeConfig } from "@/config/store";
import { cartSubtotal, resolveCartItems } from "@/lib/cart";
import { toCents } from "@/lib/format";
import { buildCheckoutUrl, getSiteUrl } from "@/lib/wompi";
import type { CheckoutRequest } from "@/types";

export const runtime = "nodejs";

function isValidRequest(body: unknown): body is CheckoutRequest {
  if (!body || typeof body !== "object" || !Array.isArray((body as CheckoutRequest).items)) return false;
  return (body as CheckoutRequest).items.every(
    (i) =>
      typeof i?.productId === "string" &&
      typeof i?.variantId === "string" &&
      Number.isInteger(i?.quantity) &&
      i.quantity > 0,
  );
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });
  }

  if (!isValidRequest(body) || body.items.length === 0) {
    return NextResponse.json({ error: "El carrito está vacío o es inválido" }, { status: 400 });
  }

  // Los precios se toman SIEMPRE del catálogo del servidor, nunca del cliente.
  const items = resolveCartItems(body.items);
  if (items.length !== body.items.length) {
    return NextResponse.json({ error: "Algún producto ya no está disponible" }, { status: 409 });
  }

  for (const item of items) {
    if (item.quantity > item.variant.stock || item.quantity > storeConfig.maxQuantityPerItem) {
      return NextResponse.json(
        { error: `Stock insuficiente para ${item.product.name} ${item.variant.label}` },
        { status: 409 },
      );
    }
  }

  // Referencia única del pedido; Wompi la devuelve en la transacción y en los eventos.
  const reference = `PS-${Date.now().toString(36)}-${randomBytes(3).toString("hex")}`.toUpperCase();
  const cart = items.map((i) => `${i.quantity}x ${i.product.name} ${i.variant.label}`).join(", ");

  try {
    const url = buildCheckoutUrl({
      reference,
      amountInCents: toCents(cartSubtotal(items)),
      currency: storeConfig.currency,
      redirectUrl: `${getSiteUrl()}/checkout/exito`,
    });
    console.log("[checkout] Pedido creado", { reference, cart });
    return NextResponse.json({ url });
  } catch (error) {
    console.error("[checkout] Error preparando el pago de Wompi:", error);
    return NextResponse.json(
      { error: "No pudimos iniciar el pago. Intenta de nuevo en unos segundos." },
      { status: 500 },
    );
  }
}
