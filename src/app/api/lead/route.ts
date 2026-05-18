import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { dogSize, phone } = body as { dogSize?: string; phone?: string };

    if (!dogSize || !phone) {
      return NextResponse.json(
        { error: "dogSize and phone are required" },
        { status: 400 }
      );
    }

    // Basic phone sanity — digits, spaces, dashes, optional leading +
    if (!/^[\d\s\-+]{7,20}$/.test(phone.trim())) {
      return NextResponse.json(
        { error: "Invalid phone number" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("Mesudar");
    const collection = db.collection("pre_order_requests");

    // Prevent duplicate phone submissions
    const existing = await collection.findOne({ phone: phone.trim() });
    if (existing) {
      // Treat as success from the user's POV — don't double-insert
      return NextResponse.json({ ok: true, duplicate: true }, { status: 200 });
    }

    await collection.insertOne({
      dogSize,
      phone: phone.trim(),
      submittedAt: new Date(),
      source: req.headers.get("referer") ?? "direct",
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("[/api/lead]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
