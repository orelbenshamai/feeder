import "server-only";

import { mesudarFeederStation } from "@/data/products/mesudar-feeder-station";
import { mesudarMat } from "@/data/products/mesudar-mat";
import { getInventoryByProductId, mergeInventoryIntoVariants } from "@/lib/inventory";
import type { Product } from "@/types/product";

// Re-export pure helpers so existing imports of "@/lib/products" keep working
// on the server side. Client Components should import from "@/lib/products/helpers".
export {
  getVariantBySize,
  getColorById,
  getAvailableColorsForSize,
  getGalleryImagesForSelection,
  getProductDisplayImage,
  resolveColorForSize,
} from "@/lib/products/helpers";

const STATIC_CATALOG: Record<string, Product> = {
  [mesudarFeederStation.slug]: mesudarFeederStation,
  [mesudarMat.slug]: mesudarMat,
};

/** Overlay live inventory (inStock, price) onto a static product. */
async function withInventory(product: Product): Promise<Product> {
  const inventory = await getInventoryByProductId(product.id);
  return { ...product, variants: mergeInventoryIntoVariants(product.variants, inventory) };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const product = STATIC_CATALOG[slug] ?? null;
  if (!product) return null;
  return withInventory(product);
}

export async function getDefaultProduct(): Promise<Product> {
  return withInventory(mesudarFeederStation);
}
