import type { CartItem, CheckoutRequest } from "@/types";

/** Llama a /api/checkout y redirige al cliente al Web Checkout de Wompi. */
export async function redirectToCheckout(items: CartItem[]): Promise<void> {
  const payload: CheckoutRequest = {
    items: items.map(({ productId, variantId, quantity }) => ({ productId, variantId, quantity })),
  };

  const res = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data: { url?: string; error?: string } = await res.json().catch(() => ({}));
  if (!res.ok || !data.url) {
    throw new Error(data.error ?? "No se pudo iniciar el pago");
  }

  window.location.assign(data.url);
}
