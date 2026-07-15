"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatILS } from "@/lib/pricing";
import { media } from "@/lib/media";
import type { ContactData } from "@/app/api/checkout/contact/route";

const PRODUCT_FALLBACK_IMAGE: Record<string, string> = {
  prod_mesudar_feeder_001: media("medium_gray_1.png"),
  prod_mesudar_mat_001: media("mat_gray_1.png"),
};

type FormState = ContactData;

type SubmitState =
  | { status: "idle" }
  | { status: "saving" }
  | { status: "error"; message: string };

type AppliedCouponPreview = {
  code: string;
  percentOff: number;
  label: string;
};

export default function CheckoutPage() {
  const { items, hydrated, totalPrice } = useCart();
  const router = useRouter();

  const [form, setForm] = useState<FormState>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    street: "",
    city: "",
    zip: "",
  });

  const [submitState, setSubmitState] = useState<SubmitState>({ status: "idle" });
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCouponPreview | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  if (hydrated && items.length === 0) {
    router.replace("/");
    return null;
  }

  const discountAmount = appliedCoupon
    ? Math.round((totalPrice * appliedCoupon.percentOff) / 100)
    : 0;
  const payableTotal = totalPrice - discountAmount;

  function setField(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleApplyCoupon() {
    setCouponError(null);
    const code = couponInput.trim();
    if (!code) {
      setCouponError("נא להזין קוד קופון");
      return;
    }

    setCouponLoading(true);
    try {
      const res = await fetch("/api/coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = (await res.json()) as AppliedCouponPreview & { error?: string };

      if (!res.ok || !data.code) {
        setAppliedCoupon(null);
        setCouponError(data.error ?? "קוד הקופון לא תקין");
        return;
      }

      setAppliedCoupon({
        code: data.code,
        percentOff: data.percentOff,
        label: data.label,
      });
      setCouponInput(data.code);
    } catch {
      setCouponError("שגיאה בבדיקת הקופון");
    } finally {
      setCouponLoading(false);
    }
  }

  function handleRemoveCoupon() {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitState({ status: "saving" });

    try {
      // Step 1: Save order + contact to MongoDB (server applies coupon)
      const contactRes = await fetch("/api/checkout/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact: form,
          items,
          couponCode: appliedCoupon?.code,
        }),
      });
      const contactData = await contactRes.json() as { orderId?: string; error?: string };

      if (!contactData.orderId) {
        setSubmitState({ status: "error", message: contactData.error ?? "שגיאה בשמירת הפרטים" });
        return;
      }

      // Step 2: Get signed Hyp Pay URL (charges order.totalPrice from DB)
      const payRes = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, contact: form, orderId: contactData.orderId }),
      });
      const payData = await payRes.json() as { paymentUrl?: string; error?: string };

      if (!payData.paymentUrl) {
        setSubmitState({ status: "error", message: payData.error ?? "שגיאה בתהליך התשלום" });
        return;
      }

      window.location.href = payData.paymentUrl;
    } catch {
      setSubmitState({ status: "error", message: "שגיאה בחיבור לשרת" });
    }
  }

  const isLoading = submitState.status === "saving";

  return (
    <>
      <div className="flex h-screen flex-col lg:flex-row">

        {/* ── Mobile-only order summary accordion (shown above the form) ── */}
        <div dir="rtl" className="lg:hidden bg-ink">
          <button
            type="button"
            onClick={() => setSummaryOpen(o => !o)}
            className="flex w-full items-center justify-between gap-3 px-5 py-4 active:bg-white/5"
          >
            <span className="flex items-center gap-2 text-sm font-bold text-cream">
              <svg viewBox="0 0 20 20" className="h-4 w-4 text-clay" fill="none" aria-hidden>
                <path d="M6 7h11l-1.5 7H7.5L6 7Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M6 7l-1-3H3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="9" cy="17" r="1" fill="currentColor"/>
                <circle cx="14" cy="17" r="1" fill="currentColor"/>
              </svg>
              סיכום הזמנה
              <span className="rounded-sm bg-clay px-2 py-0.5 text-[11px] font-bold text-white">
                {items.reduce((s, i) => s + i.quantity, 0)}
              </span>
            </span>
            <span className="flex items-center gap-2.5">
              <span className="text-sm font-bold text-cream">{formatILS(payableTotal)}</span>
              <span className={`flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-white/8 transition-transform duration-300 ${summaryOpen ? "rotate-180" : ""}`}>
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-cream" fill="none" aria-hidden>
                  <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </span>
          </button>

          {summaryOpen && (
            <div className="border-t border-white/10 px-5 pb-5">
              <ul className="flex flex-col">
                {items.map((item, i) => (
                  <li key={item.sku} className={`flex items-center gap-3 py-4 ${i > 0 ? "border-t border-white/10" : ""}`}>
                    <div className="relative shrink-0">
                      <div className="h-14 w-14 overflow-hidden rounded-sm bg-cream/10">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.imageUrl ?? PRODUCT_FALLBACK_IMAGE[item.productId] ?? media("product_image.png")}
                          alt=""
                          className="h-full w-full object-contain p-1.5"
                          draggable={false}
                        />
                      </div>
                      <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-clay text-[9px] font-bold text-white ring-2 ring-ink">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col gap-0.5">
                      <p className="text-sm font-semibold text-cream">{item.bundleLabel ?? item.productName ?? item.sku}</p>
                      <p className="text-xs text-cream/50">{item.sizeLabel} · {item.colorLabel}</p>
                    </div>
                    <p className="shrink-0 text-sm font-semibold text-cream">{formatILS(item.price * item.quantity)}</p>
                  </li>
                ))}
              </ul>
              <OrderTotals
                subtotal={totalPrice}
                discountAmount={discountAmount}
                appliedCoupon={appliedCoupon}
                payableTotal={payableTotal}
                compact
              />
            </div>
          )}
        </div>

        {/* ── Left — address form (60%) ── */}
        <div dir="rtl" className="flex h-full flex-col bg-cream lg:w-[60%]">

          {/* Content wrapper — fixed width, right-anchored (near divider), internally centered */}
          <div className="flex h-full w-full max-w-[520px] flex-col self-end">

          {/* Logo */}
          <div className="flex shrink-0 justify-center px-12 pt-6" style={{ marginBottom: "-24px" }}>
            <Link href="/" aria-label="מסודר">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={media("full_logo.png")}
                alt="מסודר"
                className="h-32 w-auto sm:h-40"
                draggable={false}
              />
            </Link>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col px-12 pb-6 pt-4">
            <div className="mx-auto flex w-full max-w-[380px] flex-col">

              {/* Coupon first — high-visibility on the form column */}
              <CouponField
                couponInput={couponInput}
                setCouponInput={setCouponInput}
                appliedCoupon={appliedCoupon}
                couponError={couponError}
                couponLoading={couponLoading}
                onApply={handleApplyCoupon}
                onRemove={handleRemoveCoupon}
                tone="light"
                className="mb-6"
              />

              {/* Form title */}
              <h2 className="font-display mb-5 text-xl font-bold text-ink">פרטי משלוח</h2>

              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <FloatField id="firstName" label="שם פרטי" required>
                    <input
                      id="firstName"
                      type="text"
                      value={form.firstName}
                      onChange={(e) => { clearValidity(e); setField("firstName", e.target.value); }}
                      onInvalid={(e) => hebrewInvalid(e, "נא להזין שם פרטי")}
                      required
                      autoComplete="given-name"
                      placeholder=" "
                      className={floatInputCls}
                    />
                  </FloatField>
                  <FloatField id="lastName" label="שם משפחה" required>
                    <input
                      id="lastName"
                      type="text"
                      value={form.lastName}
                      onChange={(e) => { clearValidity(e); setField("lastName", e.target.value); }}
                      onInvalid={(e) => hebrewInvalid(e, "נא להזין שם משפחה")}
                      required
                      autoComplete="family-name"
                      placeholder=" "
                      className={floatInputCls}
                    />
                  </FloatField>
                </div>
                <FloatField id="phone" label="טלפון" required>
                  <input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => { clearValidity(e); setField("phone", e.target.value); }}
                    onInvalid={(e) => hebrewInvalid(e, "נא להזין מספר טלפון")}
                    required
                    autoComplete="tel"
                    placeholder=" "
                    dir="ltr"
                    className={floatInputCls}
                  />
                </FloatField>
                <FloatField id="email" label="אימייל (אופציונלי)">
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => { clearValidity(e); setField("email", e.target.value); }}
                    onInvalid={(e) => hebrewInvalid(e, "נא להזין כתובת אימייל תקינה")}
                    autoComplete="email"
                    placeholder=" "
                    dir="ltr"
                    className={floatInputCls}
                  />
                </FloatField>
              </div>

              {/* ── Delivery ── */}
              <p className="mb-2.5 mt-5 text-[11px] font-semibold uppercase tracking-widest text-stone/40">
                כתובת למשלוח
              </p>
              <div className="flex flex-col gap-3">
                <FloatField id="street" label="כתובת" required>
                  <input
                    id="street"
                    type="text"
                    value={form.street}
                    onChange={(e) => { clearValidity(e); setField("street", e.target.value); }}
                    onInvalid={(e) => hebrewInvalid(e, "נא להזין כתובת")}
                    required
                    autoComplete="street-address"
                    placeholder=" "
                    className={floatInputCls}
                  />
                </FloatField>
                <div className="grid grid-cols-2 gap-3">
                  <FloatField id="city" label="עיר" required>
                    <input
                      id="city"
                      type="text"
                      value={form.city}
                      onChange={(e) => { clearValidity(e); setField("city", e.target.value); }}
                      onInvalid={(e) => hebrewInvalid(e, "נא להזין עיר")}
                      required
                      autoComplete="address-level2"
                      placeholder=" "
                      className={floatInputCls}
                    />
                  </FloatField>
                  <FloatField id="zip" label="מיקוד">
                    <input
                      id="zip"
                      type="text"
                      value={form.zip}
                      onChange={(e) => { clearValidity(e); setField("zip", e.target.value); }}
                      autoComplete="postal-code"
                      placeholder=" "
                      dir="ltr"
                      className={floatInputCls}
                    />
                  </FloatField>
                </div>
              </div>

              {submitState.status === "error" && (
                <p className="mt-4 flex items-center gap-2 rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  <svg viewBox="0 0 16 16" className="h-4 w-4 shrink-0" fill="none" aria-hidden>
                    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.4" />
                    <path d="M8 5v3.5M8 10.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  {submitState.message}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="mt-6 flex w-full items-center justify-center gap-3 rounded-sm bg-ink px-6 py-4 text-base font-semibold tracking-wide text-cream shadow transition hover:bg-ink/85 active:scale-[0.98] disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    <span>שומר פרטים…</span>
                  </>
                ) : (
                  <>
                    {/* Arrow points left — correct RTL "forward" direction */}
                    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden>
                      <path d="M16 10H4M9 5l-5 5 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>המשך לתשלום</span>
                  </>
                )}
              </button>

              {/* Inline footer — right below the button */}
              <div className="mt-4 flex items-center justify-center gap-4 text-sm text-stone/45">
                <div className="flex items-center gap-1.5">
                  <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden>
                    <rect x="2" y="6" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
                    <path d="M5 6V4.5a3 3 0 0 1 6 0V6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                  <span>תשלום מאובטח · Hyp Pay</span>
                </div>
                <span className="text-stone/20">|</span>
                <Link href="/" className="transition-colors hover:text-stone/70">חזרה לחנות</Link>
              </div>
            </div>
          </form>

          </div>{/* /content wrapper */}
        </div>

        {/* ── Right — order summary (40%, desktop only) ── */}
        <div dir="rtl" className="hidden lg:block border-t border-white/10 bg-ink pe-16 ps-6 py-12 sm:pe-20 sm:ps-8 lg:h-full lg:w-[40%] lg:border-l lg:border-t-0 lg:overflow-y-auto">
          <div className="w-[300px]">

            {/* Section label */}
            {/* Items */}
            <ul className="flex flex-col">
              {items.map((item, i) => (
                <li
                  key={item.sku}
                  className={`flex items-center gap-4 py-5 ${i > 0 ? "border-t border-white/8" : ""}`}
                >
                  {/* Image tile — outer div unclipped so badge is always visible */}
                  <div className="relative shrink-0">
                    <div className="h-[72px] w-[72px] overflow-hidden rounded-sm bg-cream">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.imageUrl ?? PRODUCT_FALLBACK_IMAGE[item.productId] ?? media("product_image.png")}
                        alt=""
                        className="h-full w-full object-contain p-2"
                        draggable={false}
                      />
                    </div>
                    <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-clay text-[10px] font-bold leading-none text-white ring-2 ring-ink">
                      {item.quantity}
                    </span>
                  </div>

                  {/* Name + variant */}
                  <div className="flex flex-1 flex-col gap-1.5">
                    <p className="text-base font-bold leading-snug text-cream">
                      {item.bundleLabel ?? item.productName ?? item.sku}
                    </p>
                    <p className="text-sm text-cream/60">
                      {item.sizeLabel} · {item.colorLabel}
                    </p>
                  </div>

                  <p className="shrink-0 text-base font-bold text-cream">
                    {formatILS(item.price * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>

            {/* Totals */}
            <div className="border-t border-white/8 pt-5 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-cream/40">
                  סכום ביניים · {items.reduce((s, i) => s + i.quantity, 0)} פריטים
                </span>
                <span className="text-cream/80">{formatILS(totalPrice)}</span>
              </div>
              {appliedCoupon && discountAmount > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-emerald-400/90">
                    {appliedCoupon.label} ({appliedCoupon.code})
                  </span>
                  <span className="font-medium text-emerald-400">
                    −{formatILS(discountAmount)}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-cream/40">משלוח</span>
                <span className="font-medium text-emerald-400">בחינם</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-white/8 pt-4">
              <span className="text-base font-bold text-cream">סה&quot;כ</span>
              <span className="font-display text-2xl font-bold text-cream">
                {formatILS(payableTotal)}
              </span>
            </div>

          </div>
        </div>
      </div>

    </>
  );
}

function CouponField({
  couponInput,
  setCouponInput,
  appliedCoupon,
  couponError,
  couponLoading,
  onApply,
  onRemove,
  tone = "dark",
  className = "",
}: {
  couponInput: string;
  setCouponInput: (v: string) => void;
  appliedCoupon: AppliedCouponPreview | null;
  couponError: string | null;
  couponLoading: boolean;
  onApply: () => void;
  onRemove: () => void;
  tone?: "dark" | "light";
  className?: string;
}) {
  const light = tone === "light";

  if (light) {
    return (
      <div
        className={`rounded-sm border-2 border-clay/40 bg-clay/8 p-4 ${className}`}
      >
        {appliedCoupon ? (
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-clay">
                הקופון הוחל
              </p>
              <p className="mt-1 text-base font-bold text-ink">{appliedCoupon.label}</p>
              <p className="mt-0.5 text-sm text-stone/60" dir="ltr">
                {appliedCoupon.code}
              </p>
            </div>
            <button
              type="button"
              onClick={onRemove}
              className="shrink-0 text-sm font-semibold text-stone/55 transition hover:text-ink"
            >
              הסר
            </button>
          </div>
        ) : (
          <>
            <p className="font-display text-base font-bold text-ink">יש לכם קוד קופון?</p>
            <p className="mt-1 text-sm text-stone/70">הזינו אותו כאן כדי לקבל הנחה</p>
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    onApply();
                  }
                }}
                placeholder=""
                autoComplete="off"
                dir="ltr"
                className="min-w-0 flex-1 rounded-sm border-2 border-clay/30 bg-white px-4 py-3.5 text-base font-semibold tracking-wide text-ink outline-none focus:border-clay focus:ring-2 focus:ring-clay/20"
              />
              <button
                type="button"
                onClick={onApply}
                disabled={couponLoading}
                className="shrink-0 rounded-sm bg-clay px-5 py-3.5 text-base font-bold text-white transition hover:bg-clay/90 disabled:opacity-50"
              >
                {couponLoading ? "…" : "החל"}
              </button>
            </div>
          </>
        )}
        {couponError && (
          <p className="mt-2.5 text-sm font-medium text-red-600">{couponError}</p>
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      {appliedCoupon ? (
        <div className="flex items-center justify-between gap-3 rounded-sm border border-emerald-400/30 bg-emerald-400/10 px-3 py-2.5">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-emerald-300">{appliedCoupon.label}</p>
            <p className="text-xs text-cream/50" dir="ltr">
              {appliedCoupon.code}
            </p>
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="shrink-0 text-xs font-semibold text-cream/55 transition hover:text-cream"
          >
            הסר
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            type="text"
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onApply();
              }
            }}
            placeholder=""
            autoComplete="off"
            dir="ltr"
            className="min-w-0 flex-1 rounded-sm border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-cream outline-none focus:border-clay/50 focus:ring-1 focus:ring-clay/30"
          />
          <button
            type="button"
            onClick={onApply}
            disabled={couponLoading}
            className="shrink-0 rounded-sm border border-white/15 bg-white/8 px-4 py-2.5 text-sm font-semibold text-cream transition hover:bg-white/12 disabled:opacity-50"
          >
            {couponLoading ? "…" : "החל"}
          </button>
        </div>
      )}
      {couponError && (
        <p className="mt-2 text-xs font-medium text-red-300">{couponError}</p>
      )}
    </div>
  );
}

