export function Benefits({ items }: { items: string[] }) {
  return (
    <section className="px-4 py-6">
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3"
          >
            <span
              aria-hidden="true"
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-700"
            >
              ✓
            </span>
            <span className="text-sm font-medium text-zinc-800">{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
