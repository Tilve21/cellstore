import Link from "next/link";
import { storeConfig } from "@/config/store";

export function Logo({ inverted = false }: { inverted?: boolean }) {
  const [first, ...rest] = storeConfig.name.split(" ");
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label={`${storeConfig.name}, inicio`}>
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-md shadow-brand-600/30">
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <rect x="7" y="3" width="10" height="18" rx="2.5" />
          <path d="M11 18h2" strokeLinecap="round" />
        </svg>
      </span>
      <span className={`text-lg font-bold tracking-tight ${inverted ? "text-white" : "text-zinc-900"}`}>
        {first}
        {rest.length > 0 && <span className="font-medium text-zinc-400"> {rest.join(" ")}</span>}
      </span>
    </Link>
  );
}
