"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { storeConfig } from "@/config/store";
import { useCart } from "@/context/CartContext";
import { Logo } from "./Logo";

export function Header() {
  const { count, openCart } = useCart();

  return (
    <>
      <div className="bg-zinc-950 text-center text-xs font-medium text-zinc-300">
        <p className="mx-auto max-w-7xl px-4 py-2">
          <span className="text-white">{storeConfig.shipping.label}</span> · Paga con tarjeta, PSE o Nequi
        </p>
      </div>
      <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <nav className="flex items-center gap-1 text-sm font-medium text-zinc-600 sm:gap-2">
            <Link href="/#catalogo" className="hidden rounded-full px-4 py-2 transition hover:bg-zinc-100 hover:text-zinc-900 sm:inline">
              Catálogo
            </Link>
            <Link href="/#beneficios" className="hidden rounded-full px-4 py-2 transition hover:bg-zinc-100 hover:text-zinc-900 md:inline">
              Garantía y envíos
            </Link>
            <button
              onClick={openCart}
              className="relative ml-2 flex items-center gap-2 rounded-full bg-zinc-900 py-2 pl-3 pr-4 text-white transition hover:bg-zinc-700"
              aria-label={`Abrir carrito (${count} productos)`}
            >
              <Icon name="bag" className="h-4 w-4" />
              Carrito
              {count > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-500 px-1.5 text-[11px] font-bold">
                  {count}
                </span>
              )}
            </button>
          </nav>
        </div>
      </header>
    </>
  );
}
