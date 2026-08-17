import { formatCLP } from "@/lib/money";
import type { Money } from "@/types/money";

export function PriceBlock({
  price,
  compareAtPrice,
}: {
  price: Money;
  compareAtPrice?: Money;
}) {
  const discountPct =
    compareAtPrice && compareAtPrice > price
      ? Math.round((1 - price / compareAtPrice) * 100)
      : null;

  return (
    <div className="flex items-baseline gap-3">
      <span className="text-3xl font-bold text-zinc-900">{formatCLP(price)}</span>
      {compareAtPrice && compareAtPrice > price && (
        <span className="text-lg text-zinc-400 line-through">
          <span className="sr-only">Precio anterior: </span>
          {formatCLP(compareAtPrice)}
        </span>
      )}
      {discountPct !== null && (
        <span
          aria-label={`${discountPct} por ciento de descuento`}
          className="rounded-full bg-rose-100 px-2 py-0.5 text-sm font-semibold text-rose-700"
        >
          -{discountPct}%
        </span>
      )}
    </div>
  );
}
