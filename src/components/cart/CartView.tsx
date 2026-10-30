"use client";

import Link from "next/link";
import { Benefits } from "@/components/home/Benefits";
import { Icon } from "@/components/ui/Icon";
import { useCart } from "@/context/CartContext";
import { CartLineItem } from "./CartLineItem";
import { CartSummary } from "./CartSummary";

export function CartView() {
  const { items } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-zinc-200 bg-white px-6 py-16 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 text-zinc-400">
          <Icon name="bag" className="h-7 w-7" />
        </span>
        <div>
          <p className="text-lg font-semibold text-zinc-900">Tu carrito está vacío</p>
          <p className="text-zinc-500">Agrega un producto para empezar tu compra.</p>
        </div>
        <Link href="/#catalogo" className="rounded-full bg-zinc-900 px-6 py-3 font-semibold text-white hover:bg-zinc-700">
          Ir al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <div className="flex flex-col gap-6">
        <ul className="divide-y divide-zinc-100 rounded-3xl border border-zinc-200 bg-white px-6">
          {items.map((item) => (
            <CartLineItem key={`${item.productId}-${item.variantId}`} item={item} />
          ))}
        </ul>
        <Link href="/#catalogo" className="flex w-fit items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900">
          <Icon name="arrowLeft" className="h-4 w-4" />
          Seguir comprando
        </Link>
      </div>
      <aside className="flex h-fit flex-col gap-6 lg:sticky lg:top-24">
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold">Resumen del pedido</h2>
          <CartSummary />
        </div>
        <div className="rounded-3xl border border-zinc-200 bg-white p-6">
          <Benefits compact />
        </div>
      </aside>
    </div>
  );
}
