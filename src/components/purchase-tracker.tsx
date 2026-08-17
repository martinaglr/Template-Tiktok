"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export function PurchaseTracker({
  orderId,
  value,
}: {
  orderId: string;
  value: number;
}) {
  useEffect(() => {
    trackEvent("Purchase", { content_id: orderId, value, currency: "CLP" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
