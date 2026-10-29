# Phone Store — Tienda de celulares

Next.js 15 (App Router) + TypeScript + Tailwind + Wompi Web Checkout (tarjetas, PSE, Nequi y Bancolombia, en COP).

## Puesta en marcha

```bash
npm install
cp .env.example .env.local   # y completa las claves
npm run dev                  # http://localhost:3000
```

### Llaves de Wompi
En el dashboard de Wompi → **Desarrolladores**:
1. **Llave pública** → `WOMPI_PUBLIC_KEY` (`pub_test_...` pruebas, `pub_prod_...` cobros reales).
2. **Secreto de integridad** → `WOMPI_INTEGRITY_SECRET`.
3. **Secreto de eventos** → `WOMPI_EVENTS_SECRET`.
4. **URL de Eventos:** `https://tu-dominio.com/api/webhooks/wompi` (confirmación confiable del pago).
5. En producción pon `NEXT_PUBLIC_SITE_URL=https://tu-dominio.com`.

Tarjeta de prueba aprobada: `4242 4242 4242 4242` (rechazada: `4111 1111 1111 1111`), cualquier fecha futura y CVC.

## Estructura

```
src/
  app/
    page.tsx                    Home: hero + catálogo
    productos/[slug]/page.tsx   Detalle del producto
    carrito/page.tsx            Carrito completo
    checkout/exito/page.tsx     Resultado del pago (consulta la transacción en Wompi)
    api/checkout/route.ts       Firma el pago y devuelve la URL del Web Checkout
    api/webhooks/wompi/route.ts Recibe eventos de pago (fulfillOrder)
  components/
    layout/  home/  product/  cart/  ui/
  config/store.ts               Nombre, moneda (COP), textos
  context/CartContext.tsx       Estado del carrito (persistido en localStorage)
  data/products.ts              Catálogo y precios (fuente de verdad)
  lib/                          Wompi, formato de precios, helpers
  services/checkout.ts          Cliente → /api/checkout → redirección
```

## Seguridad del pago
- El navegador solo envía `productId`, `variantId` y `cantidad`; **los precios se calculan en el servidor** desde `src/data/products.ts`.
- Los datos de la tarjeta nunca pasan por este servidor: los captura Wompi en su checkout alojado. El monto va firmado con el secreto de integridad, así que no se puede alterar.

## Personalizar
- **Productos/precios:** `src/data/products.ts`. Para fotos reales, coloca la imagen en `public/products/` y añade `image: "/products/archivo.png"`.
- **Moneda:** Wompi solo cobra en COP; los precios de `src/data/products.ts` están en pesos.
- **Post-pago:** implementa `fulfillOrder` en `src/app/api/webhooks/wompi/route.ts` (guardar pedido, descontar stock, email).
