"use client";

import { useMemo, useState } from "react";
import { getStartingPrice } from "@/lib/products";
import type { Brand, Category, Product } from "@/types";
import { ProductCard } from "./ProductCard";

type SortOption = "featured" | "price-asc" | "price-desc";

const categories: { id: Category | "all"; label: string }[] = [
  { id: "all", label: "Todo" },
  { id: "celulares", label: "Celulares" },
  { id: "audifonos", label: "Audífonos" },
];

export function ProductCatalog({ products }: { products: Product[] }) {
  const [category, setCategory] = useState<Category | "all">("all");
  const [brand, setBrand] = useState<Brand | "all">("all");
  const [sort, setSort] = useState<SortOption>("featured");

  const inCategory = useMemo(
    () => (category === "all" ? products : products.filter((p) => p.category === category)),
    [products, category],
  );
  const brands = useMemo(() => Array.from(new Set(inCategory.map((p) => p.brand))), [inCategory]);

  const visible = useMemo(() => {
    const filtered = brand === "all" ? inCategory : inCategory.filter((p) => p.brand === brand);
    if (sort === "featured") return filtered;
    return [...filtered].sort((a, b) =>
      sort === "price-asc" ? getStartingPrice(a) - getStartingPrice(b) : getStartingPrice(b) - getStartingPrice(a),
    );
  }, [inCategory, brand, sort]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex w-fit gap-1 rounded-full bg-zinc-100 p-1" role="group" aria-label="Filtrar por categoría">
        {categories.map((c) => {
          const active = category === c.id;
          return (
            <button
              key={c.id}
              onClick={() => {
                setCategory(c.id);
                setBrand("all");
              }}
              aria-pressed={active}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                active ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Filtrar por marca">
          {(["all", ...brands] as const).map((b) => {
            const active = brand === b;
            const count = b === "all" ? inCategory.length : inCategory.filter((p) => p.brand === b).length;
            return (
              <button
                key={b}
                onClick={() => setBrand(b)}
                aria-pressed={active}
                className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
                  active ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400"
                }`}
              >
                {b === "all" ? "Todas" : b}
                <span className={`text-xs ${active ? "text-zinc-400" : "text-zinc-400"}`}>{count}</span>
              </button>
            );
          })}
        </div>
        <label className="flex items-center gap-2 text-sm text-zinc-500">
          Ordenar
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-800 outline-none focus:border-zinc-400"
          >
            <option value="featured">Destacados</option>
            <option value="price-asc">Menor precio</option>
            <option value="price-desc">Mayor precio</option>
          </select>
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visible.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
