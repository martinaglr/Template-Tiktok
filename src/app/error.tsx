"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
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
  );
}
