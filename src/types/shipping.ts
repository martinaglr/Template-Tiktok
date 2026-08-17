export type ShippingAddress = {
  direccion: string;
  region: string; // region code, see lib/chile-regiones.ts
  comuna: string; // comuna name, must belong to `region`
  notas?: string;
};
