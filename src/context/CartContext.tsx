"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { storeConfig } from "@/config/store";
import { cartItemKey, cartSubtotal, resolveCartItems, type ResolvedCartItem } from "@/lib/cart";
import type { CartItem } from "@/types";

const STORAGE_KEY = "phonestore-cart-v1";

interface CartContextValue {
  items: ResolvedCartItem[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (productId: string, variantId: string, quantity?: number) => void;
  updateQuantity: (productId: string, variantId: string, quantity: number) => void;
  removeItem: (productId: string, variantId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function clampQuantity(quantity: number, stock: number): number {
  return Math.max(1, Math.min(quantity, stock, storeConfig.maxQuantityPerItem));
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [rawItems, setRawItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setRawItems(JSON.parse(stored));
    } catch {
      // almacenamiento no disponible o corrupto: empezamos con carrito vacío
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rawItems));
    } catch {
      // ignorar
    }
  }, [rawItems, hydrated]);

  const items = useMemo(() => resolveCartItems(rawItems), [rawItems]);

  const addItem = useCallback((productId: string, variantId: string, quantity = 1) => {
    setRawItems((prev) => {
      const [resolved] = resolveCartItems([{ productId, variantId, quantity }]);
      if (!resolved) return prev;
      const key = cartItemKey({ productId, variantId });
      const existing = prev.find((i) => cartItemKey(i) === key);
      if (existing) {
        return prev.map((i) =>
          cartItemKey(i) === key
            ? { ...i, quantity: clampQuantity(i.quantity + quantity, resolved.variant.stock) }
            : i,
        );
      }
      return [...prev, { productId, variantId, quantity: clampQuantity(quantity, resolved.variant.stock) }];
    });
    setIsOpen(true);
  }, []);

  const updateQuantity = useCallback((productId: string, variantId: string, quantity: number) => {
    setRawItems((prev) => {
      const [resolved] = resolveCartItems([{ productId, variantId, quantity }]);
      if (!resolved) return prev;
      const key = cartItemKey({ productId, variantId });
      return prev.map((i) =>
        cartItemKey(i) === key ? { ...i, quantity: clampQuantity(quantity, resolved.variant.stock) } : i,
      );
    });
  }, []);

  const removeItem = useCallback((productId: string, variantId: string) => {
    const key = cartItemKey({ productId, variantId });
    setRawItems((prev) => prev.filter((i) => cartItemKey(i) !== key));
  }, []);

  const clearCart = useCallback(() => {
    // Se borra el storage directamente porque esto puede ejecutarse antes de la hidratación
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignorar
    }
    setRawItems([]);
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: items.reduce((n, i) => n + i.quantity, 0),
      subtotal: cartSubtotal(items),
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    }),
    [items, isOpen, addItem, updateQuantity, removeItem, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
