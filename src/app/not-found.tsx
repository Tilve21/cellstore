import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">Error 404</p>
      <h1 className="text-4xl font-bold tracking-tight text-zinc-900">No encontramos esta página</h1>
      <p className="text-zinc-500">Puede que el producto ya no esté disponible o que el enlace sea incorrecto.</p>
      <Link href="/#catalogo" className="mt-4 rounded-full bg-zinc-900 px-6 py-3 font-semibold text-white hover:bg-zinc-700">
        Ver catálogo
      </Link>
    </div>
  );
}
