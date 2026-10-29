import { products } from "@/data/products";
import type { Brand, Product, ProductVariant } from "@/types";

export function getAllProducts(): Product[] {
  return products;
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getVariant(product: Product, variantId: string): ProductVariant | undefined {
  return product.variants.find((v) => v.id === variantId);
}

export function getBrands(): Brand[] {
  return Array.from(new Set(products.map((p) => p.brand)));
}

export function getStartingPrice(product: Product): number {
  return Math.min(...product.variants.map((v) => v.price));
}
