import { storeConfig } from "@/config/store";

export function formatPrice(amount: number, currency: string = storeConfig.currency): string {
  return new Intl.NumberFormat(storeConfig.locale, {
    style: "currency",
    currency: currency.toUpperCase(),
    maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount);
}

/** Convierte pesos (3999900) a centavos (399990000), que es lo que espera Wompi. */
export function toCents(amount: number): number {
  return Math.round(amount * 100);
}

/** Inversa de toCents, para mostrar montos que devuelve Wompi. */
export function fromCents(amountInCents: number): number {
  return amountInCents / 100;
}
