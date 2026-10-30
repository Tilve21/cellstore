"use client";

import { useState } from "react";
import { CheckoutButton } from "@/components/cart/CheckoutButton";
import { PaymentBadges } from "@/components/cart/PaymentBadges";
import { Icon } from "@/components/ui/Icon";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { storeConfig } from "@/config/store";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/types";

/** Selector de variante + cantidad, con "Agregar al carrito" y "Comprar ahora". */
export function ProductPurchase({ product }: { product: Product }) {
  const { addItem } = useCart();
  const firstAvailable = product.variants.find((v) => v.stock > 0) ?? product.variants[0];
  const [variantId, setVariantId] = useState(firstAvailable.id);
  const [quantity, setQuantity] = useState(1);

  const variant = product.variants.find((v) => v.id === variantId) ?? firstAvailable;
  const maxQty = Math.min(variant.stock, storeConfig.maxQuantityPerItem);
  const soldOut = variant.stock === 0;
  const lowStock = !soldOut && variant.stock <= 5;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-500">Precio</p>
          <p className="text-4xl font-bold tracking-tight text-zinc-900">{formatPrice(variant.price * quantity)}</p>
          {quantity > 1 && <p className="text-sm text-zinc-500">{formatPrice(variant.price)} c/u</p>}
        </div>
        <span
          className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
            soldOut ? "bg-zinc-100 text-zinc-500" : lowStock ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${soldOut ? "bg-zinc-400" : lowStock ? "bg-amber-500" : "bg-emerald-500"}`} />
          {soldOut ? "Agotado" : lowStock ? `Últimas ${variant.stock} unidades` : "En stock"}
        </span>
      </div>

      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-zinc-900">{product.category === "audifonos" ? "Versión" : "Almacenamiento"}</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {product.variants.map((v) => {
            const active = v.id === variant.id;
            return (
              <button
                key={v.id}
                type="button"
                disabled={v.stock === 0}
                aria-pressed={active}
                onClick={() => {
                  setVariantId(v.id);
                  setQuantity(1);
                }}
                className={`rounded-2xl border-2 px-4 py-3 text-left transition disabled:cursor-not-allowed disabled:opacity-40 ${
                  active ? "border-brand-600 bg-brand-50" : "border-zinc-200 hover:border-zinc-300"
                }`}
              >
                <span className="block font-semibold text-zinc-900">{v.label}</span>
                <span className="text-sm text-zinc-500">{formatPrice(v.price)}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-zinc-900">Cantidad</span>
        <QuantitySelector value={quantity} max={Math.max(maxQty, 1)} onChange={setQuantity} />
      </div>

      <div className="flex flex-col gap-3">
        <CheckoutButton items={[{ productId: product.id, variantId: variant.id, quantity }]} disabled={soldOut}>
          Comprar ahora con tarjeta
        </CheckoutButton>
        <button
          type="button"
          disabled={soldOut}
          onClick={() => addItem(product.id, variant.id, quantity)}
          className="flex items-center justify-center gap-2 rounded-full border-2 border-zinc-900 px-6 py-3.5 font-semibold text-zinc-900 transition hover:bg-zinc-900 hover:text-white disabled:opacity-40"
        >
          <Icon name="bag" className="h-4 w-4" />
          Agregar al carrito
        </button>
      </div>

      <PaymentBadges />
    </div>
  );
}
