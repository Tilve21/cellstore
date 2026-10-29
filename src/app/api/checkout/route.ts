import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { storeConfig } from "@/config/store";
import { resolveCartItems } from "@/lib/cart";
import { toStripeAmount } from "@/lib/format";
import { getSiteUrl, getStripe } from "@/lib/stripe";
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

  const siteUrl = getSiteUrl();
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item) => ({
    quantity: item.quantity,
    price_data: {
      currency: storeConfig.currency,
      unit_amount: toStripeAmount(item.variant.price),
      product_data: {
        name: `${item.product.name} · ${item.variant.label}`,
        description: item.product.description,
        ...(item.product.image ? { images: [`${siteUrl}${item.product.image}`] } : {}),
        metadata: { productId: item.product.id, variantId: item.variant.id },
      },
    },
  }));

  try {
    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      allowed_payment_method_types: ["card"],
      line_items: lineItems,
      locale: "es",
      submit_type: "pay",
      branding_settings: {
        display_name: storeConfig.name,
        button_color: storeConfig.brandColor,
        border_style: "rounded",
        font_family: "inter",
      },
      custom_text: {
        submit: {
          message: `Envío gratis en ${storeConfig.shipping.minDays} a ${storeConfig.shipping.maxDays} días hábiles. Garantía de 12 meses.`,
        },
      },
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries:
          storeConfig.shippingCountries as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[],
      },
      phone_number_collection: { enabled: true },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            display_name: storeConfig.shipping.label,
            fixed_amount: { amount: 0, currency: storeConfig.currency },
            delivery_estimate: {
              minimum: { unit: "business_day", value: storeConfig.shipping.minDays },
              maximum: { unit: "business_day", value: storeConfig.shipping.maxDays },
            },
          },
        },
      ],
      metadata: {
        cart: JSON.stringify(items.map((i) => [i.productId, i.variantId, i.quantity])),
      },
      success_url: `${siteUrl}/checkout/exito?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/carrito?cancelado=1`,
    });

    if (!session.url) throw new Error("Stripe no devolvió URL de checkout");
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[checkout] Error creando sesión de Stripe:", error);
    return NextResponse.json(
      { error: "No pudimos iniciar el pago. Intenta de nuevo en unos segundos." },
      { status: 500 },
    );
  }
}
