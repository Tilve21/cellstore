import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { formatPrice } from "@/lib/format";
import { getStartingPrice } from "@/lib/products";
import type { Product } from "@/types";
import { PhoneImage } from "./PhoneImage";

export function ProductCard({ product }: { product: Product }) {
  const inStock = product.variants.some((v) => v.stock > 0);

  return (
    <Link
      href={`/productos/${product.slug}`}
      className="group flex flex-col rounded-3xl border border-zinc-200 bg-white p-3 transition duration-300 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.25)]"
    >
      <div className="relative">
        <PhoneImage product={product} className="transition duration-500 group-hover:[&_svg]:scale-105 [&_svg]:transition [&_svg]:duration-500" />
        <div className="absolute left-3 top-3 flex gap-1.5">
          {product.isNew && (
            <span className="rounded-full bg-zinc-900 px-2.5 py-1 text-[11px] font-semibold text-white">Nuevo</span>
          )}
          {!inStock && (
            <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-zinc-500">Agotado</span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1 px-2 pb-2 pt-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">{product.brand}</span>
          <span className="flex items-center gap-1.5 text-xs text-zinc-500">
            <span className="h-3 w-3 rounded-full ring-1 ring-black/10" style={{ background: product.color }} />
            {product.colorName}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-zinc-900">{product.name}</h3>
        <p className="line-clamp-2 text-sm text-zinc-500">{product.description}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {product.variants.map((v) => (
            <span key={v.id} className="rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600">
              {v.label}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-end justify-between pt-5">
          <div>
            <span className="text-xs text-zinc-400">Desde</span>
            <p className="text-xl font-bold tracking-tight text-zinc-900">{formatPrice(getStartingPrice(product))}</p>
          </div>
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-white transition group-hover:bg-brand-600">
            <Icon name="arrowRight" className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
