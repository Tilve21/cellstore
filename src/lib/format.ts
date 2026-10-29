import { storeConfig } from "@/config/store";

/** Monedas sin decimales según Stripe: https://docs.stripe.com/currencies#zero-decimal */
const ZERO_DECIMAL_CURRENCIES = new Set([
  "bif", "clp", "djf", "gnf", "jpy", "kmf", "krw", "mga", "pyg",
  "rwf", "ugx", "vnd", "vuv", "xaf", "xof", "xpf",
]);

export function formatPrice(amount: number, currency: string = storeConfig.currency): string {
  return new Intl.NumberFormat(storeConfig.locale, {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount);
}

/** Convierte unidades mayores (999.99) a la unidad mínima que espera Stripe (99999). */
export function toStripeAmount(amount: number, currency: string = storeConfig.currency): number {
  return ZERO_DECIMAL_CURRENCIES.has(currency.toLowerCase())
    ? Math.round(amount)
    : Math.round(amount * 100);
}

/** Inversa de toStripeAmount, para mostrar montos que devuelve Stripe. */
export function fromStripeAmount(amount: number, currency: string = storeConfig.currency): number {
  return ZERO_DECIMAL_CURRENCIES.has(currency.toLowerCase()) ? amount : amount / 100;
}
