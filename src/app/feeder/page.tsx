import type { Metadata } from "next";
import ProductDetail from "@/components/pdp/ProductDetail";
import { FEEDER_MAT_BUNDLE } from "@/lib/bundles/feeder-mat-bundle";
import { getDefaultProduct } from "@/lib/products";

export async function generateMetadata(): Promise<Metadata> {
  const product = await getDefaultProduct();
  return {
    title: `${product.name} | מסודר`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      locale: "he_IL",
      type: "website",
    },
  };
}

export default async function FeederPage() {
  const product = await getDefaultProduct();

  return (
    <main id="main" className="min-h-[100svh] bg-cream text-ink">
      <ProductDetail product={product} bundleUpsell={FEEDER_MAT_BUNDLE} scaleGalleryBySize />
    </main>
  );
}
