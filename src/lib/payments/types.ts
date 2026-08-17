export interface PaymentProvider {
  /** Create a payment for an order; returns where to send the user. */
  createOrder(input: {
    orderId: string;
    amount: number; // integer CLP
    subject: string;
    email: string;
    returnUrl: string; // where provider sends user back
  }): Promise<{ redirectUrl: string; providerRef: string }>;

  /** Verify/parse a return or webhook payload into a result. */
  verifyPayment(payload: unknown): Promise<PaymentResult>;
}

export type PaymentResult = {
  orderId: string;
  status: "paid" | "pending" | "rejected";
  providerRef: string;
};
