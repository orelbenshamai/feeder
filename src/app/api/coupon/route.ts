import { NextRequest, NextResponse } from "next/server";
import { lookupCoupon, normalizeCouponCode } from "@/lib/coupons";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { code?: string };
    const code = normalizeCouponCode(body.code ?? "");

    if (!code) {
      return NextResponse.json({ error: "נא להזין קוד קופון" }, { status: 400 });
    }

    const coupon = lookupCoupon(code);
    if (!coupon) {
      return NextResponse.json({ error: "קוד הקופון לא תקין" }, { status: 404 });
    }

    return NextResponse.json({
      code: coupon.code,
      percentOff: coupon.percentOff,
      label: coupon.label,
    });
  } catch (err) {
    console.error("[/api/coupon]", err);
    return NextResponse.json({ error: "שגיאה בבדיקת הקופון" }, { status: 500 });
  }
}
