import { describe, expect, it } from "vitest";
import { decideStatusTransition } from "./transition";

describe("decideStatusTransition", () => {
  it("applies pending -> paid and stamps paid_at", () => {
    expect(decideStatusTransition("pending", "paid")).toEqual({
      apply: true,
      stampPaidAt: true,
    });
  });

  it("applies pending -> rejected without stamping paid_at", () => {
    expect(decideStatusTransition("pending", "rejected")).toEqual({
      apply: true,
      stampPaidAt: false,
    });
  });

  it("treats a repeated paid -> paid as a no-op", () => {
    expect(decideStatusTransition("paid", "paid")).toEqual({
      apply: false,
      reason: "already-paid",
    });
  });

  it("refuses to downgrade paid -> rejected", () => {
    expect(decideStatusTransition("paid", "rejected")).toEqual({
      apply: false,
      reason: "downgrade-from-paid",
    });
  });

  it("refuses to downgrade paid -> pending", () => {
    expect(decideStatusTransition("paid", "pending")).toEqual({
      apply: false,
      reason: "downgrade-from-paid",
    });
  });

  it("allows a rejected order to be retried into paid", () => {
    expect(decideStatusTransition("rejected", "paid")).toEqual({
      apply: true,
      stampPaidAt: true,
    });
  });
});
