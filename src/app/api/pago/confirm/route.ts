import { NextResponse } from "next/server";
import { orderRepository, paymentProvider } from "@/lib/container";

/**
 * Webhook-shaped: mirrors the shape Flow will call server-to-server once
 * FlowPaymentProvider is live (see lib/payments/flow.ts). Today it's called
 * directly by our own /pago/[orderId] mock screen instead of by a provider.
 */
export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  if (!payload) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const result = await paymentProvider.verifyPayment(payload);

  const order = await orderRepository.updateStatus(
    result.orderId,
    result.status,
    result.providerRef,
  );
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ orderId: order.id, status: order.status });
}
