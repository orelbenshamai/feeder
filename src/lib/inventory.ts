import getClientPromise from "@/lib/mongodb";

export type InventoryVariant = {
  sku: string;
  sizeId: string;
  sizeLabel: string;
  sizeDimensions: string;
  colorId: string;
  colorLabel: string;
  colorHex: string;
  price: number;
  compareAtPrice: number;
  quantity: number;
  inStock: boolean;
  images: {
    primary: string;
    gallery: string[];
  };
};

export type InventoryProduct = {
  productId: string;
  name: string;
  variants: InventoryVariant[];
  bundleAddonPriceBySize?: Record<string, number>;
  updatedAt?: Date;
};

/** Fetch the full inventory document for a product. */
export async function getInventoryByProductId(
  productId: string
): Promise<InventoryProduct | null> {
  try {
    const client = await getClientPromise();
    const doc = await client
      .db()
      .collection<InventoryProduct>("inventory")
      .findOne({ productId });
    return doc ?? null;
  } catch {
    return null;
  }
}

/** Fetch all inventory documents (for the catalog / admin). */
export async function getAllInventory(): Promise<InventoryProduct[]> {
  try {
    const client = await getClientPromise();
    return await client
      .db()
      .collection<InventoryProduct>("inventory")
      .find({})
      .toArray();
  } catch {
    return [];
  }
}

/** Resolve the inventory SKU for a product size + color. */
export async function resolveInventorySku(
  productId: string,
  sizeId: string,
  colorId: string,
): Promise<string | null> {
  const inventory = await getInventoryByProductId(productId);
  if (!inventory) return null;

  const match =
    inventory.variants.find(
      (v) => v.sizeId === sizeId && v.colorId === colorId,
    ) ?? inventory.variants.find((v) => v.sizeId === sizeId);

  return match?.sku ?? null;
}

/**
 * Decrement quantity for each SKU in an order.
 * Called after a successful payment verification.
 */
export async function decrementInventory(
  items: Array<{ sku: string; quantity: number }>,
): Promise<void> {
  const client = await getClientPromise();
  const col = client.db().collection("inventory");

  for (const { sku, quantity } of items) {
    const result = await col.updateOne(
      { "variants.sku": sku },
      {
        $inc: { "variants.$.quantity": -quantity },
        $set: { updatedAt: new Date() },
      },
    );

    if (result.matchedCount === 0) {
      console.error(`[inventory] decrement missed — no variant for SKU ${sku}`);
      continue;
    }

    await col.updateOne(
      { "variants.sku": sku, "variants.$.quantity": { $lte: 0 } },
      {
        $set: { "variants.$.inStock": false, "variants.$.quantity": 0 },
      },
    );
  }
}

type DecrementLine = {
  productId: string;
  sizeId: string;
  colorId: string;
  quantity: number;
  sku?: string;
  bundleComponents?: Array<{
    productId: string;
    sizeId: string;
    colorId: string;
    sku?: string;
  }>;
};

/** Map order line items to inventory SKUs (size+color), not cart base SKUs. */
export async function resolveSkusToDecrement(
  items: DecrementLine[],
): Promise<Array<{ sku: string; quantity: number }>> {
  const skusToDecrement: Array<{ sku: string; quantity: number }> = [];

  for (const item of items) {
    if (item.bundleComponents?.length) {
      for (const component of item.bundleComponents) {
        const sku =
          (await resolveInventorySku(
            component.productId,
            component.sizeId,
            component.colorId,
          )) ?? component.sku;

        if (!sku) {
          console.error(
            "[inventory] could not resolve bundle component SKU",
            component,
          );
          continue;
        }

        skusToDecrement.push({ sku, quantity: item.quantity });
      }
      continue;
    }

    const sku =
      (await resolveInventorySku(item.productId, item.sizeId, item.colorId)) ??
      item.sku;

    if (!sku) {
      console.error("[inventory] could not resolve line item SKU", item);
      continue;
    }

    skusToDecrement.push({ sku, quantity: item.quantity });
  }

  return skusToDecrement;
}

/**
 * Overlay inventory data (inStock, price, compareAtPrice) onto a Product's
 * variants. Call this in getProductBySlug to keep the UI live.
 */
export function mergeInventoryIntoVariants<
  V extends { id: string; sku: string; inStock: boolean; price: number; compareAtPrice?: number }
>(variants: V[], inventory: InventoryProduct | null): V[] {
  if (!inventory) return variants;

  return variants.map((v) => {
    // Match all inventory variants for this size (there may be one per color)
    const sizeVariants = inventory.variants.filter((iv) => iv.sizeId === v.id);
    if (sizeVariants.length === 0) return v;

    // Size is in stock if ANY color has stock
    const inStock = sizeVariants.some((iv) => iv.inStock && iv.quantity > 0);

    // Use the first size variant for price (all colors share the same price)
    const primary = sizeVariants[0];

    return {
      ...v,
      inStock,
      price: primary.price,
      compareAtPrice: primary.compareAtPrice,
    };
  });
}
