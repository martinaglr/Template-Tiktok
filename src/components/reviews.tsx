const PLACEHOLDER_REVIEWS = [
  { name: "Camila R.", text: "Llegó rápido y es tal cual la foto. Muy recomendado." },
  { name: "Matías G.", text: "Excelente calidad, superó mis expectativas." },
  { name: "Francisca T.", text: "El envío fue rapidísimo, quedé feliz con la compra." },
];

function Stars() {
  return (
    <div className="flex gap-0.5 text-amber-400" aria-label="5 de 5 estrellas">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i}>★</span>
      ))}
    </div>
  );
}

export function Reviews() {
  return (
    <section className="px-4 py-6">
      <h2 className="mb-3 text-lg font-semibold text-zinc-900">
        Lo que dicen nuestros clientes
      </h2>
      <div className="flex flex-col gap-3">
        {PLACEHOLDER_REVIEWS.map((review) => (
          <div
            key={review.name}
            className="rounded-xl border border-zinc-200 bg-white p-4"
          >
            <Stars />
            <p className="mt-2 text-sm text-zinc-700">{review.text}</p>
            <p className="mt-2 text-xs font-medium text-zinc-500">
              {review.name}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
