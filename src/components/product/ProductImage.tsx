import Image from "next/image";
import type { CameraLayout, HeadphoneStyle, Product } from "@/types";

interface ProductImageProps {
  product: Pick<Product, "id" | "name" | "color" | "image" | "brand" | "camera" | "headphones">;
  size?: "sm" | "md" | "lg";
  /** Muestra el fondo de color suave detrás del producto */
  framed?: boolean;
  className?: string;
}

const heights = {
  sm: "h-20",
  md: "h-60",
  lg: "h-[28rem]",
};

/** Foto del producto o, si no existe, ilustración vectorial (parte trasera del teléfono o audífonos). */
export function ProductImage({ product, size = "md", framed = true, className = "" }: ProductImageProps) {
  return (
    <div
      className={`relative flex w-full items-center justify-center overflow-hidden ${size === "sm" ? "rounded-xl" : "rounded-3xl"} ${heights[size]} ${className}`}
      style={framed ? { background: `radial-gradient(circle at 50% 40%, ${hexToRgba(product.color, 0.28)}, ${hexToRgba(product.color, 0.08)} 70%)` } : undefined}
    >
      {product.image ? (
        <Image src={product.image} alt={product.name} fill sizes="(min-width: 1024px) 40vw, 90vw" className="object-contain p-6" />
      ) : product.headphones ? (
        <HeadphoneSvg product={product} style={product.headphones} />
      ) : (
        <PhoneSvg product={product} detailed={size !== "sm"} />
      )}
    </div>
  );
}

function PhoneSvg({ product, detailed }: { product: ProductImageProps["product"]; detailed: boolean }) {
  const id = `ph-${product.id}`;
  const dark = isDark(product.color);
  const logoFill = dark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.35)";

  return (
    <svg viewBox="0 0 140 260" className="h-[86%] w-auto drop-shadow-[0_24px_30px_rgba(0,0,0,0.25)]" role="img" aria-label={product.name}>
      <defs>
        <linearGradient id={`${id}-body`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={shade(product.color, 0.18)} />
          <stop offset="0.55" stopColor={product.color} />
          <stop offset="1" stopColor={shade(product.color, -0.22)} />
        </linearGradient>
        <linearGradient id={`${id}-shine`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0.28" />
          <stop offset="0.35" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${id}-lens`} cx="0.35" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#4b5563" />
          <stop offset="0.5" stopColor="#111827" />
          <stop offset="1" stopColor="#030712" />
        </radialGradient>
      </defs>

      {/* marco y cuerpo */}
      <rect x="4" y="4" width="132" height="252" rx="24" fill={shade(product.color, -0.35)} />
      <rect x="6.5" y="6.5" width="127" height="247" rx="22" fill={`url(#${id}-body)`} />
      <rect x="6.5" y="6.5" width="127" height="247" rx="22" fill={`url(#${id}-shine)`} />

      <CameraModule layout={product.camera ?? "apple"} color={product.color} lens={`url(#${id}-lens)`} />

      {detailed && (
        <text x="70" y="215" textAnchor="middle" fontSize="9" fontWeight="600" letterSpacing="1.5" fill={logoFill} fontFamily="system-ui, sans-serif">
          {product.brand.toUpperCase()}
        </text>
      )}
    </svg>
  );
}

function Lens({ cx, cy, r, fill }: { cx: number; cy: number; r: number; fill: string }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r + 1.6} fill="rgba(0,0,0,0.35)" />
      <circle cx={cx} cy={cy} r={r} fill={fill} />
      <circle cx={cx - r * 0.3} cy={cy - r * 0.3} r={r * 0.22} fill="#fff" opacity="0.35" />
    </g>
  );
}

function CameraModule({ layout, color, lens }: { layout: CameraLayout; color: string; lens: string }) {
  const plate = shade(color, -0.12);
  switch (layout) {
    case "apple-pro":
      return (
        <g>
          <rect x="14" y="14" width="62" height="64" rx="16" fill={plate} stroke="rgba(0,0,0,0.15)" />
          <Lens cx={31} cy={31} r={10} fill={lens} />
          <Lens cx={31} cy={61} r={10} fill={lens} />
          <Lens cx={59} cy={46} r={10} fill={lens} />
          <circle cx="60" cy="24" r="3" fill="#f5f5f4" opacity="0.8" />
        </g>
      );
    case "apple":
      return (
        <g>
          <rect x="14" y="14" width="36" height="66" rx="18" fill={plate} stroke="rgba(0,0,0,0.15)" />
          <Lens cx={32} cy={32} r={10} fill={lens} />
          <Lens cx={32} cy={62} r={10} fill={lens} />
          <circle cx="58" cy="30" r="3" fill="#f5f5f4" opacity="0.8" />
        </g>
      );
    case "samsung":
      return (
        <g>
          <Lens cx={28} cy={28} r={9} fill={lens} />
          <Lens cx={28} cy={52} r={9} fill={lens} />
          <Lens cx={28} cy={76} r={9} fill={lens} />
          <Lens cx={50} cy={34} r={5} fill={lens} />
          <circle cx="50" cy="52" r="2.5" fill="#f5f5f4" opacity="0.8" />
        </g>
      );
    case "pixel":
      return (
        <g>
          <rect x="6.5" y="34" width="127" height="34" rx="17" fill={shade(color, -0.4)} />
          <rect x="22" y="38" width="62" height="26" rx="13" fill="#030712" />
          <Lens cx={36} cy={51} r={8} fill={lens} />
          <Lens cx={58} cy={51} r={8} fill={lens} />
          <Lens cx={98} cy={51} r={8} fill={lens} />
          <circle cx="116" cy="51" r="2.5" fill="#f5f5f4" opacity="0.8" />
        </g>
      );
    case "xiaomi":
      return (
        <g>
          <rect x="14" y="14" width="64" height="64" rx="14" fill={shade(color, -0.45)} />
          <Lens cx={32} cy={32} r={10} fill={lens} />
          <Lens cx={60} cy={32} r={10} fill={lens} />
          <Lens cx={32} cy={60} r={10} fill={lens} />
          <circle cx="60" cy="60" r="4" fill="#f5f5f4" opacity="0.7" />
          <text x="60" y="73" textAnchor="middle" fontSize="4" fill="rgba(255,255,255,0.6)" fontFamily="system-ui">LEICA</text>
        </g>
      );
    case "moto":
      return (
        <g>
          <rect x="14" y="14" width="40" height="78" rx="12" fill={plate} stroke="rgba(0,0,0,0.15)" />
          <Lens cx={34} cy={32} r={10} fill={lens} />
          <Lens cx={34} cy={56} r={8} fill={lens} />
          <Lens cx={34} cy={77} r={7} fill={lens} />
        </g>
      );
  }
}

