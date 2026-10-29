import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ClearCartOnMount } from "@/components/cart/ClearCartOnMount";
import { Icon, type IconName } from "@/components/ui/Icon";
import { storeConfig } from "@/config/store";
import { formatPrice, fromCents } from "@/lib/format";
import { getTransaction } from "@/lib/wompi";

export const metadata: Metadata = { title: "Resultado del pago" };
export const dynamic = "force-dynamic";

const nextSteps: { icon: IconName; title: string; text: string }[] = [
  { icon: "mail", title: "Confirmación", text: "Te enviamos el comprobante de pago a tu correo." },
  { icon: "box", title: "Preparación", text: "Empacamos tu equipo en las próximas 24 horas." },
  {
    icon: "truck",
    title: "Entrega",
    text: `Llega en ${storeConfig.shipping.minDays} a ${storeConfig.shipping.maxDays} días hábiles.`,
  },
];

const paymentMethods: Record<string, string> = {
  CARD: "Tarjeta",
  PSE: "PSE",
  NEQUI: "Nequi",
  BANCOLOMBIA_TRANSFER: "Botón Bancolombia",
  BANCOLOMBIA_COLLECT: "Corresponsal Bancolombia",
  DAVIPLATA: "Daviplata",
};

/** Wompi redirige aquí con ?id=<id de la transacción>. */
export default async function PaymentResultPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams;
  if (!id) redirect("/");

  const transaction = await getTransaction(id).catch(() => null);
  if (!transaction) redirect("/");

  const paid = transaction.status === "APPROVED";
  const pending = transaction.status === "PENDING";
  const shipping = transaction.shipping_address;
  const total = formatPrice(fromCents(transaction.amount_in_cents), transaction.currency);
  const method = transaction.payment_method_type
    ? (paymentMethods[transaction.payment_method_type] ?? transaction.payment_method_type)
    : null;

  if (!paid && !pending) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
          <Icon name="lock" className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">El pago no se completó</h1>
        <p className="mt-3 text-zinc-500">
          {transaction.status_message ?? "La transacción fue rechazada."} No se hizo ningún cobro. Tus productos siguen en el
          carrito.
        </p>
        <Link
          href="/carrito"
          className="mt-8 inline-block rounded-full bg-zinc-900 px-6 py-3 font-semibold text-white transition hover:bg-zinc-700"
        >
          Volver al carrito
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      {paid && <ClearCartOnMount />}

      <div className="animate-fade-up overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-sm">
        <div className="relative isolate overflow-hidden bg-zinc-950 px-8 py-12 text-center text-white">
          <div className="absolute left-1/2 top-0 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-brand-600/40 blur-3xl" />
          <div className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full ${paid ? "bg-emerald-500" : "bg-amber-500"}`}>
            <Icon name={paid ? "check" : "sparkle"} className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{paid ? "¡Gracias por tu compra!" : "Estamos procesando tu pago"}</h1>
          <p className="mx-auto mt-3 max-w-md text-zinc-400">
            {paid
              ? `Tu pago fue aprobado. Enviamos la confirmación a ${transaction.customer_email ?? "tu correo"}.`
              : "Tu banco aún no confirma el pago. Te avisaremos por correo apenas se apruebe."}
          </p>
          <p className="mt-6 inline-block rounded-full bg-white/10 px-4 py-1.5 font-mono text-xs text-zinc-300">
            Pedido #{transaction.reference}
          </p>
        </div>

        <div className="grid gap-8 p-8 md:grid-cols-[1.4fr_1fr]">
          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-400">Resumen</h2>
            <ul className="divide-y divide-zinc-100 text-sm">
              {method && (
                <li className="flex justify-between py-3 text-zinc-500">
                  <span>Medio de pago</span>
                  <span className="font-medium text-zinc-900">{method}</span>
                </li>
              )}
              <li className="flex justify-between py-3 text-zinc-500">
                <span>Envío</span>
                <span className="font-medium text-emerald-600">Gratis</span>
              </li>
              <li className="flex justify-between pt-4 text-base font-bold">
                <span>{paid ? "Total pagado" : "Total"}</span>
                <span className="tabular-nums">{total}</span>
              </li>
            </ul>
          </section>

          {shipping && (
            <section>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-400">Enviar a</h2>
              <address className="text-sm not-italic leading-relaxed text-zinc-700">
                {shipping.name && (
                  <>
                    <span className="font-semibold text-zinc-900">{shipping.name}</span>
                    <br />
                  </>
                )}
                {shipping.address_line_1}
                {shipping.address_line_2 && <>, {shipping.address_line_2}</>}
                <br />
                {[shipping.city, shipping.region, shipping.postal_code].filter(Boolean).join(", ")}
                <br />
                {shipping.country}
              </address>
            </section>
          )}
        </div>

        {paid && (
          <div className="border-t border-zinc-100 bg-zinc-50 p-8">
            <h2 className="mb-5 text-sm font-semibold uppercase tracking-wider text-zinc-400">¿Qué sigue?</h2>
            <ol className="grid gap-5 sm:grid-cols-3">
              {nextSteps.map((step, i) => (
                <li key={step.title} className="flex gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    <Icon name={step.icon} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">
                      {i + 1}. {step.title}
                    </p>
                    <p className="text-xs text-zinc-500">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-col items-center gap-3 text-center">
        <Link href="/" className="rounded-full bg-zinc-900 px-6 py-3 font-semibold text-white transition hover:bg-zinc-700">
          Volver a la tienda
        </Link>
        <p className="text-sm text-zinc-500">
          ¿Dudas con tu pedido? Escríbenos a{" "}
          <a href={`mailto:${storeConfig.supportEmail}`} className="font-medium text-zinc-900 hover:underline">
            {storeConfig.supportEmail}
          </a>
        </p>
      </div>
    </div>
  );
}
