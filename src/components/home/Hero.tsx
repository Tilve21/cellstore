import Link from "next/link";
import { PhoneImage } from "@/components/product/PhoneImage";
import { Icon } from "@/components/ui/Icon";
import { formatPrice } from "@/lib/format";
import { getStartingPrice } from "@/lib/products";
import type { Product } from "@/types";

export function Hero({ featured }: { featured: Product[] }) {
  const [main, ...others] = featured;
  if (!main) return null;

  return (
    <section className="relative isolate overflow-hidden bg-zinc-950 text-white">
      {/* resplandores de fondo */}
      <div className="absolute -left-40 -top-40 -z-10 h-[32rem] w-[32rem] rounded-full bg-brand-600/30 blur-3xl" />
      <div className="absolute -bottom-40 right-0 -z-10 h-[28rem] w-[28rem] rounded-full bg-fuchsia-500/15 blur-3xl" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-24 pt-16 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:pb-28 lg:pt-20">
        <div className="animate-fade-up flex flex-col gap-7">
          <span className="flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Stock disponible · envío inmediato
          </span>
          <h1 className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
            Tu próximo celular,
            <br />
            <span className="bg-gradient-to-r from-brand-400 via-fuchsia-300 to-brand-200 bg-clip-text text-transparent">
              a un clic de distancia.
            </span>
          </h1>
          <p className="max-w-lg text-lg leading-relaxed text-zinc-400">
            iPhone, Galaxy, Pixel, Xiaomi y Motorola originales y sellados. Paga con tarjeta en segundos y recíbelo en casa.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="#catalogo"
              className="group flex items-center gap-2 rounded-full bg-white px-6 py-3.5 font-semibold text-zinc-900 transition hover:bg-zinc-200"
            >
              Ver catálogo
              <Icon name="arrowRight" className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
            <Link
              href={`/productos/${main.slug}`}
              className="rounded-full border border-white/20 px-6 py-3.5 font-semibold text-white transition hover:bg-white/10"
            >
              Comprar {main.name}
            </Link>
          </div>
          <dl className="mt-2 grid max-w-md grid-cols-3 gap-6 border-t border-white/10 pt-6">
            {[
              ["12 meses", "de garantía"],
              ["3–7 días", "de entrega"],
              ["100%", "originales"],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="text-xl font-bold text-white">{value}</dt>
                <dd className="text-xs text-zinc-500">{label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative mx-auto w-full max-w-md">
          <Link href={`/productos/${main.slug}`} className="animate-float block">
            <PhoneImage product={main} size="lg" framed={false} />
          </Link>
          <div className="absolute bottom-10 left-0 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-xl sm:-left-6">
            <p className="text-xs text-zinc-400">{main.name}</p>
            <p className="text-lg font-bold">Desde {formatPrice(getStartingPrice(main))}</p>
          </div>
          <div className="absolute right-0 top-8 hidden flex-col gap-2 sm:flex lg:-right-10">
            {others.slice(0, 2).map((p) => (
              <Link
                key={p.id}
                href={`/productos/${p.slug}`}
                className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 py-1.5 pl-1.5 pr-4 text-sm backdrop-blur-xl transition hover:bg-white/20"
              >
                <span className="w-10"><PhoneImage product={p} size="sm" /></span>
                {p.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
