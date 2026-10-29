export type Brand = "Apple" | "Samsung" | "Xiaomi" | "Motorola" | "Google";

/** Estilo del módulo de cámara para la ilustración del producto */
export type CameraLayout = "apple-pro" | "apple" | "samsung" | "pixel" | "xiaomi" | "moto";

export interface ProductVariant {
  /** Identificador único dentro del producto, p. ej. "128gb" */
  id: string;
  /** Texto visible, p. ej. "128 GB" */
  label: string;
  /** Precio en unidades mayores de la moneda (p. ej. 999.99) */
  price: number;
  stock: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: Brand;
  description: string;
  highlights: string[];
  specs: Record<string, string>;
  variants: ProductVariant[];
  /** Color principal usado en la ilustración cuando no hay imagen */
  color: string;
  /** Nombre comercial del color, p. ej. "Titanio Desierto" */
  colorName: string;
  camera: CameraLayout;
  /** Ruta opcional a una foto real dentro de /public, p. ej. "/products/iphone.png" */
  image?: string;
  featured?: boolean;
  isNew?: boolean;
}

export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
}

/** Payload que el cliente envía a /api/checkout. Nunca incluye precios. */
export interface CheckoutRequest {
  items: CartItem[];
}
