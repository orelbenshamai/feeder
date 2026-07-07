import { NextRequest, NextResponse } from "next/server";
import getClientPromise from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  const orderId = req.nextUrl.searchParams.get("orderId");
  if (!orderId) {
    return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
  }

  try {
    const client = await getClientPromise();
    const order = await client.db().collection("orders").findOne(
      { orderId },
      { projection: { _id: 0 } }
    );

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (err) {
    console.error("[/api/checkout/order]", err);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}
