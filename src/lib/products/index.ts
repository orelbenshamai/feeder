import { mesudarFeederStation } from "@/data/products/mesudar-feeder-station";
import { mesudarMat } from "@/data/products/mesudar-mat";
import { isVimeoGalleryItem } from "@/lib/vimeo";
import type { Product, ProductColorId, ProductSizeId } from "@/types/product";
// import clientPromise from "@/lib/mongodb";
// import { mapMongoProduct } from "./map-mongo-product";

const MOCK_CATALOG: Record<string, Product> = {
  [mesudarFeederStation.slug]: mesudarFeederStation,
  [mesudarMat.slug]: mesudarMat,
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

export function getAvailableColorsForSize(
  product: Product,
  sizeId: ProductSizeId,
) {
  const variant = getVariantBySize(product, sizeId);
  return product.colors.filter((color) =>
    variant.availableColors.includes(color.id),
  );
}

/** Gallery slides for the current size + color selection. */
export function getGalleryImagesForSelection(
  product: Product,
  sizeId: ProductSizeId,
  colorId: ProductColorId,
) {
  const variant = getVariantBySize(product, sizeId);
  const colorImages = variant.galleryByColor[colorId];
  if (colorImages?.length) return colorImages;

  const fallbackColor = variant.availableColors[0];
  const fallbackImages = fallbackColor
    ? variant.galleryByColor[fallbackColor]
    : undefined;

  return fallbackImages?.length ? fallbackImages : [variant.imageUrl];
}

/** Primary gallery image for the current size + color selection. */
export function getProductDisplayImage(
  product: Product,
  sizeId: ProductSizeId,
  colorId: ProductColorId,
) {
  const images = getGalleryImagesForSelection(product, sizeId, colorId);
  return (
    images.find((src) => !isVimeoGalleryItem(src)) ??
    getVariantBySize(product, sizeId).imageUrl
  );
}

/** Pick a valid color when the selected size changes. */
export function resolveColorForSize(
  product: Product,
  sizeId: ProductSizeId,
  currentColorId: ProductColorId,
) {
  const variant = getVariantBySize(product, sizeId);
  if (variant.availableColors.includes(currentColorId)) {
    return currentColorId;
  }
  return variant.availableColors[0] ?? product.colors[0]?.id ?? "gray";
}
