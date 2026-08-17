import type { PaymentProvider, PaymentResult } from "./types";

/**
 * Simulates Flow's create -> redirect -> return -> confirm shape so
 * FlowPaymentProvider (lib/payments/flow.ts) is a true drop-in replacement.
 * redirectUrl points at our own /pago/[orderId] mock payment screen instead
 * of a real provider.
 */
export class MockPaymentProvider implements PaymentProvider {
  async createOrder(input: {
    orderId: string;
    amount: number;
    subject: string;
    email: string;
    returnUrl: string;
  }): Promise<{ redirectUrl: string; providerRef: string }> {
    return {
      redirectUrl: `/pago/${input.orderId}`,
      providerRef: `mock_${input.orderId}`,
    };
  }

  /**
   * `action` is a mock-only field the /pago/[orderId] screen sends to pick
   * an outcome, standing in for Flow's actual paid/rejected status.
   */
  async verifyPayment(payload: unknown): Promise<PaymentResult> {
    const { orderId, providerRef, action } = payload as {
      orderId: string;
      providerRef?: string;
      action?: "confirm" | "cancel";
    };
    return {
      orderId,
      status: action === "cancel" ? "rejected" : "paid",
      providerRef: providerRef ?? `mock_${orderId}`,
    };
  }
}
