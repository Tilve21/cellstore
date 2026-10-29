import type { Metadata } from "next";
import { CartView } from "@/components/cart/CartView";

export const metadata: Metadata = { title: "Carrito" };

export default async function CartPage({ searchParams }: { searchParams: Promise<{ cancelado?: string }> }) {
  const { cancelado } = await searchParams;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">Tu carrito</h1>
      {cancelado && (
        <p className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
          <strong className="font-semibold">El pago no se completó.</strong> No se hizo ningún cargo a tu tarjeta. Tus productos
          siguen en el carrito para cuando quieras continuar.
        </p>
      )}
      <CartView />
    </div>
  );
}
