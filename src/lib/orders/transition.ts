import type { OrderStatus } from "@/types/order";

export type OrderTransitionDecision =
  | { apply: true; stampPaidAt: boolean }
  | { apply: false; reason: "already-paid" | "downgrade-from-paid" };

/**
 * Status is idempotent and monotonic once "paid": a repeated pending -> paid
 * (or paid -> paid) is a no-op, and paid -> rejected is refused rather than
 * applied. Flow retries its confirmation webhook, so this is a correctness
 * requirement — a duplicate or out-of-order delivery must never flip a paid
 * order back to rejected.
 */
export function decideStatusTransition(
  currentStatus: OrderStatus,
  requestedStatus: OrderStatus,
): OrderTransitionDecision {
  if (currentStatus === "paid") {
    return {
      apply: false,
      reason: requestedStatus === "paid" ? "already-paid" : "downgrade-from-paid",
    };
  }
  return { apply: true, stampPaidAt: requestedStatus === "paid" };
}
