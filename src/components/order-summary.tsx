import Image from "next/image";
import { formatCLP } from "@/lib/money";
import type { Product } from "@/types/product";

export function OrderSummary({ product }: { product: Product }) {
  return (
    <div className="flex gap-4 rounded-xl border border-zinc-200 bg-white p-4">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="80px"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col justify-center gap-1">
        <span className="text-sm font-medium text-zinc-900">{product.name}</span>
        <span className="text-xs text-zinc-500">Cantidad: 1</span>
      </div>
      <div className="flex flex-col items-end justify-center">
        <span className="text-xs text-zinc-500">Total</span>
        <span className="text-base font-bold text-zinc-900">
          {formatCLP(product.price)}
        </span>
      </div>
    </div>
  );
}
