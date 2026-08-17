"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function MockPaymentActions({
  orderId,
  providerRef,
}: {
  orderId: string;
  providerRef?: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState<"confirm" | "cancel" | null>(null);

  async function resolve(action: "confirm" | "cancel") {
    setPending(action);
    try {
      await fetch("/api/pago/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, providerRef, action }),
      });
    } finally {
      const destination = action === "confirm" ? "exito" : "error";
      router.push(`/pago/${destination}?orderId=${orderId}`);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        disabled={pending !== null}
        onClick={() => resolve("confirm")}
        className="flex h-14 w-full items-center justify-center rounded-full bg-rose-600 px-6 text-lg font-semibold text-white transition-colors hover:bg-rose-700 active:bg-rose-800 disabled:opacity-60"
      >
        {pending === "confirm" ? "Procesando…" : "Pagar"}
      </button>
      <button
        type="button"
        disabled={pending !== null}
        onClick={() => resolve("cancel")}
        className="flex h-12 w-full items-center justify-center rounded-full border border-zinc-300 px-6 text-base font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-60"
      >
        {pending === "cancel" ? "Cancelando…" : "Cancelar"}
      </button>
    </div>
  );
}
