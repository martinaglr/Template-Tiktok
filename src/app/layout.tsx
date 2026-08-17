import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { productRepository } from "@/lib/container";
import { env } from "@/lib/env";
import { formatCLP } from "@/lib/money";
import { PixelScripts } from "@/components/pixel-scripts";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const product = await productRepository.getFeatured();
  const title = `${product.name} — ${formatCLP(product.price)}`;
  const description = product.shortDescription;

  return {
    metadataBase: new URL(env.siteUrl),
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: "es_CL",
      images: [{ url: product.images[0] }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [product.images[0]],
    },
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <PixelScripts />
      </body>
    </html>
  );
}