function OrderTotals({
  subtotal,
  discountAmount,
  appliedCoupon,
  payableTotal,
  compact = false,
}: {
  subtotal: number;
  discountAmount: number;
  appliedCoupon: AppliedCouponPreview | null;
  payableTotal: number;
  compact?: boolean;
}) {
  return (
    <div className={`${compact ? "mt-3" : ""} border-t border-white/10 pt-4 space-y-2`}>
      {appliedCoupon && discountAmount > 0 && (
        <>
          <div className="flex items-center justify-between text-sm text-cream/60">
            <span>סכום ביניים</span>
            <span>{formatILS(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-emerald-400">
            <span>{appliedCoupon.label}</span>
            <span>−{formatILS(discountAmount)}</span>
          </div>
        </>
      )}
      <div className="flex items-center justify-between text-sm font-bold text-cream">
        <span>סה&quot;כ</span>
        <span className={compact ? "text-base" : "text-lg"}>{formatILS(payableTotal)}</span>
      </div>
    </div>
  );
}

/**
 * Floating-label input style.
 * Input must have placeholder=" " so :placeholder-shown works for the label animation.
 */
const floatInputCls = [
  "peer w-full rounded-sm border border-stone/20 bg-white",
  "px-4 pb-2.5 pt-7",                      // room for the floating label above the value
  "text-[15px] text-ink outline-none",
  "transition-[border-color,box-shadow]",
  "placeholder:text-transparent",
  "focus:border-ink/40 focus:ring-2 focus:ring-ink/10",
  "hover:border-stone/40",
].join(" ");

/** Call on onInvalid to show a Hebrew message instead of the browser default. */
export function hebrewInvalid(
  e: React.InvalidEvent<HTMLInputElement>,
  message: string
) {
  e.currentTarget.setCustomValidity(message);
}

/** Call on onChange to clear the custom message so the field re-validates. */
export function clearValidity(e: React.ChangeEvent<HTMLInputElement>) {
  e.currentTarget.setCustomValidity("");
}

/**
 * Floating label wrapper.
 * The label animates from centre to top-inside using Tailwind peer variants.
 */
function FloatField({
  id,
  label,
  required,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      {children}
      <label
        htmlFor={id}
        className={[
          "pointer-events-none absolute start-4 font-medium transition-all duration-150",
          // Floated state (default — value present)
          "top-2.5 text-[11px] text-stone/50",
          // Resting state — empty and unfocused
          "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-[14px] peer-placeholder-shown:text-stone/40",
          // Focused — always float up
          "peer-focus:top-2.5 peer-focus:translate-y-0 peer-focus:text-[11px] peer-focus:text-ink/55",
        ].join(" ")}
      >
        {label}
        {required && <span className="ms-0.5 text-clay/60">*</span>}
      </label>
    </div>
  );
}
