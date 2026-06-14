import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/pdp/ProductDetail";
import { getProductBySlug } from "@/lib/products";

const SLUG = "mesudar-mat";

export async function generateMetadata(): Promise<Metadata> {
  const product = await getProductBySlug(SLUG);
  if (!product) return { title: "מסודר" };

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

export default async function MatPage() {
  const product = await getProductBySlug(SLUG);
  if (!product) notFound();

  return (
    <main id="main" className="min-h-[100svh] bg-cream text-ink">
      <ProductDetail
        product={product}
        scaleGalleryBySize
        companionLink={{
          href: "/feeder",
          label: "רוצים האכלה בלי בלגן? לעמדת ההאכלה MESUDAR",
        }}
      />
    </main>
  );
}
