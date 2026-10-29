import type { Metadata } from "next";
import Link from "next/link";
import { BusinessInfo, LegalPage, businessName } from "@/components/legal/LegalPage";
import { storeConfig } from "@/config/store";

export const metadata: Metadata = { title: "Términos y condiciones" };

export default function TermsPage() {
  const { withdrawalDays, warrantyMonths } = storeConfig.legal;
  const { minDays, maxDays } = storeConfig.shipping;

  return (
    <LegalPage title="Términos y condiciones">
      <p>
        Estos términos regulan las compras realizadas en {storeConfig.name}. Al hacer un pedido aceptas estas condiciones, así
        como la <Link href="/privacidad">política de tratamiento de datos</Link> y la{" "}
        <Link href="/retracto">política de devoluciones y retracto</Link>. Aplican las normas de protección al consumidor de
        Colombia, en especial la Ley 1480 de 2011 (Estatuto del Consumidor).
      </p>

      <h2>1. Quién vende</h2>
      <BusinessInfo />

      <h2>2. Productos y precios</h2>
      <ul>
        <li>Todos los equipos son nuevos, originales y se entregan sellados con factura.</li>
        <li>Los precios están en pesos colombianos (COP) e incluyen IVA. El envío estándar es gratis.</li>
        <li>
          El precio que pagas es el que aparece en el carrito al momento de la compra. Si por un error evidente un precio se
          publica de forma incorrecta, te contactaremos para confirmar o cancelar el pedido con devolución total del dinero.
        </li>
        <li>Las imágenes son ilustrativas; las especificaciones de cada ficha describen el producto que recibes.</li>
      </ul>

      <h2>3. Pago</h2>
      <p>
        Los pagos se procesan a través de Wompi (tarjetas de crédito y débito, PSE, Nequi y Bancolombia). {storeConfig.name}{" "}
        no recibe ni almacena los datos de tu tarjeta o cuenta bancaria. El pedido se confirma cuando Wompi aprueba la
        transacción.
      </p>

      <h2>4. Envío y entrega</h2>
      <p>
        Despachamos en las 24 horas hábiles siguientes a la aprobación del pago. La entrega tarda entre {minDays} y {maxDays}{" "}
        días hábiles según la ciudad. Te informaremos la guía de envío al correo que registraste. Para envíos fuera de Colombia
        te contactaremos para confirmar tiempos y condiciones antes de despachar.
      </p>

      <h2>5. Derecho de retracto y reversión del pago</h2>
      <p>
        Tienes {withdrawalDays} días hábiles desde la entrega para retractarte de la compra, y puedes solicitar la reversión
        del pago en los casos del artículo 51 de la Ley 1480. Consulta el procedimiento en{" "}
        <Link href="/retracto">Devoluciones y retracto</Link>.
      </p>

      <h2>6. Garantía</h2>
      <p>
        Todos los equipos tienen garantía de {warrantyMonths} meses contra defectos de fábrica. Durante la garantía
        repararemos el equipo sin costo; si la falla se repite, podrás elegir entre una nueva reparación, el cambio del equipo
        o la devolución del dinero, conforme a la Ley 1480. La garantía no cubre daños por golpes, humedad, manipulación por
        terceros ni el desgaste normal.
      </p>

      <h2>7. Peticiones, quejas y reclamos (PQR)</h2>
      <p>
        Escríbenos a <a href={`mailto:${storeConfig.supportEmail}`}>{storeConfig.supportEmail}</a> indicando tu número de
        pedido. Responderemos en un plazo máximo de 15 días hábiles. Si no quedas satisfecho, puedes acudir a la{" "}
        <a href="https://www.sic.gov.co" target="_blank" rel="noopener noreferrer">
          Superintendencia de Industria y Comercio
        </a>
        .
      </p>

      <h2>8. Ley aplicable</h2>
      <p>
        Estos términos se rigen por las leyes de la República de Colombia. {businessName()} puede actualizarlos; los cambios
        no afectan a los pedidos ya realizados.
      </p>
    </LegalPage>
  );
}
