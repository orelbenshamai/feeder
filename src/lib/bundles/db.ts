import "server-only";
import { getInventoryByProductId } from "@/lib/inventory";
import type { BundleUpsellOffer, ProductSizeId } from "@/types/product";

/**
 * Hydrates a bundle offer with live pricing from the inventory collection.
 * - addonPriceBySize       → addon product's bundleAddonPriceBySize field
 * - matRetailPriceBySize   → addon product's regular per-size price
 *
 * Both live on the addon product's own inventory document — no separate collection needed.
 */
export async function hydrateBundleOffer(
  staticBundle: BundleUpsellOffer
): Promise<BundleUpsellOffer> {
  try {
    const addonInventory = await getInventoryByProductId(staticBundle.matProductId);
    if (!addonInventory) return staticBundle;

    const sizes: ProductSizeId[] = ["small", "medium", "large"];

    const addonPriceBySize: Record<ProductSizeId, number> = { small: 0, medium: 0, large: 0 };
    const matRetailPriceBySize: Record<ProductSizeId, number> = { small: 0, medium: 0, large: 0 };
    const addonInStockBySize: Record<ProductSizeId, boolean> = { small: false, medium: false, large: false };

    for (const sizeId of sizes) {
      if (addonInventory.bundleAddonPriceBySize?.[sizeId]) {
        addonPriceBySize[sizeId] = addonInventory.bundleAddonPriceBySize[sizeId];
      }
      // All color variants for this size — in stock if at least one has quantity > 0
      const sizeVariants = addonInventory.variants.filter(v => v.sizeId === sizeId);
      addonInStockBySize[sizeId] = sizeVariants.some(v => v.quantity > 0);
      const primary = sizeVariants[0];
      if (primary) matRetailPriceBySize[sizeId] = primary.price;
    }

    return { ...staticBundle, addonPriceBySize, matRetailPriceBySize, addonInStockBySize };
  } catch {
    return staticBundle;
  }
}
