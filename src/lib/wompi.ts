import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";

/** Estados posibles de una transacción en Wompi */
export type WompiStatus = "PENDING" | "APPROVED" | "DECLINED" | "VOIDED" | "ERROR";

export interface WompiTransaction {
  id: string;
  status: WompiStatus;
  reference: string;
  amount_in_cents: number;
  currency: string;
  customer_email?: string | null;
  payment_method_type?: string | null;
  status_message?: string | null;
  shipping_address?: {
    address_line_1: string;
    address_line_2?: string | null;
    country: string;
    region: string;
    city: string;
    name?: string | null;
    phone_number?: string | null;
    postal_code?: string | null;
  } | null;
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} falta en las variables de entorno`);
  return value;
}

export function getPublicKey(): string {
  const key = requireEnv("WOMPI_PUBLIC_KEY");
  if (!/^pub_(test|prod)_/.test(key)) {
    throw new Error("WOMPI_PUBLIC_KEY no es válida (debe empezar con pub_test_ o pub_prod_)");
  }
  return key;
}

/** La llave pública indica el ambiente: pub_test_ → sandbox, pub_prod_ → producción. */
function getApiUrl(): string {
  return getPublicKey().startsWith("pub_prod_") ? "https://production.wompi.co/v1" : "https://sandbox.wompi.co/v1";
}

export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");

/** Firma de integridad que exige el Web Checkout: SHA256(referencia + monto + moneda + secreto). */
export function integritySignature(reference: string, amountInCents: number, currency: string): string {
  return sha256(`${reference}${amountInCents}${currency}${requireEnv("WOMPI_INTEGRITY_SECRET")}`);
}

/** URL del Web Checkout alojado por Wompi (tarjetas, PSE, Nequi, Bancolombia…). */
export function buildCheckoutUrl(params: { reference: string; amountInCents: number; currency: string; redirectUrl: string }) {
  const query = new URLSearchParams({
    "public-key": getPublicKey(),
    currency: params.currency,
    "amount-in-cents": String(params.amountInCents),
    reference: params.reference,
    "signature:integrity": integritySignature(params.reference, params.amountInCents, params.currency),
    "redirect-url": params.redirectUrl,
    "collect-shipping": "true",
  });
  return `https://checkout.wompi.co/p/?${query}`;
}

/** Consulta una transacción en Wompi (endpoint público, no requiere llave privada). */
export async function getTransaction(id: string): Promise<WompiTransaction | null> {
  const res = await fetch(`${getApiUrl()}/transactions/${encodeURIComponent(id)}`, { cache: "no-store" });
  if (!res.ok) return null;
  const body: { data?: WompiTransaction } = await res.json();
  return body.data ?? null;
}

export interface WompiEvent {
  event: string;
  data: { transaction: WompiTransaction };
  environment: string;
  signature: { properties: string[]; checksum: string };
  timestamp: number;
}

/**
 * Verifica el checksum de un evento: SHA256(valores de signature.properties + timestamp + secreto de eventos).
 * https://docs.wompi.co/docs/colombia/eventos/
 */
export function verifyEvent(event: WompiEvent): boolean {
  const { properties, checksum } = event.signature ?? {};
  if (!Array.isArray(properties) || typeof checksum !== "string") return false;

  const values = properties.map((path) =>
    path.split(".").reduce<unknown>((obj, key) => (obj as Record<string, unknown> | undefined)?.[key], event.data),
  );
  const expected = sha256(`${values.join("")}${event.timestamp}${requireEnv("WOMPI_EVENTS_SECRET")}`);

  const a = Buffer.from(expected);
  const b = Buffer.from(checksum.toLowerCase());
  return a.length === b.length && timingSafeEqual(a, b);
}
