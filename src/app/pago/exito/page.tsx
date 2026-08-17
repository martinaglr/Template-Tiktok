import Link from "next/link";
import { orderRepository } from "@/lib/container";
import { formatCLP } from "@/lib/money";
import { PurchaseTracker } from "@/components/purchase-tracker";

export default async function PagoExitoPage(props: PageProps<"/pago/exito">) {
  const searchParams = await props.searchParams;
  const orderId =
    typeof searchParams.orderId === "string" ? searchParams.orderId : null;
  const order = orderId ? await orderRepository.getById(orderId) : null;

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
      <span aria-hidden="true" className="text-4xl">✅</span>
      <h1 className="text-2xl font-bold text-zinc-900">¡Gracias por tu compra!</h1>
      <p className="text-sm text-zinc-600">
        Tu pedido fue confirmado y pronto estará en camino.
      </p>
      {order && (
        <div className="mt-2 flex flex-col gap-1 rounded-lg border border-zinc-200 bg-white px-4 py-3">
          <span className="text-xs text-zinc-500">Número de pedido</span>
          <span className="font-mono text-sm text-zinc-800">{order.id}</span>
          <span className="mt-1 text-sm font-semibold text-zinc-900">
            {formatCLP(order.total)}
          </span>
        </div>
      )}
      <Link
        href="/"
        className="mt-4 text-sm font-medium text-rose-600 hover:text-rose-700"
      >
        Volver al inicio
      </Link>
      {order && <PurchaseTracker orderId={order.id} value={order.total} />}
    </main>
  );
}
