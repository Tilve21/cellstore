/**
 * Configuración general de la tienda. Cambia aquí nombre, moneda, envíos y textos.
 */
export const storeConfig = {
  name: "Phone Store",
  tagline: "Celulares originales, con garantía y envío rápido",
  /** Debe coincidir con --color-brand-600 en globals.css */
  brandColor: "#5b45f5",
  /** Wompi solo cobra en pesos colombianos; los precios de src/data/products.ts están en COP */
  currency: "COP",
  locale: "es-CO",
  shipping: {
    label: "Envío estándar gratis",
    minDays: 3,
    maxDays: 7,
  },
  maxQuantityPerItem: 5,
  supportEmail: "ventas@phonestore.com",
  /** Beneficios que se muestran en home, ficha de producto y carrito */
  benefits: [
    { icon: "truck", title: "Envío gratis", text: "Entrega en 3 a 7 días hábiles" },
    { icon: "shield", title: "Garantía de 12 meses", text: "En todos nuestros equipos" },
    { icon: "lock", title: "Pago 100% seguro", text: "Tarjetas, PSE y Nequi" },
    { icon: "badge", title: "Originales y sellados", text: "Equipos nuevos de fábrica" },
  ],
} as const;

export type BenefitIcon = (typeof storeConfig.benefits)[number]["icon"];
