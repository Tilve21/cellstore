"use client";

import { useEffect } from "react";
import { useCart } from "@/context/CartContext";

/** Vacía el carrito una vez confirmado el pago. */
export function ClearCartOnMount() {
  const { clearCart } = useCart();
  useEffect(() => clearCart(), [clearCart]);
  return null;
}
