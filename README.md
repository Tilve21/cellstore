# Phone Store — Tienda de celulares

Next.js 15 (App Router) + TypeScript + Tailwind + Stripe Checkout (pago con tarjeta).

## Puesta en marcha

```bash
npm install
cp .env.example .env.local   # y completa las claves
npm run dev                  # http://localhost:3000
```

### Claves de Stripe
1. Entra a https://dashboard.stripe.com/apikeys y copia la **Secret key** en `STRIPE_SECRET_KEY`.
   - `sk_test_...` → modo prueba (tarjeta `4242 4242 4242 4242`, cualquier fecha futura y CVC).
   - `sk_live_...` → cobros reales (requiere cuenta activada).
2. Webhook (confirmación confiable del pago):
   - **Local:** `stripe listen --forward-to localhost:3000/api/webhooks/stripe` y copia el `whsec_...`.
   - **Producción:** Dashboard → Developers → Webhooks → endpoint `https://tu-dominio.com/api/webhooks/stripe`
     con los eventos `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`.
3. En producción pon `NEXT_PUBLIC_SITE_URL=https://tu-dominio.com`.

## Estructura

```
src/
  app/
    page.tsx                    Home: hero + catálogo
    productos/[slug]/page.tsx   Detalle del producto
    carrito/page.tsx            Carrito completo
    checkout/exito/page.tsx     Confirmación (lee la sesión de Stripe)
    api/checkout/route.ts       Crea la sesión de Stripe Checkout
    api/webhooks/stripe/route.ts Recibe eventos de pago (fulfillOrder)
  components/
    layout/  home/  product/  cart/  ui/
  config/store.ts               Nombre, moneda, países de envío
  context/CartContext.tsx       Estado del carrito (persistido en localStorage)
  data/products.ts              Catálogo y precios (fuente de verdad)
  lib/                          Stripe, formato de precios, helpers
  services/checkout.ts          Cliente → /api/checkout → redirección
```

## Seguridad del pago
- El navegador solo envía `productId`, `variantId` y `cantidad`; **los precios se calculan en el servidor** desde `src/data/products.ts`.
- Los datos de la tarjeta nunca pasan por este servidor: los captura Stripe en su página alojada (PCI cumplido).

## Personalizar
- **Productos/precios:** `src/data/products.ts`. Para fotos reales, coloca la imagen en `public/products/` y añade `image: "/products/archivo.png"`.
- **Moneda:** `NEXT_PUBLIC_CURRENCY` (los precios del catálogo deben estar en esa moneda).
- **Post-pago:** implementa `fulfillOrder` en `src/app/api/webhooks/stripe/route.ts` (guardar pedido, descontar stock, email).
