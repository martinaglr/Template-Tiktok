import Link from "next/link";

export default async function PagoErrorPage(props: PageProps<"/pago/error">) {
  const searchParams = await props.searchParams;
  const orderId =
    typeof searchParams.orderId === "string" ? searchParams.orderId : null;

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
      <span aria-hidden="true" className="text-4xl">😕</span>
      <h1 className="text-2xl font-bold text-zinc-900">
        No pudimos procesar tu pago
      </h1>
      <p className="text-sm text-zinc-600">
        El pago fue cancelado o rechazado. No se realizó ningún cargo — puedes
        intentarlo de nuevo.
      </p>
      <div className="mt-4 flex w-full flex-col gap-3">
        {orderId && (
          <Link
            href={`/pago/${orderId}`}
            className="flex h-12 w-full items-center justify-center rounded-full bg-rose-600 px-6 text-base font-semibold text-white transition-colors hover:bg-rose-700"
          >
            Reintentar pago
          </Link>
        )}
        <Link
          href="/checkout"
          className="flex h-12 w-full items-center justify-center rounded-full border border-zinc-300 px-6 text-base font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
        >
          Volver al checkout
        </Link>
      </div>
    </main>
  );
}
