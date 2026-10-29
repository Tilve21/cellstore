"use client";

import { storeConfig } from "@/config/store";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import { CheckoutButton } from "./CheckoutButton";
import { PaymentBadges } from "./PaymentBadges";

export function CartSummary() {
  const { items, subtotal } = useCart();
  const { minDays, maxDays } = storeConfig.shipping;

  return (
    <div className="flex flex-col gap-4">
      <dl className="flex flex-col gap-2 text-sm">
        <div className="flex justify-between text-zinc-600">
          <dt>Subtotal</dt>
          <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex justify-between text-zinc-600">
          <dt>
            Envío <span className="text-zinc-400">({minDays}–{maxDays} días hábiles)</span>
          </dt>
          <dd className="font-semibold text-emerald-600">Gratis</dd>
        </div>
        <div className="mt-1 flex items-baseline justify-between border-t border-zinc-200 pt-3">
          <dt className="font-semibold text-zinc-900">Total</dt>
          <dd className="text-2xl font-bold tracking-tight text-zinc-900 tabular-nums">{formatPrice(subtotal)}</dd>
        </div>
      </dl>
      <CheckoutButton items={items} />
      <PaymentBadges />
    </div>
  );
}
