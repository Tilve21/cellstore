/**
 * Configuración general de la tienda. Cambia aquí nombre, moneda, envíos y textos.
 */
export const storeConfig = {
  name: "Phone Store",
  tagline: "Celulares originales, con garantía y envío rápido",
  /** Debe coincidir con --color-brand-600 en globals.css; se usa en la página de pago de Stripe */
  brandColor: "#5b45f5",
  /** Código ISO 4217 en minúsculas, debe estar habilitado en tu cuenta de Stripe */
  currency: (process.env.NEXT_PUBLIC_CURRENCY ?? "usd").toLowerCase(),
  locale: process.env.NEXT_PUBLIC_LOCALE ?? "es-US",
  /** Países a los que se permite enviar (ISO 3166-1 alpha-2) */
  shippingCountries: (process.env.SHIPPING_COUNTRIES ?? "US,MX,CO,CL,PE,AR,EC,ES")
    .split(",")
    .map((c) => c.trim().toUpperCase()),
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
    { icon: "lock", title: "Pago 100% seguro", text: "Tarjetas de crédito y débito" },
    { icon: "badge", title: "Originales y sellados", text: "Equipos nuevos de fábrica" },
  ],
} as const;

export type BenefitIcon = (typeof storeConfig.benefits)[number]["icon"];
