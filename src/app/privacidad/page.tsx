import type { Metadata } from "next";
import { BusinessInfo, LegalPage, businessName } from "@/components/legal/LegalPage";
import { storeConfig } from "@/config/store";

export const metadata: Metadata = { title: "Política de tratamiento de datos" };

export default function PrivacyPage() {
  const email = storeConfig.supportEmail;

  return (
    <LegalPage title="Política de tratamiento de datos personales">
      <p>
        Esta política cumple la Ley 1581 de 2012 y el Decreto 1074 de 2015, y explica cómo {businessName()} recolecta, usa y
        protege tus datos personales.
      </p>

      <h2>1. Responsable del tratamiento</h2>
      <BusinessInfo />

      <h2>2. Datos que recolectamos</h2>
      <ul>
        <li>Nombre, correo electrónico, teléfono y dirección de envío que ingresas al pagar.</li>
        <li>
          Datos de la transacción (referencia, monto, medio de pago y estado). Los datos de tu tarjeta o cuenta bancaria los
          procesa Wompi y nunca llegan a nosotros.
        </li>
        <li>El contenido de tu carrito, que se guarda solo en tu navegador.</li>
      </ul>
      <p>No recolectamos datos sensibles ni datos de menores de edad.</p>

      <h2>3. Para qué los usamos</h2>
      <ul>
        <li>Procesar tu pedido, el pago y el envío.</li>
        <li>Enviarte la confirmación, la guía de envío y responder tus solicitudes.</li>
        <li>Gestionar garantías, devoluciones, retractos y reversiones de pago.</li>
        <li>Cumplir obligaciones contables, tributarias y legales.</li>
      </ul>

      <h2>4. Con quién los compartimos</h2>
      <p>
        Solo con los proveedores necesarios para operar la tienda, que actúan como encargados del tratamiento: Wompi
        (procesamiento de pagos), la empresa transportadora (entrega) y Netlify (alojamiento del sitio web, con servidores
        fuera de Colombia). No vendemos ni cedemos tus datos a terceros.
      </p>

      <h2>5. Tus derechos</h2>
      <ul>
        <li>Conocer, actualizar y rectificar tus datos.</li>
        <li>Pedir prueba de la autorización que nos diste.</li>
        <li>Saber qué uso le hemos dado a tus datos.</li>
        <li>Revocar la autorización o pedir que eliminemos tus datos, salvo que debamos conservarlos por ley.</li>
        <li>Presentar quejas ante la Superintendencia de Industria y Comercio.</li>
      </ul>

      <h2>6. Cómo ejercerlos</h2>
      <p>
        Escribe a <a href={`mailto:${email}`}>{email}</a> con tu nombre, documento y la solicitud. Atendemos las consultas
        en un máximo de 10 días hábiles y los reclamos en un máximo de 15 días hábiles, según los artículos 14 y 15 de la Ley
        1581 de 2012.
      </p>

      <h2>7. Autorización y vigencia</h2>
      <p>
        Al marcar la casilla de aceptación antes de pagar autorizas el tratamiento de tus datos para las finalidades
        descritas. Conservamos los datos mientras sea necesario para esas finalidades y para cumplir obligaciones legales.
        Esta política rige desde el {storeConfig.legal.updatedAt}.
      </p>
    </LegalPage>
  );
}
