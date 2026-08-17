import Image from "next/image";

export function Gallery({ images, alt }: { images: string[]; alt: string }) {
  if (images.length === 0) return null;

  return (
    <section className="px-4 py-6">
      <h2 className="mb-3 text-lg font-semibold text-zinc-900">Galería</h2>
      <div className="grid grid-cols-3 gap-2">
        {images.map((src, i) => (
          <div
            key={src}
            className="relative aspect-square overflow-hidden rounded-lg bg-zinc-100"
          >
            <Image
              src={src}
              alt={`${alt} — foto ${i + 1}`}
              fill
              sizes="33vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
