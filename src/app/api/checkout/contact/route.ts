import { NextRequest, NextResponse } from "next/server";
import getClientPromise from "@/lib/mongodb";
import { getInventoryByProductId } from "@/lib/inventory";
import type { CartLineItem } from "@/types/product";

export type ContactData = {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  street: string;
  city: string;
  zip?: string;
};

export async function POST(req: NextRequest) {
  try {
    const { contact, items, totalPrice } = (await req.json()) as {
      contact: ContactData;
      items: CartLineItem[];
      totalPrice: number;
    };

    if (!contact?.firstName || !contact?.phone || !items?.length) {
      return NextResponse.json({ error: "Missing required data" }, { status: 400 });
    }

    // ── Inventory validation ──────────────────────────────────────────────────
    // Group items by productId so we do one DB fetch per product
    const productIds = [...new Set(items.map((i) => i.productId))];
    for (const productId of productIds) {
      const inventory = await getInventoryByProductId(productId);
      if (!inventory) continue; // if inventory doc missing, allow (fail open)

      const productItems = items.filter((i) => i.productId === productId);
      for (const item of productItems) {
        // Match by sizeId+colorId since inventory SKUs include the color suffix
        const sizeVariants = inventory.variants.filter((v) => v.sizeId === item.sizeId);
        const inv = sizeVariants.find((v) => v.colorId === item.colorId) ?? sizeVariants[0];
        if (!inv) continue;

        if (!inv.inStock || inv.quantity <= 0) {
          return NextResponse.json(
            { error: `הפריט "${item.sizeLabel} / ${item.colorLabel}" אזל מהמלאי` },
            { status: 409 }
          );
        }

        if (inv.quantity < item.quantity) {
          return NextResponse.json(
            { error: `נשארו רק ${inv.quantity} יחידות של "${item.sizeLabel} / ${item.colorLabel}"` },
            { status: 409 }
          );
        }
      }
    }
    // ─────────────────────────────────────────────────────────────────────────

    const orderId = `ORD-${Date.now()}`;

    const client = await getClientPromise();
    const db = client.db();
    await db.collection("orders").insertOne({
      orderId,
      status: "pending",
      contact,
      items,
      totalPrice,
      createdAt: new Date(),
    });

    return NextResponse.json({ orderId });
  } catch (err) {
    console.error("[/api/checkout/contact]", err);
    return NextResponse.json({ error: "Failed to save order" }, { status: 500 });
  }
}
