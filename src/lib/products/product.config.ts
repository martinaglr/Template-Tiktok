import type { Product } from "@/types/product";

/**
 * Placeholder product for the demo. Swapped for PayloadProductRepository
 * (see lib/products/types.ts) once the CMS is wired up.
 */
export const PLACEHOLDER_PRODUCT: Product = {
  id: "prod_demo_1",
  slug: "producto-demo",
  name: "Producto Demo",
  shortDescription: "El producto que estabas buscando, directo a tu puerta.",
  description:
    "Descripción larga del producto de demostración. Reemplazar con el " +
    "copy real del cliente antes de lanzar la campaña.",
  price: 12990,
  compareAtPrice: 19990,
  images: [
    "/product/placeholder-1.svg",
    "/product/placeholder-2.svg",
    "/product/placeholder-3.svg",
  ],
  benefits: [
    "Envío a todo Chile",
    "Garantía de 30 días",
    "Pago 100% seguro",
    "Stock limitado",
  ],
};
