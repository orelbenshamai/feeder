import { mesudarFeederStation } from "@/data/products/mesudar-feeder-station";
import type { Product, ProductColorId, ProductSizeId } from "@/types/product";
// import clientPromise from "@/lib/mongodb";
// import { mapMongoProduct } from "./map-mongo-product";

const MOCK_CATALOG: Record<string, Product> = {
  [mesudarFeederStation.slug]: mesudarFeederStation,
};

export async function getProductBySlug(slug: string): Promise<Product | null> {
  // --- MongoDB (future) ---
  // const client = await clientPromise;
  // const doc = await client
  //   .db(process.env.MONGODB_DB)
  //   .collection<MongoProductDocument>("products")
  //   .findOne({ slug });
  // return doc ? mapMongoProduct(doc) : null;

  return MOCK_CATALOG[slug] ?? null;
}

export async function getDefaultProduct(): Promise<Product> {
  return mesudarFeederStation;
}

export function getVariantBySize(product: Product, sizeId: ProductSizeId) {
  return product.variants.find((v) => v.id === sizeId) ?? product.variants[0];
}

export function getColorById(product: Product, colorId: ProductColorId) {
  return product.colors.find((c) => c.id === colorId) ?? product.colors[0];
}

/** Primary gallery image for the current size + color selection. */
export function getProductDisplayImage(
  product: Product,
  sizeId: ProductSizeId,
  colorId: ProductColorId,
) {
  const variant = getVariantBySize(product, sizeId);
  const color = getColorById(product, colorId);
  return color?.imageUrl ?? variant.imageUrl;
}
