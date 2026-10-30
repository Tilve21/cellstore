/**
 * Configuración general de la tienda. Cambia aquí nombre, moneda, envíos y textos.
 */
export const storeConfig = {
  name: "Phone Store",
  tagline: "Celulares y audífonos originales, con garantía y envío rápido",
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
  /**
   * Datos del responsable que exige la Ley 1480 (art. 50) y la Ley 1581 de 2012.
   * Completa los campos vacíos antes de vender: se muestran en el footer y en las páginas legales.
   */
  legal: {
    /** Nombre de la persona natural o razón social */
    businessName: "",
    /** NIT o cédula */
    taxId: "",
    address: "",
    city: "",
    phone: "",
    /** Fecha de la última actualización de las políticas */
    updatedAt: "29 de octubre de 2026",
    /** Días hábiles para ejercer el derecho de retracto (mínimo legal: 5) */
    withdrawalDays: 5,
    warrantyMonths: 12,
  },
  /** Beneficios que se muestran en home, ficha de producto y carrito */
  benefits: [
    { icon: "truck", title: "Envío gratis", text: "Entrega en 3 a 7 días hábiles" },
    { icon: "shield", title: "Garantía de 12 meses", text: "En todos nuestros equipos" },
    { icon: "lock", title: "Pago 100% seguro", text: "Tarjetas, PSE y Nequi" },
    { icon: "badge", title: "Originales y sellados", text: "Equipos nuevos de fábrica" },
  ],
} as const;

export type BenefitIcon = (typeof storeConfig.benefits)[number]["icon"];
