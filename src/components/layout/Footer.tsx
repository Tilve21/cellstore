import Link from "next/link";
import { PaymentBadges } from "@/components/cart/PaymentBadges";
import { businessName, legalLinks } from "@/components/legal/LegalPage";
import { storeConfig } from "@/config/store";
import { getBrands } from "@/lib/products";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-24 bg-zinc-950 text-zinc-400">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[2fr_1fr_1fr_1fr]">
        <div className="flex max-w-sm flex-col gap-4">
          <Logo inverted />
          <p className="text-sm leading-relaxed">{storeConfig.tagline}. Equipos nuevos, sellados y con factura.</p>
          <PaymentBadges variant="dark" />
        </div>
        <div>
          <h3 className="mb-4 text-sm font-semibold text-white">Marcas</h3>
          <ul className="flex flex-col gap-2 text-sm">
            {getBrands().map((b) => (
              <li key={b}>
                <Link href="/#catalogo" className="transition hover:text-white">{b}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-semibold text-white">Ayuda</h3>
          <ul className="flex flex-col gap-2 text-sm">
            <li><Link href="/carrito" className="transition hover:text-white">Mi carrito</Link></li>
            <li><Link href="/#beneficios" className="transition hover:text-white">Envíos y garantía</Link></li>
            <li>
              <a href={`mailto:${storeConfig.supportEmail}`} className="transition hover:text-white">{storeConfig.supportEmail}</a>
            </li>
            {storeConfig.legal.phone && <li>{storeConfig.legal.phone}</li>}
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-semibold text-white">Legal</h3>
          <ul className="flex flex-col gap-2 text-sm">
            {legalLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition hover:text-white">{l.label}</Link>
              </li>
            ))}
            <li>
              <a href="https://www.sic.gov.co" target="_blank" rel="noopener noreferrer" className="transition hover:text-white">
                Superintendencia de Industria y Comercio
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-6 text-xs sm:px-6">
          <p>
            © {new Date().getFullYear()} {businessName()}
            {storeConfig.legal.taxId && <> · NIT/C.C. {storeConfig.legal.taxId}</>}
            {storeConfig.legal.address && <> · {[storeConfig.legal.address, storeConfig.legal.city].filter(Boolean).join(", ")}</>}
            . Todos los derechos reservados.
          </p>
          <p>Pagos procesados de forma segura por Wompi. Precios en pesos colombianos con IVA incluido.</p>
        </div>
      </div>
    </footer>
  );
}
