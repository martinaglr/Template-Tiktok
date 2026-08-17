import Image from "next/image";
import type { Product } from "@/types/product";
import { PriceBlock } from "./price-block";
import { BuyButton } from "./buy-button";

export function Hero({ product }: { product: Product }) {
  return (
    <section className="px-4 pt-4">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-zinc-100">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-cover"
        />
      </div>

      <div className="mt-5 flex flex-col gap-3">
        <h1 className="text-2xl font-bold leading-snug text-zinc-900">
          {product.name}
        </h1>
        <p className="text-base text-zinc-600">{product.shortDescription}</p>
        <PriceBlock price={product.price} compareAtPrice={product.compareAtPrice} />
        <BuyButton className="mt-2" />
      </div>
    </section>
  );
}
