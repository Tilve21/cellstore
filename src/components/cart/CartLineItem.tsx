"use client";

import Link from "next/link";
import { PhoneImage } from "@/components/product/PhoneImage";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { storeConfig } from "@/config/store";
import { useCart } from "@/context/CartContext";
import type { ResolvedCartItem } from "@/lib/cart";
import { formatPrice } from "@/lib/format";

export function CartLineItem({ item, onNavigate }: { item: ResolvedCartItem; onNavigate?: () => void }) {
  const { updateQuantity, removeItem } = useCart();
  const max = Math.min(item.variant.stock, storeConfig.maxQuantityPerItem);

  return (
    <li className="flex gap-4 py-5">
      <Link href={`/productos/${item.product.slug}`} onClick={onNavigate} className="w-20 shrink-0">
        <PhoneImage product={item.product} size="sm" className="!h-24" />
      </Link>
      <div className="flex flex-1 flex-col justify-between gap-2">
        <div className="flex justify-between gap-2">
          <div>
            <Link href={`/productos/${item.product.slug}`} onClick={onNavigate} className="font-semibold text-zinc-900 hover:text-brand-600">
              {item.product.name}
            </Link>
            <p className="text-sm text-zinc-500">
              {item.variant.label} · {item.product.colorName}
            </p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-zinc-900">{formatPrice(item.lineTotal)}</p>
            {item.quantity > 1 && <p className="text-xs text-zinc-400">{formatPrice(item.variant.price)} c/u</p>}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <QuantitySelector
            size="sm"
            value={item.quantity}
            max={max}
            onChange={(q) => updateQuantity(item.productId, item.variantId, q)}
          />
          <button
            type="button"
            onClick={() => removeItem(item.productId, item.variantId)}
            className="text-sm text-zinc-400 transition hover:text-red-600"
          >
            Eliminar
          </button>
        </div>
      </div>
    </li>
  );
}
