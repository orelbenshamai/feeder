import type { BundleUpsellOffer, ProductSizeId, ProductVariant } from "@/types/product";

export function getBundleAddonPrice(
  bundle: BundleUpsellOffer,
  sizeId: ProductSizeId,
) {
  return bundle.addonPriceBySize[sizeId];
}

export function getBundleMatSavings(
  bundle: BundleUpsellOffer,
  sizeId: ProductSizeId,
) {
  return bundle.matRetailPriceBySize[sizeId] - bundle.addonPriceBySize[sizeId];
}

export function getBundleTotalPrice(
  variant: ProductVariant,
  bundle: BundleUpsellOffer,
  enabled: boolean,
) {
  if (!enabled) return variant.price;
  return variant.price + getBundleAddonPrice(bundle, variant.id);
}

export function getBundleCompareAtPrice(
  variant: ProductVariant,
  bundle: BundleUpsellOffer,
  enabled: boolean,
) {
  if (!enabled) return variant.compareAtPrice;

  const feederCompare = variant.compareAtPrice ?? variant.price;
  return feederCompare + bundle.matRetailPriceBySize[variant.id];
}
