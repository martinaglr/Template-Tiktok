export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-3xl flex-1 animate-pulse px-4 pt-4">
      <div className="aspect-square w-full rounded-2xl bg-zinc-100" />
      <div className="mt-5 flex flex-col gap-3">
        <div className="h-7 w-2/3 rounded bg-zinc-100" />
        <div className="h-4 w-full rounded bg-zinc-100" />
        <div className="h-9 w-1/3 rounded bg-zinc-100" />
        <div className="h-14 w-full rounded-full bg-zinc-100" />
      </div>
    </div>
  );
}
