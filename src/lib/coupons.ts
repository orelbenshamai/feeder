export type Coupon = {
  code: string;
  percentOff: number;
  label: string;
};

export type AppliedCoupon = {
  code: string;
  percentOff: number;
  label: string;
  discountAmount: number;
};

/** Active site coupon — override the code via COUPON_CODE env (server only). */
export function getActiveCoupon(): Coupon {
  const code = (process.env.COUPON_CODE ?? "MESUDAR15").trim().toUpperCase();
  return {
    code,
    percentOff: 15,
    label: "הנחה 15%",
  };
}

export function normalizeCouponCode(input: string): string {
  return input.trim().toUpperCase();
}

export function lookupCoupon(input: string | undefined | null): Coupon | null {
  if (!input) return null;
  const code = normalizeCouponCode(input);
  if (!code) return null;

  const active = getActiveCoupon();
  if (code === active.code) return active;
  return null;
}

export function applyCoupon(
  subtotal: number,
  coupon: Coupon
): AppliedCoupon {
  const discountAmount = Math.round((subtotal * coupon.percentOff) / 100);
  return {
    code: coupon.code,
    percentOff: coupon.percentOff,
    label: coupon.label,
    discountAmount: Math.min(discountAmount, subtotal),
  };
}

export function cartSubtotal(
  items: { price: number; quantity: number }[]
): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
