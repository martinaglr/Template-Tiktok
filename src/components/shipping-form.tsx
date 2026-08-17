"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { REGIONES, getComunas } from "@/lib/chile-regiones";
import { checkoutPayloadSchema } from "@/lib/orders/schema";

type FieldErrors = Record<string, string>;

const inputClass =
  "h-12 w-full rounded-lg border border-zinc-300 bg-white px-3 text-base text-zinc-900 outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-600";
const errorInputClass = "border-rose-500 focus:border-rose-500 focus:ring-rose-500";
const labelClass = "text-sm font-medium text-zinc-700";
const errorTextClass = "text-xs text-rose-600";

export function ShippingForm() {
  const router = useRouter();
  const [values, setValues] = useState({
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
    region: "",
    comuna: "",
    notas: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const comunas = values.region ? getComunas(values.region) : [];

  function setField<K extends keyof typeof values>(field: K, value: string) {
    setValues((v) => ({
      ...v,
      [field]: value,
      ...(field === "region" ? { comuna: "" } : {}),
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);

    const payload = {
      customer: {
        nombre: values.nombre,
        email: values.email,
        telefono: values.telefono,
      },
      shippingAddress: {
        direccion: values.direccion,
        region: values.region,
        comuna: values.comuna,
        notas: values.notas || undefined,
      },
    };

    const parsed = checkoutPayloadSchema.safeParse(payload);
    if (!parsed.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[issue.path.length - 1];
        if (typeof key === "string") fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) throw new Error("request failed");
      const data = (await res.json()) as { redirectUrl: string };
      router.push(data.redirectUrl);
    } catch {
      setFormError("No pudimos procesar tu pedido. Intenta nuevamente.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label className={labelClass} htmlFor="nombre">
          Nombre completo
        </label>
        <input
          id="nombre"
          className={`${inputClass} ${errors.nombre ? errorInputClass : ""}`}
          value={values.nombre}
          onChange={(e) => setField("nombre", e.target.value)}
          autoComplete="name"
          aria-invalid={!!errors.nombre}
          aria-describedby={errors.nombre ? "nombre-error" : undefined}
        />
        {errors.nombre && (
          <p id="nombre-error" className={errorTextClass}>
            {errors.nombre}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className={labelClass} htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          className={`${inputClass} ${errors.email ? errorInputClass : ""}`}
          value={values.email}
          onChange={(e) => setField("email", e.target.value)}
          autoComplete="email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && (
          <p id="email-error" className={errorTextClass}>
            {errors.email}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className={labelClass} htmlFor="telefono">
          Teléfono
        </label>
        <input
          id="telefono"
          type="tel"
          className={`${inputClass} ${errors.telefono ? errorInputClass : ""}`}
          value={values.telefono}
          onChange={(e) => setField("telefono", e.target.value)}
          autoComplete="tel"
          placeholder="+56 9 1234 5678"
          aria-invalid={!!errors.telefono}
          aria-describedby={errors.telefono ? "telefono-error" : undefined}
        />
        {errors.telefono && (
          <p id="telefono-error" className={errorTextClass}>
            {errors.telefono}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className={labelClass} htmlFor="direccion">
          Dirección
        </label>
        <input
          id="direccion"
          className={`${inputClass} ${errors.direccion ? errorInputClass : ""}`}
          value={values.direccion}
          onChange={(e) => setField("direccion", e.target.value)}
          autoComplete="street-address"
          aria-invalid={!!errors.direccion}
          aria-describedby={errors.direccion ? "direccion-error" : undefined}
        />
        {errors.direccion && (
          <p id="direccion-error" className={errorTextClass}>
            {errors.direccion}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className={labelClass} htmlFor="region">
            Región
          </label>
          <select
            id="region"
            className={`${inputClass} ${errors.region ? errorInputClass : ""}`}
            value={values.region}
            onChange={(e) => setField("region", e.target.value)}
            aria-invalid={!!errors.region}
            aria-describedby={errors.region ? "region-error" : undefined}
          >
            <option value="">Selecciona</option>
            {REGIONES.map((r) => (
              <option key={r.codigo} value={r.codigo}>
                {r.nombre}
              </option>
            ))}
          </select>
          {errors.region && (
            <p id="region-error" className={errorTextClass}>
              {errors.region}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className={labelClass} htmlFor="comuna">
            Comuna
          </label>
          <select
            id="comuna"
            className={`${inputClass} ${errors.comuna ? errorInputClass : ""}`}
            value={values.comuna}
            onChange={(e) => setField("comuna", e.target.value)}
            disabled={!values.region}
            aria-invalid={!!errors.comuna}
            aria-describedby={errors.comuna ? "comuna-error" : undefined}
          >
            <option value="">Selecciona</option>
            {comunas.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.comuna && (
            <p id="comuna-error" className={errorTextClass}>
              {errors.comuna}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className={labelClass} htmlFor="notas">
          Notas (opcional)
        </label>
        <textarea
          id="notas"
          className="min-h-20 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-base text-zinc-900 outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-600"
          value={values.notas}
          onChange={(e) => setField("notas", e.target.value)}
        />
      </div>

      {formError && (
        <p role="alert" className={errorTextClass}>
          {formError}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="flex h-14 w-full items-center justify-center rounded-full bg-rose-600 px-6 text-lg font-semibold text-white transition-colors hover:bg-rose-700 active:bg-rose-800 disabled:opacity-60"
      >
        {submitting ? "Procesando…" : "Pagar"}
      </button>
    </form>
  );
}
