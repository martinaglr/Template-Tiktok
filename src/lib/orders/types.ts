import type { Order, OrderStatus } from "@/types/order";

export type { Order };

export interface OrderRepository {
  create(order: Order): Promise<Order>;
  getById(id: string): Promise<Order | null>;
  getByProviderToken(token: string): Promise<Order | null>;
  /**
   * Idempotent and monotonic: pending -> paid succeeds and stamps paid_at;
   * a repeated paid -> paid is a no-op that returns the order unchanged;
   * paid -> rejected is rejected and logged, never applied. Flow retries its
   * confirmation, so this is a correctness requirement, not defensive polish.
   */
  updateStatus(
    id: string,
    status: OrderStatus,
    providerRef?: string,
  ): Promise<Order | null>;
  attachProviderRef(id: string, providerRef: string, token: string): Promise<void>;
  /** Returns false if emails were already marked sent (idempotency guard). */
  markEmailsSent(id: string): Promise<boolean>;
}
