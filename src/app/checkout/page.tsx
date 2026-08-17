import { productRepository } from "@/lib/container";
import { SiteHeader } from "@/components/site-header";
import { OrderSummary } from "@/components/order-summary";
import { ShippingForm } from "@/components/shipping-form";
import { InitiateCheckoutTracker } from "@/components/initiate-checkout-tracker";

export default async function CheckoutPage() {
  const product = await productRepository.getFeatured();

  return (
    <>
      <SiteHeader productName={product.name} />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-6">
        <h1 className="text-xl font-bold text-zinc-900">Finalizar compra</h1>
        <OrderSummary product={product} />
        <ShippingForm />
      </main>
      <InitiateCheckoutTracker product={product} />
    </>
  );
}
