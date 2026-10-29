import "server-only";
import Stripe from "stripe";

let client: Stripe | null = null;

/** Cliente de Stripe del lado del servidor. Nunca importar desde componentes cliente. */
export function getStripe(): Stripe {
  if (!client) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey || !/^(sk|rk)_(test|live)_/.test(secretKey)) {
      throw new Error("STRIPE_SECRET_KEY falta o no es válida en .env.local (debe empezar con sk_test_ o sk_live_)");
    }
    client = new Stripe(secretKey, { typescript: true });
  }
  return client;
}

export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
}
