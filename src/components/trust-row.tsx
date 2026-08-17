const ITEMS = [
  { icon: "🚚", label: "Envío a todo Chile" },
  { icon: "🛡️", label: "Garantía de 30 días" },
  { icon: "🔒", label: "Pago 100% seguro" },
];

export function TrustRow() {
  return (
    <section className="border-y border-zinc-200 bg-zinc-50 px-4 py-5">
      <div className="grid grid-cols-3 gap-2 text-center">
        {ITEMS.map((item) => (
          <div key={item.label} className="flex flex-col items-center gap-1">
            <span aria-hidden="true" className="text-xl">
              {item.icon}
            </span>
            <span className="text-xs font-medium text-zinc-600">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
