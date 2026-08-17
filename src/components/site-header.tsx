export function SiteHeader({ productName }: { productName: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-3xl items-center px-4">
        <span className="text-base font-semibold tracking-tight text-zinc-900">
          {productName}
        </span>
      </div>
    </header>
  );
}
