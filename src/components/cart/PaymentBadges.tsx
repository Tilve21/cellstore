import { Icon } from "@/components/ui/Icon";

const cards = [
  { name: "Visa", className: "font-black italic tracking-tight text-[#1a1f71]" },
  { name: "Mastercard", dots: true },
  { name: "AMEX", className: "font-black tracking-tight text-[#2e77bb]" },
];

/** Logos de tarjetas aceptadas + sello de Wompi. */
export function PaymentBadges({ variant = "light" }: { variant?: "light" | "dark" }) {
  return (
    <div className={`flex flex-col gap-2 text-xs ${variant === "dark" ? "text-zinc-400" : "items-center text-zinc-500"}`}>
      <div className="flex gap-1.5">
        {cards.map((c) => (
          <span
            key={c.name}
            className="flex h-7 min-w-11 items-center justify-center rounded-md border border-zinc-200 bg-white px-2 text-[11px]"
            aria-label={c.name}
          >
            {c.dots ? (
              <span className="flex" aria-hidden>
                <span className="h-3.5 w-3.5 rounded-full bg-[#eb001b]" />
                <span className="-ml-1.5 h-3.5 w-3.5 rounded-full bg-[#f79e1b] mix-blend-multiply" />
              </span>
            ) : (
              <span className={c.className}>{c.name.toUpperCase()}</span>
            )}
          </span>
        ))}
      </div>
      <p className="flex items-center gap-1.5">
        <Icon name="lock" className="h-3.5 w-3.5" />
        Pago seguro con Wompi · Tarjetas, PSE y Nequi
      </p>
    </div>
  );
}