function HeadphoneSvg({ product, style }: { product: ProductImageProps["product"]; style: HeadphoneStyle }) {
  const id = `hp-${product.id}`;
  const body = `url(#${id}-body)`;

  return (
    <svg viewBox="0 0 200 200" className="h-[72%] w-auto drop-shadow-[0_24px_30px_rgba(0,0,0,0.25)]" role="img" aria-label={product.name}>
      <defs>
        <linearGradient id={`${id}-body`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={shade(product.color, 0.22)} />
          <stop offset="0.55" stopColor={product.color} />
          <stop offset="1" stopColor={shade(product.color, -0.25)} />
        </linearGradient>
      </defs>
      {style === "over-ear" && <OverEar color={product.color} body={body} />}
      {style === "stem" && <StemBuds color={product.color} body={body} />}
      {style === "buds" && <RoundBuds color={product.color} body={body} />}
    </svg>
  );
}

function OverEar({ color, body }: { color: string; body: string }) {
  return (
    <g>
      {/* diadema */}
      <path d="M38 112 C38 40 162 40 162 112" fill="none" stroke={shade(color, -0.3)} strokeWidth="14" strokeLinecap="round" />
      <path d="M38 112 C38 40 162 40 162 112" fill="none" stroke={body} strokeWidth="9" strokeLinecap="round" />
      {/* copas */}
      {[44, 156].map((cx) => (
        <g key={cx}>
          <rect x={cx - 20} y="100" width="40" height="66" rx="20" fill={shade(color, -0.45)} />
          <rect x={cx - 16} y="104" width="32" height="58" rx="16" fill={body} />
          <rect x={cx - 3} y="92" width="6" height="14" rx="3" fill={shade(color, -0.3)} />
        </g>
      ))}
    </g>
  );
}

function StemBuds({ color, body }: { color: string; body: string }) {
  return (
    <g>
      {/* estuche */}
      <rect x="54" y="118" width="92" height="66" rx="26" fill={shade(color, -0.12)} />
      <rect x="57" y="121" width="86" height="60" rx="24" fill={body} />
      <line x1="58" y1="140" x2="142" y2="140" stroke="rgba(0,0,0,0.15)" strokeWidth="1.2" />
      <circle cx="100" cy="158" r="2.5" fill="#22c55e" opacity="0.8" />
      {/* audífonos */}
      {[
        { x: 74, flip: 1 },
        { x: 126, flip: -1 },
      ].map(({ x, flip }) => (
        <g key={x} transform={`translate(${x} 22) scale(${flip} 1)`}>
          <ellipse cx="0" cy="22" rx="18" ry="20" fill={body} stroke="rgba(0,0,0,0.12)" />
          <ellipse cx="9" cy="16" rx="7" ry="8" fill={shade(color, -0.35)} />
          <rect x="-8" y="34" width="13" height="58" rx="6.5" fill={body} stroke="rgba(0,0,0,0.12)" />
          <rect x="-5" y="84" width="7" height="5" rx="2.5" fill="rgba(0,0,0,0.25)" />
        </g>
      ))}
    </g>
  );
}

function RoundBuds({ color, body }: { color: string; body: string }) {
  return (
    <g>
      {/* estuche abierto */}
      <path d="M42 108 C42 76 158 76 158 108 Z" fill={shade(color, -0.25)} />
      <rect x="40" y="108" width="120" height="62" rx="28" fill={body} />
      <ellipse cx="100" cy="108" rx="58" ry="7" fill={shade(color, -0.5)} />
      <circle cx="100" cy="150" r="2.5" fill="#f5f5f4" opacity="0.7" />
      {/* audífonos */}
      {[72, 128].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="58" r="22" fill={body} stroke="rgba(0,0,0,0.2)" />
          <circle cx={cx} cy="58" r="12" fill={shade(color, -0.4)} />
          <circle cx={cx - 5} cy="52" r="4" fill="#fff" opacity="0.2" />
        </g>
      ))}
    </g>
  );
}

/* ---------- utilidades de color ---------- */

function parseHex(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** amount > 0 aclara, amount < 0 oscurece */
function shade(hex: string, amount: number): string {
  const [r, g, b] = parseHex(hex);
  const mix = (c: number) => Math.round(amount >= 0 ? c + (255 - c) * amount : c * (1 + amount));
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
}

function hexToRgba(hex: string, alpha: number): string {
  const [r, g, b] = parseHex(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function isDark(hex: string): boolean {
  const [r, g, b] = parseHex(hex);
  return 0.299 * r + 0.587 * g + 0.114 * b < 150;
}
