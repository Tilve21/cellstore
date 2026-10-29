"use client";

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
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || loading || items.length === 0}
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
