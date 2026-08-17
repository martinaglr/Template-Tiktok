"use client";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="es">
      <body>
        <main className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center gap-3 p-8 text-center">
          <span aria-hidden="true" className="text-4xl">⚠️</span>
          <h1 className="text-xl font-semibold text-zinc-900">Algo salió mal</h1>
          <p className="text-sm text-zinc-600">
            Ocurrió un error inesperado. Puedes intentar de nuevo.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-2 flex h-12 items-center justify-center rounded-full bg-rose-600 px-6 text-base font-semibold text-white transition-colors hover:bg-rose-700"
          >
            Reintentar
          </button>
        </main>
      </body>
    </html>
  );
}
