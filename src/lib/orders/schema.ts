import { z } from "zod";
import { REGIONES } from "@/lib/chile-regiones";

const REGION_CODES = new Set(REGIONES.map((r) => r.codigo));

export const customerSchema = z.object({
  nombre: z.string().trim().min(2, "Ingresa tu nombre completo"),
  email: z.email("Ingresa un email válido").trim(),
  telefono: z.string().trim().min(8, "Ingresa un teléfono válido"),
});

export const shippingAddressSchema = z
  .object({
    direccion: z.string().trim().min(5, "Ingresa tu dirección completa"),
    region: z.string().refine((v) => REGION_CODES.has(v), {
      message: "Selecciona una región",
    }),
    comuna: z.string().min(1, "Selecciona una comuna"),
    notas: z.string().trim().optional(),
  })
  .superRefine((data, ctx) => {
    const found = REGIONES.find((r) => r.codigo === data.region);
    if (found && data.comuna && !found.comunas.includes(data.comuna)) {
      ctx.addIssue({
        code: "custom",
        message: "La comuna no pertenece a la región seleccionada",
        path: ["comuna"],
      });
    }
  });

export const checkoutPayloadSchema = z.object({
  customer: customerSchema,
  shippingAddress: shippingAddressSchema,
});

export type CheckoutPayload = z.infer<typeof checkoutPayloadSchema>;
