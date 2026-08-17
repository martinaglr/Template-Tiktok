import type { PaymentProvider, PaymentResult } from "./types";

/**
 * STUB — do not call real Flow yet. Documents the real flow.cl integration
 * so this drops in behind PaymentProvider with no changes to pages/routes.
 *
 * Real flow (see https://www.flow.cl/docs/api.html):
 * 1. createOrder(): POST https://www.flow.cl/api/payment/create with params
 *    { apiKey, commerceOrder: orderId, subject, amount, email, urlConfirmation,
 *      urlReturn } signed with HMAC-SHA256 using FLOW_SECRET_KEY -> response
 *    has { url, token }. redirectUrl = `${url}?token=${token}`.
 * 2. User pays on Flow's hosted page.
 * 3. Flow calls urlConfirmation (our /api/pago/confirm) server-to-server
 *    with a signed token, and separately redirects the user's browser to
 *    urlReturn.
 * 4. On confirm, we POST https://www.flow.cl/api/payment/getStatus with the
 *    token to verify the real status before trusting it (never trust the
 *    return redirect alone) -> maps Flow's numeric status to PaymentResult.
 */
export class FlowPaymentProvider implements PaymentProvider {
  async createOrder(_input: {
    orderId: string;
    amount: number;
    subject: string;
    email: string;
    returnUrl: string;
  }): Promise<{ redirectUrl: string; providerRef: string }> {
    // TODO: sign params with FLOW_SECRET_KEY (HMAC-SHA256) and POST to
    // https://www.flow.cl/api/payment/create (sandbox: sandbox.flow.cl).
    throw new Error("FlowPaymentProvider is not implemented yet");
  }

  async verifyPayment(_payload: unknown): Promise<PaymentResult> {
    // TODO: extract `token` from payload, POST to
    // https://www.flow.cl/api/payment/getStatus, map Flow's status
    // (1=pending, 2=paid, 3=rejected, 4=cancelled) to PaymentResult.status.
    throw new Error("FlowPaymentProvider is not implemented yet");
  }
}
