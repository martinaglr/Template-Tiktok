import type { Product } from "@/types/product";

export interface ProductRepository {
  getBySlug(slug: string): Promise<Product | null>;
  getFeatured(): Promise<Product>;
}
