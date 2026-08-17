export default function Loading() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 animate-pulse flex-col gap-6 px-4 py-6">
      <div className="h-6 w-40 rounded bg-zinc-100" />
      <div className="h-24 w-full rounded-xl bg-zinc-100" />
      <div className="flex flex-col gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-12 w-full rounded-lg bg-zinc-100" />
        ))}
        <div className="h-14 w-full rounded-full bg-zinc-100" />
      </div>
    </div>
  );
}
