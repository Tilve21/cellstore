interface QuantitySelectorProps {
  value: number;
  min?: number;
  max: number;
  onChange: (value: number) => void;
  size?: "sm" | "md";
}

export function QuantitySelector({ value, min = 1, max, onChange, size = "md" }: QuantitySelectorProps) {
  const btn = size === "sm" ? "h-8 w-8 text-base" : "h-10 w-10 text-lg";
  return (
    <div className="inline-flex items-center rounded-full bg-zinc-100 p-1">
      <button
        type="button"
        className={`${btn} rounded-full text-zinc-700 transition hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:shadow-none`}
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label="Disminuir cantidad"
      >
        −
      </button>
      <span className="min-w-9 text-center text-sm font-semibold tabular-nums" aria-live="polite">{value}</span>
      <button
        type="button"
        className={`${btn} rounded-full text-zinc-700 transition hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:shadow-none`}
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Aumentar cantidad"
      >
        +
      </button>
    </div>
  );
}
