import Link from "next/link";

export function BuyButton({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/checkout"
      className={`flex h-14 w-full items-center justify-center rounded-full bg-rose-600 px-6 text-lg font-semibold text-white transition-colors hover:bg-rose-700 active:bg-rose-800 ${className}`}
    >
      Comprar aquí
    </Link>
  );
}
