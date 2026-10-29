"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { redirectToCheckout } from "@/services/checkout";
import type { CartItem } from "@/types";

interface CheckoutButtonProps {
  items: CartItem[];
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

/** Prepara el pago en /api/checkout y redirige al Web Checkout de Wompi. */
export function CheckoutButton({ items, disabled, className = "", children = "Ir a pagar" }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Autorización de tratamiento de datos (Ley 1581) y aceptación de términos antes de pagar
  const [accepted, setAccepted] = useState(false);

  async function handleClick() {
    setLoading(true);
    setError(null);
    try {
      await redirectToCheckout(items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error inesperado");
      setLoading(false);
    }
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="flex items-start gap-2 text-xs leading-relaxed text-zinc-500">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-brand-600"
        />
        <span>
          Acepto los{" "}
          <Link href="/terminos" target="_blank" className="font-medium text-zinc-700 underline">
            términos y condiciones
          </Link>{" "}
          y autorizo el{" "}
          <Link href="/privacidad" target="_blank" className="font-medium text-zinc-700 underline">
            tratamiento de mis datos personales
          </Link>
          .
        </span>
      </label>
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || loading || !accepted || items.length === 0}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-brand-500 px-6 py-4 font-semibold text-white shadow-lg shadow-brand-600/30 transition hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            Abriendo pago seguro…
          </>
        ) : (
          <>
            <Icon name="lock" className="h-4 w-4" />
            {children}
          </>
        )}
      </button>
      {error && (
        <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-center text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
