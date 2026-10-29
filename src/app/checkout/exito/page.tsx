import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ClearCartOnMount } from "@/components/cart/ClearCartOnMount";
import { Icon, type IconName } from "@/components/ui/Icon";
import { storeConfig } from "@/config/store";
import { formatPrice, fromStripeAmount } from "@/lib/format";
import { getStripe } from "@/lib/stripe";

export const metadata: Metadata = { title: "Pago confirmado" };
export const dynamic = "force-dynamic";

const nextSteps: { icon: IconName; title: string; text: string }[] = [
  { icon: "mail", title: "Confirmación", text: "Te enviamos el recibo de pago a tu correo." },
  { icon: "box", title: "Preparación", text: "Empacamos tu equipo en las próximas 24 horas." },
  {
    icon: "truck",
    title: "Entrega",
    text: `Llega en ${storeConfig.shipping.minDays} a ${storeConfig.shipping.maxDays} días hábiles.`,
  },
];

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams;
  if (!session_id) redirect("/");

  let session;
  try {
    session = await getStripe().checkout.sessions.retrieve(session_id, { expand: ["line_items"] });
  } catch {
    redirect("/");
  }

  const paid = session.payment_status === "paid";
  const currency = session.currency ?? storeConfig.currency;
  const shipping = session.collected_information?.shipping_details;
  const money = (amount: number) => formatPrice(fromStripeAmount(amount, currency), currency);

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
              ? `Tu pago fue aprobado. Enviamos la confirmación a ${session.customer_details?.email ?? "tu correo"}.`
              : "Te avisaremos por correo apenas se confirme."}
          </p>
          <p className="mt-6 inline-block rounded-full bg-white/10 px-4 py-1.5 font-mono text-xs text-zinc-300">
            Pedido #{session.id.slice(-10).toUpperCase()}
          </p>
        </div>

        <div className="grid gap-8 p-8 md:grid-cols-[1.4fr_1fr]">
          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-400">Resumen</h2>
            <ul className="divide-y divide-zinc-100 text-sm">
              {session.line_items?.data.map((li) => (
                <li key={li.id} className="flex justify-between gap-4 py-3">
                  <span className="text-zinc-700">
                    <span className="font-semibold text-zinc-900">{li.quantity}×</span> {li.description}
                  </span>
                  <span className="font-medium tabular-nums">{money(li.amount_total)}</span>
                </li>
              ))}
              <li className="flex justify-between py-3 text-zinc-500">
                <span>Envío</span>
                <span className="font-medium text-emerald-600">Gratis</span>
              </li>
              <li className="flex justify-between pt-4 text-base font-bold">
                <span>Total pagado</span>
                <span className="tabular-nums">{money(session.amount_total ?? 0)}</span>
              </li>
            </ul>
          </section>

          {shipping && (
            <section>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-400">Enviar a</h2>
              <address className="text-sm not-italic leading-relaxed text-zinc-700">
                <span className="font-semibold text-zinc-900">{shipping.name}</span>
                <br />
                {shipping.address.line1}
                {shipping.address.line2 && <>, {shipping.address.line2}</>}
                <br />
                {[shipping.address.city, shipping.address.state, shipping.address.postal_code].filter(Boolean).join(", ")}
                <br />
                {shipping.address.country}
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
