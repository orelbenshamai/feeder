import { NextRequest, NextResponse } from "next/server";
import getClientPromise from "@/lib/mongodb";
import { decrementInventory } from "@/lib/inventory";
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

    const verifiedCCode = parsed.CCode ?? parsed.Ccode ?? parsed.ccode;
    const valid = verifiedCCode === "0";

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

        // 2. Decrement inventory for each purchased SKU
        if (valid && orderDoc?.items?.length) {
          await decrementInventory(
            orderDoc.items.map((item: { sku: string; quantity: number }) => ({
              sku: item.sku,
              quantity: item.quantity,
            }))
          );
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
