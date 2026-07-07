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

/**
 * Decrement quantity for each SKU in an order.
 * Called after a successful payment verification.
 */
export async function decrementInventory(
  items: Array<{ sku: string; quantity: number }>
): Promise<void> {
  const client = await getClientPromise();
  const col = client.db().collection("inventory");

  for (const { sku, quantity } of items) {
    // Decrement quantity; the merge function will derive inStock from quantity at read time.
    await col.updateOne(
      { "variants.sku": sku },
      {
        $inc: { "variants.$.quantity": -quantity },
        $set: { updatedAt: new Date() },
      }
    );
  }
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
