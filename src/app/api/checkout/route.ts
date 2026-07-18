import { NextRequest, NextResponse } from "next/server";
import getClientPromise from "@/lib/mongodb";
import type { CartLineItem } from "@/types/product";
import type { ContactData } from "@/app/api/checkout/contact/route";

const HYP_HOST = "https://pay.hyp.co.il/p/";

type HypSignResponse = Record<string, string>;

async function hypApiSign(params: Record<string, string | number | boolean>) {
  const form = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null) form.set(k, String(v));
  }

  const res = await fetch(HYP_HOST, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form.toString(),
  });

  if (!res.ok) {
    throw new Error(`Hyp Pay returned HTTP ${res.status}`);
  }

  const text = await res.text();

  // Response is key=value&key2=value2 pairs (may use + for spaces)
  const safeDecode = (s: string) => {
    try { return decodeURIComponent(s); } catch { return s; }
  };

  const parsed: HypSignResponse = {};
  for (const pair of text.replace(/\+/g, " ").split("&")) {
    const eq = pair.indexOf("=");
    if (eq === -1) continue;
    parsed[safeDecode(pair.slice(0, eq))] = safeDecode(pair.slice(eq + 1));
  }
  return parsed;
}

function buildPaymentUrl(
  signParams: HypSignResponse,
  extra?: Record<string, string>
): string {
  const BLOCKLIST = new Set(["KEY", "PassP"]);
  const url = new URL(HYP_HOST);
  for (const [k, v] of Object.entries(signParams)) {
    if (!BLOCKLIST.has(k) && v !== "") url.searchParams.set(k, v);
  }
  // Hyp doesn't echo redirect URLs back in the sign response — append them manually
  if (extra) {
    for (const [k, v] of Object.entries(extra)) {
      if (v) url.searchParams.set(k, v);
    }
  }
  return url.toString();
}

export async function POST(req: NextRequest) {
  try {
    const { items, contact, orderId: existingOrderId } = (await req.json()) as {
      items?: CartLineItem[];
      contact?: ContactData;
      orderId?: string;
    };

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    if (!existingOrderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    const key = process.env.HYP_KEY;
    const masof = process.env.HYP_MASOF;
    const passp = process.env.HYP_PASSP;

    if (!key || !masof) {
      console.error("[/api/checkout] Missing HYP_KEY or HYP_MASOF env vars");
      return NextResponse.json(
        { error: "Payment not configured" },
        { status: 503 }
      );
    }

    // Charge the order total stored at contact-save time (includes coupon discount)
    const client = await getClientPromise();
    const db = client.db();
    const order = await db.collection("orders").findOne({ orderId: existingOrderId });

    if (!order || order.status !== "pending") {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const storedTotal = Number(order.totalPrice);
    if (!Number.isFinite(storedTotal) || storedTotal <= 0) {
      return NextResponse.json({ error: "Invalid order total" }, { status: 400 });
    }

    const testAmount =
      process.env.NODE_ENV === "development" &&
      process.env.HYP_TEST_AMOUNT === "true";
    const totalILS = testAmount ? 1 : storedTotal;

    const orderId = existingOrderId;
    const info = items
      .map((i) => `${i.bundleLabel ?? i.productName ?? i.sizeLabel} x${i.quantity}`)
      .join(", ");

    const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL ?? "").replace(/\/$/, "");
    const successUrl = `${baseUrl}/checkout/success`;
    const cancelUrl  = `${baseUrl}/checkout?cancelled=1`;

    const signParams: Record<string, string | number | boolean> = {
      action: "APISign",
      What: "SIGN",
      KEY: key,
      Masof: masof,
      Amount: totalILS,
      Info: info,
      Order: orderId,
      UTF8: "True",
      UTF8out: "True",
      Sign: "True",
      PageLang: "HEB",
      Tash: 1,         // single payment only
      FixTash: "True", // lock it — no installment selector or פירוט shown
      tmp: 7,          // minimal page template
      // Redirect URLs — Hyp appends CCode, Id, Amount, Sign, Order to successUrl
      SuccessUrl: successUrl,
      ErrorUrl: successUrl,  // success page handles failed state via CCode
      CancelUrl: cancelUrl,
    };

    // Forward contact data to pre-fill Hyp's form fields
    if (contact) {
      if (contact.firstName) signParams.ClientName = contact.firstName;
      if (contact.lastName)  signParams.ClientLName = contact.lastName;
      if (contact.phone)     signParams.cell = contact.phone;
      if (contact.email)     signParams.email = contact.email;
      if (contact.street)    signParams.street = contact.street;
      if (contact.city)      signParams.city = contact.city;
      if (contact.zip)       signParams.zip = contact.zip;
    }

    if (passp) signParams.PassP = passp;

    const signResponse = await hypApiSign(signParams);

    if (!signResponse.signature) {
      console.error("[/api/checkout] Unexpected Hyp response:", signResponse);
      return NextResponse.json(
        { error: "Could not initiate payment" },
        { status: 502 }
      );
    }

    const paymentUrl = buildPaymentUrl(signResponse, {
      SuccessUrl: successUrl,
      ErrorUrl: successUrl,
      CancelUrl: cancelUrl,
    });
    return NextResponse.json({ paymentUrl, orderId });
  } catch (err) {
    console.error("[/api/checkout]", err);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
