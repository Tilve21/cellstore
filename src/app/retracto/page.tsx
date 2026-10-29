import type { Metadata } from "next";
import { BusinessInfo, LegalPage } from "@/components/legal/LegalPage";
import { storeConfig } from "@/config/store";

export const metadata: Metadata = { title: "Devoluciones y retracto" };

export default function WithdrawalPage() {
  const { withdrawalDays, warrantyMonths } = storeConfig.legal;
  const email = storeConfig.supportEmail;

  return (
    <LegalPage title="Devoluciones, retracto y reversión del pago">
      <h2>Derecho de retracto</h2>
      <p>
        Como compraste a distancia, tienes derecho a retractarte de la compra dentro de los {withdrawalDays} días hábiles
        siguientes a la entrega del producto, sin tener que explicar el motivo (artículo 47 de la Ley 1480 de 2011).
      </p>
      <ul>
        <li>
          Escríbenos a <a href={`mailto:${email}`}>{email}</a> con tu número de pedido y la frase “ejerzo mi derecho de
          retracto”.
        </li>
        <li>Devuelve el equipo en el mismo estado en que lo recibiste, con sus accesorios, empaque y factura.</li>
        <li>Los costos de transporte de la devolución corren por tu cuenta, como lo establece la ley.</li>
        <li>
          Te reembolsamos la totalidad del dinero pagado en un plazo máximo de 30 días calendario desde que ejerces el
          retracto, por el mismo medio de pago.
        </li>
      </ul>

      <h2>Reversión del pago</h2>
      <p>
        Si pagaste con tarjeta de crédito, débito o cualquier medio electrónico, puedes pedir que se reverse el pago
        (artículo 51 de la Ley 1480 y Decreto 587 de 2016) cuando:
      </p>
      <ul>
        <li>Fuiste víctima de fraude o la compra no fue solicitada por ti.</li>
        <li>No recibiste el producto.</li>
        <li>El producto no corresponde a lo que compraste o está defectuoso.</li>
      </ul>
      <p>
        Debes presentar la queja a <a href={`mailto:${email}`}>{email}</a> y avisar al emisor de tu medio de pago (tu banco)
        dentro de los 5 días hábiles siguientes a la fecha en que conociste la situación. Si aplica, deberás devolver el
        producto en las mismas condiciones en que lo recibiste.
      </p>

      <h2>Garantía</h2>
      <p>
        Si tu equipo presenta un defecto de fábrica dentro de los {warrantyMonths} meses siguientes a la entrega, escríbenos
        para gestionar la garantía. La reparación, el transporte y los repuestos no tienen costo para ti.
      </p>

      <h2>Contacto</h2>
      <BusinessInfo />
    </LegalPage>
  );
}
