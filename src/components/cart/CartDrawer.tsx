"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Icon } from "@/components/ui/Icon";
import { useCart } from "@/context/CartContext";
import { CartLineItem } from "./CartLineItem";
import { CartSummary } from "./CartSummary";

export function CartDrawer() {
  const { items, count, isOpen, closeCart } = useCart();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeCart();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeCart]);

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? "" : "pointer-events-none"}`} aria-hidden={!isOpen} inert={!isOpen}>
      <div
        className={`absolute inset-0 bg-zinc-950/50 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
        onClick={closeCart}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b border-zinc-100 px-6 py-5">
          <h2 className="text-lg font-bold text-zinc-900">
            Tu carrito {count > 0 && <span className="font-normal text-zinc-400">({count})</span>}
          </h2>
          <button onClick={closeCart} className="rounded-full p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900" aria-label="Cerrar carrito">
            <Icon name="close" />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 text-zinc-400">
              <Icon name="bag" className="h-7 w-7" />
            </span>
            <div>
              <p className="font-semibold text-zinc-900">Tu carrito está vacío</p>
              <p className="text-sm text-zinc-500">Explora el catálogo y encuentra tu próximo celular o audífonos.</p>
            </div>
            <Link href="/#catalogo" onClick={closeCart} className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-700">
              Ver catálogo
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-zinc-100 overflow-y-auto px-6">
              {items.map((item) => (
                <CartLineItem key={`${item.productId}-${item.variantId}`} item={item} onNavigate={closeCart} />
              ))}
            </ul>
            <footer className="flex flex-col gap-3 border-t border-zinc-100 bg-zinc-50/80 p-6">
              <CartSummary />
              <Link href="/carrito" onClick={closeCart} className="text-center text-sm font-medium text-zinc-500 hover:text-zinc-900">
                Ver carrito completo
              </Link>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
