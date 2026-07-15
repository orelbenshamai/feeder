import { NextRequest, NextResponse } from "next/server";
import getClientPromise from "@/lib/mongodb";
import { getInventoryByProductId } from "@/lib/inventory";
import { applyCoupon, cartSubtotal, lookupCoupon } from "@/lib/coupons";
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
    const { contact, items, couponCode } = (await req.json()) as {
      contact: ContactData;
      items: CartLineItem[];
      totalPrice?: number;
      couponCode?: string;
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

    const subtotal = cartSubtotal(items);
    const coupon = lookupCoupon(couponCode);
    if (couponCode?.trim() && !coupon) {
      return NextResponse.json({ error: "קוד הקופון לא תקין" }, { status: 400 });
    }

    const applied = coupon ? applyCoupon(subtotal, coupon) : null;
    const totalPrice = subtotal - (applied?.discountAmount ?? 0);

    const orderId = `ORD-${Date.now()}`;

    const client = await getClientPromise();
    const db = client.db();
    await db.collection("orders").insertOne({
      orderId,
      status: "pending",
      contact,
      items,
      subtotal,
      ...(applied
        ? {
            couponCode: applied.code,
            discountPercent: applied.percentOff,
            discountAmount: applied.discountAmount,
            couponLabel: applied.label,
          }
        : {}),
      totalPrice,
      createdAt: new Date(),
    });

    return NextResponse.json({
      orderId,
      subtotal,
      totalPrice,
      discountAmount: applied?.discountAmount ?? 0,
      couponCode: applied?.code ?? null,
    });
  } catch (err) {
    console.error("[/api/checkout/contact]", err);
    return NextResponse.json({ error: "Failed to save order" }, { status: 500 });
  }
}
