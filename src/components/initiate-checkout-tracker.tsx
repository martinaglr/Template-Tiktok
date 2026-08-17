"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";
import type { Product } from "@/types/product";

export function InitiateCheckoutTracker({ product }: { product: Product }) {
  useEffect(() => {
    trackEvent("InitiateCheckout", {
      content_id: product.id,
      content_name: product.name,
      value: product.price,
      currency: "CLP",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
