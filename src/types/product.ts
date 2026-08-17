import type { Money } from "./money";

export type Product = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  price: Money;
  compareAtPrice?: Money;
  images: string[];
  benefits: string[];
};
