import type { ProductSizeId } from "@/types/product";

/** Visual scale applied to gallery images inside a fixed-size frame. Large = 100%. */
const IMAGE_SCALE: Record<ProductSizeId, number> = {
  small: 0.68,
  medium: 0.88,
  large: 1,
};

export function getVariantImageScale(sizeId: ProductSizeId): number {
  return IMAGE_SCALE[sizeId] ?? IMAGE_SCALE.medium;
}

/** Apply mobile boost without exceeding the frame (prevents cropping at 100% scale). */
export function getEffectiveGalleryScale(
  baseScale: number,
  boost = 1,
): number {
  return Math.min(baseScale * boost, 1);
}

/** Fixed gallery frame — matches product photo ratio. */
export const GALLERY_FRAME_ASPECT = "1376 / 768";
