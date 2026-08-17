import type { Money } from "@/types/money";

const CLP_FORMATTER = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

/** Formats integer CLP as "$12.990". */
export function formatCLP(amount: Money): string {
  return CLP_FORMATTER.format(amount);
}

/** Parses a CLP string like "12.990" or "$12.990" back to an integer. */
export function parseCLP(value: string): Money {
  const digits = value.replace(/[^0-9]/g, "");
  return digits ? parseInt(digits, 10) : 0;
}
