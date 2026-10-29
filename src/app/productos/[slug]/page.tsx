import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Benefits } from "@/components/home/Benefits";
import { PhoneImage } from "@/components/product/PhoneImage";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductPurchase } from "@/components/product/ProductPurchase";
import { Icon } from "@/components/ui/Icon";
import { getAllProducts, getProductBySlug } from "@/lib/products";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = getProductBySlug((await params).slug);
  return product ? { title: product.name, description: product.description } : {};
}

export default async function ProductPage({ params }: Props) {
  const product = getProductBySlug((await params).slug);
  if (!product) notFound();

  const related = getAllProducts()
    .filter((p) => p.id !== product.id)
    .sort((a, b) => Number(b.brand === product.brand) - Number(a.brand === product.brand))
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <nav className="flex items-center gap-2 text-sm text-zinc-500" aria-label="Ruta de navegación">
        <Link href="/" className="hover:text-zinc-900">Inicio</Link>
        <span>/</span>
        <Link href="/#catalogo" className="hover:text-zinc-900">{product.brand}</Link>
        <span>/</span>
        <span className="text-zinc-900">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[2rem] border border-zinc-200 bg-white p-3">
            <PhoneImage product={product} size="lg" />
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold uppercase tracking-wider text-brand-600">{product.brand}</span>
              {product.isNew && <span className="rounded-full bg-zinc-900 px-2.5 py-0.5 text-xs font-semibold text-white">Nuevo</span>}
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">{product.name}</h1>
            <p className="text-lg leading-relaxed text-zinc-600">{product.description}</p>
            <p className="flex items-center gap-2 text-sm text-zinc-500">
              <span className="h-4 w-4 rounded-full ring-1 ring-black/10" style={{ background: product.color }} />
              Color: <span className="font-medium text-zinc-800">{product.colorName}</span>
            </p>
          </div>

          <ul className="grid gap-2 sm:grid-cols-3">
            {product.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2 rounded-2xl bg-white p-3 text-sm text-zinc-700 ring-1 ring-zinc-200">
                <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                {h}
              </li>
            ))}
          </ul>

          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <ProductPurchase product={product} />
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-6">
            <Benefits compact />
          </div>

          <section>
            <h2 className="mb-4 text-xl font-bold text-zinc-900">Especificaciones</h2>
            <dl className="divide-y divide-zinc-100 overflow-hidden rounded-3xl border border-zinc-200 bg-white">
              {Object.entries(product.specs).map(([label, value]) => (
                <div key={label} className="grid grid-cols-[120px_1fr] gap-4 px-6 py-4 text-sm sm:grid-cols-[160px_1fr]">
                  <dt className="text-zinc-500">{label}</dt>
                  <dd className="font-medium text-zinc-900">{value}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </div>

      <section className="mt-24">
        <h2 className="mb-6 text-2xl font-bold tracking-tight text-zinc-900">También te puede interesar</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
