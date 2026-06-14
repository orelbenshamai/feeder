import { NextRequest, NextResponse } from "next/server";
import getClientPromise from "@/lib/mongodb";

type StockNotifyPayload = {
  phone?: string;
  productId?: string;
  productSlug?: string;
  productName?: string;
  sizeId?: string;
  sizeLabel?: string;
  colorId?: string;
  colorLabel?: string;
  sku?: string;
  bundleEnabled?: boolean;
  bundleSku?: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as StockNotifyPayload;
    const {
      phone,
      productId,
      productSlug,
      productName,
      sizeId,
      sizeLabel,
      colorId,
      colorLabel,
      sku,
      bundleEnabled,
      bundleSku,
    } = body;

    if (
      !phone ||
      !productId ||
      !productSlug ||
      !productName ||
      !sizeId ||
      !sizeLabel ||
      !colorId ||
      !colorLabel ||
      !sku
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (!/^[\d\s\-+]{7,20}$/.test(phone.trim())) {
      return NextResponse.json(
        { error: "Invalid phone number" },
        { status: 400 },
      );
    }

    const client = await getClientPromise();
    const db = client.db("Mesudar");
    const collection = db.collection("sold_out_requests");

    const notifyKey = {
      phone: phone.trim(),
      sku: bundleEnabled && bundleSku ? bundleSku : sku,
    };

    const existing = await collection.findOne(notifyKey);
    if (existing) {
      return NextResponse.json({ ok: true, duplicate: true }, { status: 200 });
    }

    await collection.insertOne({
      ...notifyKey,
      productId,
      productSlug,
      productName,
      sizeId,
      sizeLabel,
      colorId,
      colorLabel,
      baseSku: sku,
      bundleEnabled: Boolean(bundleEnabled),
      bundleSku: bundleEnabled && bundleSku ? bundleSku : null,
      submittedAt: new Date(),
      source: req.headers.get("referer") ?? "direct",
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("[/api/stock-notify]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
