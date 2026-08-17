import { orderRepository } from "@/lib/container";
import { formatCLP } from "@/lib/money";
import { MockPaymentActions } from "@/components/mock-payment-actions";

export default async function PagoPage(props: PageProps<"/pago/[orderId]">) {
  const { orderId } = await props.params;
  const order = await orderRepository.getById(orderId);

  if (!order) {
    return (
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-2 p-8 text-center">
        <h1 className="text-xl font-semibold text-zinc-900">
          Pedido no encontrado
        </h1>
        <p className="text-sm text-zinc-600">
          El pedido {orderId} no existe o expiró. Vuelve al checkout e
          inténtalo de nuevo.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 p-6">
      <div className="rounded-lg bg-amber-100 px-3 py-2 text-center text-xs font-semibold uppercase tracking-wide text-amber-800">
        Pantalla de pago simulada — demo
      </div>

      <div className="flex flex-col gap-1 text-center">
        <span className="text-sm text-zinc-500">Total a pagar</span>
        <span className="text-3xl font-bold text-zinc-900">
          {formatCLP(order.total)}
        </span>
        <span className="text-xs text-zinc-400">Pedido {order.id}</span>
      </div>

      <MockPaymentActions orderId={order.id} providerRef={order.providerRef} />
    </main>
  );
}
