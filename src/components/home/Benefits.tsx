import { Icon } from "@/components/ui/Icon";
import { storeConfig } from "@/config/store";

/** Franja de beneficios (envío, garantía, pago seguro...). Se configura en storeConfig.benefits. */
export function Benefits({ compact = false }: { compact?: boolean }) {
  return (
    <ul className={`grid gap-4 ${compact ? "grid-cols-2" : "grid-cols-2 lg:grid-cols-4"}`}>
      {storeConfig.benefits.map((b) => (
        <li key={b.title} className={`flex items-start gap-3 ${compact ? "" : "rounded-2xl border border-zinc-200 bg-white p-5"}`}>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <Icon name={b.icon} />
          </span>
          <div>
            <p className="text-sm font-semibold text-zinc-900">{b.title}</p>
            <p className="text-xs text-zinc-500">{b.text}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
