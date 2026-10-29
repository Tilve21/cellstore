import Link from "next/link";
import { storeConfig } from "@/config/store";

export const legalLinks = [
  { href: "/terminos", label: "Términos y condiciones" },
  { href: "/retracto", label: "Devoluciones y retracto" },
  { href: "/privacidad", label: "Tratamiento de datos" },
] as const;

/** Nombre del responsable: la razón social si está configurada, si no el nombre de la tienda. */
export function businessName(): string {
  return storeConfig.legal.businessName || storeConfig.name;
}

/** Datos de identificación del vendedor (Ley 1480, art. 50). Solo muestra los campos completados. */
export function BusinessInfo() {
  const { taxId, address, city, phone } = storeConfig.legal;
  const rows = [
    ["Responsable", businessName()],
    ["NIT / C.C.", taxId],
    ["Dirección", [address, city].filter(Boolean).join(", ")],
    ["Teléfono", phone],
    ["Correo", storeConfig.supportEmail],
  ].filter(([, value]) => value);

  return (
    <dl className="grid gap-x-6 gap-y-1 rounded-2xl border border-zinc-200 bg-white p-5 text-sm sm:grid-cols-[auto_1fr]">
      {rows.map(([label, value]) => (
        <div key={label} className="contents">
          <dt className="font-medium text-zinc-500">{label}</dt>
          <dd className="text-zinc-900">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <nav className="mb-8 flex flex-wrap gap-2 text-sm">
        {legalLinks.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-900"
          >
            {l.label}
          </Link>
        ))}
      </nav>
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">{title}</h1>
      <p className="mt-2 text-sm text-zinc-500">Última actualización: {storeConfig.legal.updatedAt}</p>
      <div className="mt-8 flex flex-col gap-4 text-[15px] leading-relaxed text-zinc-700 [&_h2]:mt-6 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-zinc-900 [&_li]:ml-5 [&_li]:list-disc [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1.5 [&_a]:font-medium [&_a]:text-brand-600 [&_a:hover]:underline">
        {children}
      </div>
    </div>
  );
}
