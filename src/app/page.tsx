import { productRepository } from "@/lib/container";
import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/hero";
import { Benefits } from "@/components/benefits";
import { Gallery } from "@/components/gallery";
import { Reviews } from "@/components/reviews";
import { TrustRow } from "@/components/trust-row";
import { StickyCta } from "@/components/sticky-cta";
import { ViewContentTracker } from "@/components/view-content-tracker";

export default async function Home() {
  const product = await productRepository.getFeatured();

  return (
    <>
      <SiteHeader productName={product.name} />
      <main className="mx-auto w-full max-w-3xl flex-1 pb-24 sm:pb-8">
        <Hero product={product} />
        <Benefits items={product.benefits} />
        <Gallery images={product.images} alt={product.name} />
        <Reviews />
        <TrustRow />
      </main>
      <StickyCta price={product.price} />
      <ViewContentTracker product={product} />
    </>
  );
}
