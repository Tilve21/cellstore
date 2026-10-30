import { Benefits } from "@/components/home/Benefits";
import { Hero } from "@/components/home/Hero";
import { ProductCatalog } from "@/components/product/ProductCatalog";
import { getAllProducts, getFeaturedProducts } from "@/lib/products";

export default function HomePage() {
  return (
    <>
      <Hero featured={getFeaturedProducts()} />

      <section id="beneficios" className="relative z-10 mx-auto -mt-10 max-w-7xl scroll-mt-24 px-4 sm:px-6 [&_li]:shadow-[0_10px_30px_-12px_rgba(0,0,0,0.2)]">
        <Benefits />
      </section>

      <section id="catalogo" className="mx-auto max-w-7xl scroll-mt-20 px-4 pt-20 sm:px-6">
        <div className="mb-8 flex flex-col gap-2">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">Catálogo</p>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">Celulares y audífonos</h2>
          <p className="text-zinc-500">Todos los equipos son nuevos, originales y se entregan sellados.</p>
        </div>
        <ProductCatalog products={getAllProducts()} />
      </section>
    </>
  );
}
