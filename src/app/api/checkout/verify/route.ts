import { NextRequest, NextResponse } from "next/server";
import getClientPromise from "@/lib/mongodb";
import { decrementInventory } from "@/lib/inventory";
import { sendManagerOrderNotification } from "@/lib/email";
import { sendWhatsApp, buildInvoiceMessage } from "@/lib/whatsapp";

const HYP_HOST = "https://pay.hyp.co.il/p/";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Record<string, string>;
    const { Id, CCode, Sign, Amount, ...rest } = body;

    if (!Id || CCode === undefined || !Sign) {
      return NextResponse.json(
        { error: "Missing required verification params" },
        { status: 400 }
      );
    }

    const key = process.env.HYP_KEY;
    const masof = process.env.HYP_MASOF;
    const passp = process.env.HYP_PASSP;

    if (!key || !masof) {
      return NextResponse.json(
        { error: "Payment not configured" },
        { status: 503 }
      );
    }

    const form = new URLSearchParams({
      action: "APISign",
      What: "VERIFY",
      KEY: key,
      Masof: masof,
      Id,
      CCode,
      Sign,
      Amount: Amount ?? "",
      UTF8: "True",
      UTF8out: "True",
      ...rest,
    });
    if (passp) form.set("PassP", passp);

    const res = await fetch(HYP_HOST, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
    });

    const text = await res.text();
    const safeDecode = (s: string) => {
      try { return decodeURIComponent(s); } catch { return s; }
    };

    const parsed: Record<string, string> = {};
    for (const pair of text.replace(/\+/g, " ").split("&")) {
      const eq = pair.indexOf("=");
      if (eq === -1) continue;
      parsed[safeDecode(pair.slice(0, eq))] = safeDecode(pair.slice(eq + 1));
    }

    const verifiedCCode = parsed.CCode ?? parsed.Ccode ?? parsed.ccode ?? parsed.Status ?? parsed.status;

    // CCode=0 in Hyp's redirect URL is the authoritative success signal.
    // Their verify API inconsistently omits CCode in the response, so we trust the redirect.
    const valid = CCode === "0" || verifiedCCode === "0";

    // Update order status + decrement inventory on success
    const orderId = rest.Order;
    if (orderId) {
      try {
        const client = await getClientPromise();
        const db = client.db();

        // 1. Update order status
        const orderDoc = await db.collection("orders").findOneAndUpdate(
          { orderId },
          {
            $set: {
              status: valid ? "paid" : "failed",
              paidAt: valid ? new Date() : undefined,
              hypTransactionId: Id,
            },
          },
          { returnDocument: "after" }
        );

        // 2. Decrement inventory for each purchased SKU (including bundle components)
        if (valid && orderDoc?.items?.length) {
          type OrderItem = {
            sku: string;
            quantity: number;
            bundleComponents?: Array<{ sku: string }>;
          };
          const skusToDecrement: Array<{ sku: string; quantity: number }> = [];
          for (const item of orderDoc.items as OrderItem[]) {
            if (item.bundleComponents?.length) {
              // Bundle: the main sku is a composite key not in inventory.
              // Decrement each individual component instead.
              for (const component of item.bundleComponents) {
                skusToDecrement.push({ sku: component.sku, quantity: item.quantity });
              }
            } else {
              skusToDecrement.push({ sku: item.sku, quantity: item.quantity });
            }
          }
          await decrementInventory(skusToDecrement);
        }

        // 3. Send WhatsApp invoice to customer
        if (valid && orderDoc?.contact?.phone) {
          const message = buildInvoiceMessage({
            orderId: orderDoc.orderId,
            items: orderDoc.items ?? [],
            paidAmount: Number(Amount ?? orderDoc.totalPrice ?? 0),
            contact: orderDoc.contact,
          });
          sendWhatsApp(orderDoc.contact.phone, message).catch((e) =>
            console.error("[/api/checkout/verify] WhatsApp invoice failed:", e)
          );
        }

        // 4. Email order notification to business manager
        if (valid && orderDoc) {
          sendManagerOrderNotification({
            orderId: orderDoc.orderId,
            items: orderDoc.items ?? [],
            paidAmount: Number(Amount ?? orderDoc.totalPrice ?? 0),
            contact: orderDoc.contact,
            hypTransactionId: Id,
          }).catch((e) =>
            console.error("[/api/checkout/verify] Manager email failed:", e)
          );
        }
      } catch (dbErr) {
        console.error("[/api/checkout/verify] DB update failed:", dbErr);
      }
    }

    return NextResponse.json({ valid, ccode: verifiedCCode ?? CCode });
  } catch (err) {
    console.error("[/api/checkout/verify]", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
