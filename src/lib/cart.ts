import { getProductById, getVariant } from "@/lib/products";
import type { CartItem, Product, ProductVariant } from "@/types";

export interface ResolvedCartItem extends CartItem {
  product: Product;
  variant: ProductVariant;
  lineTotal: number;
}

export function cartItemKey(item: Pick<CartItem, "productId" | "variantId">): string {
  return `${item.productId}::${item.variantId}`;
}

/** Une los items del carrito con los datos del catálogo y descarta los que ya no existen. */
export function resolveCartItems(items: CartItem[]): ResolvedCartItem[] {
  return items.flatMap((item) => {
    const product = getProductById(item.productId);
    const variant = product && getVariant(product, item.variantId);
    if (!product || !variant) return [];
    return [{ ...item, product, variant, lineTotal: variant.price * item.quantity }];
  });
}

export function cartSubtotal(items: ResolvedCartItem[]): number {
  return items.reduce((sum, i) => sum + i.lineTotal, 0);
}
