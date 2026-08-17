import { formatCLP } from "@/lib/money";
import type { Money } from "@/types/money";
import { BuyButton } from "./buy-button";

export function StickyCta({ price }: { price: Money }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-200 bg-white/95 px-4 py-3 backdrop-blur sm:hidden">
      <div className="flex items-center gap-3">
        <span className="shrink-0 text-lg font-bold text-zinc-900">
          {formatCLP(price)}
        </span>
        <BuyButton className="h-12 text-base" />
      </div>
    </div>
  );
}
