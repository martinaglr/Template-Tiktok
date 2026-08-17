"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";
import type { Product } from "@/types/product";

export function ViewContentTracker({ product }: { product: Product }) {
  useEffect(() => {
    trackEvent("ViewContent", {
      content_id: product.id,
      content_name: product.name,
      value: product.price,
      currency: "CLP",
    });
    // Fire once per page load, not on every product prop identity change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
