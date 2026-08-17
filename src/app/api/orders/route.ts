import { NextResponse } from "next/server";
import { checkoutPayloadSchema } from "@/lib/orders/schema";
import { orderRepository, paymentProvider, productRepository } from "@/lib/container";
import { env } from "@/lib/env";
import type { Order } from "@/types/order";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = checkoutPayloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  // Price/product come from our own repository, never from the client body,
  // so a tampered request can't change what gets charged.
  const product = await productRepository.getFeatured();
  const orderId = crypto.randomUUID();

  const order: Order = {
    id: orderId,
    items: [
      {
        productId: product.id,
        name: product.name,
        quantity: 1,
        unitPrice: product.price,
      },
    ],
    total: product.price,
    customer: parsed.data.customer,
    shippingAddress: parsed.data.shippingAddress,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  await orderRepository.create(order);

  const { redirectUrl, providerRef } = await paymentProvider.createOrder({
    orderId,
    amount: order.total,
    subject: product.name,
    email: order.customer.email,
    returnUrl: `${env.siteUrl}/pago/exito`,
  });

  await orderRepository.updateStatus(orderId, "pending", providerRef);

  return NextResponse.json({ redirectUrl });
}
