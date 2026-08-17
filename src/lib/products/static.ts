import type { Product } from "@/types/product";
import type { ProductRepository } from "./types";
import { PLACEHOLDER_PRODUCT } from "./product.config";

export class StaticProductRepository implements ProductRepository {
  async getBySlug(slug: string): Promise<Product | null> {
    return PLACEHOLDER_PRODUCT.slug === slug ? PLACEHOLDER_PRODUCT : null;
  }

  async getFeatured(): Promise<Product> {
    return PLACEHOLDER_PRODUCT;
  }
}
