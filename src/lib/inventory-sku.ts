import type { ProductColorId } from "@/types/product";

const COLOR_SKU_SUFFIX: Record<ProductColorId, string> = {
  gray: "GRY",
  beige: "BGE",
};

/** Build the inventory SKU stored in MongoDB (size base + color suffix). */
export function buildInventorySku(
  baseSku: string,
  colorId: ProductColorId,
): string {
  return `${baseSku}-${COLOR_SKU_SUFFIX[colorId]}`;
}
