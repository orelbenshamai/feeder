"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { createPortal } from "react-dom";
import { lockPageScroll, unlockPageScroll } from "@/lib/scroll-lock";
import type {
  BundleUpsellOffer,
  Product,
  ProductColorId,
  ProductVariant,
} from "@/types/product";

type StockNotifyActionProps = {
  product: Product;
  variant: ProductVariant;
  colorId: ProductColorId;
  colorLabel: string;
  bundleEnabled?: boolean;
  bundleUpsell?: BundleUpsellOffer;
  className?: string;
};

export default function StockNotifyAction({
  product,
  variant,
  colorId,
  colorLabel,
  bundleEnabled = false,
  bundleUpsell,
  className = "",
}: StockNotifyActionProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`
          inline-flex w-full items-center justify-center gap-2
          border-2 border-clay bg-clay px-6 py-3.5
          font-bold tracking-widest uppercase text-sm rounded-sm
          text-cream transition-all duration-300 ease-in-out
          hover:bg-clay/90 shadow-[0_8px_32px_rgba(255,159,10,0.25)]
          ${className}
        `}
      >
        <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0" fill="none" aria-hidden>
          <path
            d="M10 3a5 5 0 00-5 5v2.5L4 12.5h12l-1-2.5V8a5 5 0 00-5-5Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path d="M8.5 12.5a1.5 1.5 0 003 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span>הודיעו לי כשחוזר למלאי</span>
      </button>

      {open ? (
        <StockNotifyModal
          product={product}
          variant={variant}
          colorId={colorId}
          colorLabel={colorLabel}
          bundleEnabled={bundleEnabled}
          bundleUpsell={bundleUpsell}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </>
  );
}

type StockNotifyModalProps = {
  product: Product;
  variant: ProductVariant;
  colorId: ProductColorId;
  colorLabel: string;
  bundleEnabled?: boolean;
  bundleUpsell?: BundleUpsellOffer;
  onClose: () => void;
};

function StockNotifyModal({
  product,
  variant,
  colorId,
  colorLabel,
  bundleEnabled = false,
  bundleUpsell,
  onClose,
}: StockNotifyModalProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectionLabel = [
    variant.sizeLabel,
    colorLabel,
    bundleEnabled && bundleUpsell ? bundleUpsell.bundleLabel : null,
  ]
    .filter(Boolean)
    .join(" · ");

  useEffect(() => {
    lockPageScroll();
    return () => unlockPageScroll();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    const t = window.setTimeout(() => phoneRef.current?.focus(), 50);
    return () => window.clearTimeout(t);
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const phone = fd.get("phone") as string;
    const nameRaw = (fd.get("name") as string | null)?.trim() || undefined;
    const bundleSku =
      bundleEnabled && bundleUpsell
        ? bundleUpsell.bundleSkuBySize[variant.id]
        : undefined;

    try {
      const res = await fetch("/api/stock-notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          name: nameRaw,
          productId: product.id,
          productSlug: product.slug,
          productName: product.name,
          sizeId: variant.id,
          sizeLabel: variant.sizeLabel,
          colorId,
          colorLabel,
          sku: variant.sku,
          bundleEnabled,
          bundleSku,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          (data as { error?: string }).error ?? "שגיאה בשמירה, נסו שוב",
        );
      }

      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "שגיאה, נסו שוב");
    } finally {
      setLoading(false);
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-6"
      role="presentation"
    >
      <button
        type="button"
        aria-label="סגור חלון"
        className="absolute inset-0 bg-ink/65 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="
          stock-notify-modal relative z-[101] w-full bg-cream
          rounded-t-[2rem] shadow-[0_-24px_90px_-20px_rgba(31,58,82,0.45)] ring-1 ring-black/10
          sm:max-w-[34rem] sm:rounded-[2rem] sm:shadow-[0_48px_96px_-32px_rgba(31,58,82,0.5)]
        "
      >
        <div className="flex justify-center pt-4 pb-2 sm:hidden">
          <span className="h-1.5 w-12 rounded-full bg-line" aria-hidden />
        </div>

        <div
          dir="rtl"
          className="px-7 pb-[calc(1.75rem+env(safe-area-inset-bottom))] pt-4 sm:px-10 sm:pb-10 sm:pt-10"
        >
          {!done ? (
            <>
              <button
                type="button"
                onClick={onClose}
                aria-label="סגור"
                className="absolute left-4 top-4 grid h-11 w-11 place-items-center rounded-full text-ink/60 transition hover:bg-soft hover:text-ink sm:left-5 sm:top-5"
              >
                <span aria-hidden className="relative block h-3.5 w-3.5">
                  <span className="absolute inset-x-0 top-1/2 h-px rotate-45 bg-current" />
                  <span className="absolute inset-x-0 top-1/2 h-px -rotate-45 bg-current" />
                </span>
              </button>

              <div className="text-center">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-stone sm:text-sm">
                  המלאי אזל — הביקוש גבר על הציפיות
                </p>
                <h2
                  id={titleId}
                  className="font-display mt-4 text-[clamp(1.85rem,6.5vw,2.35rem)] font-bold leading-[1.1] tracking-tight text-ink sm:mt-5 sm:text-[2.5rem]"
                >
                  הרצפה הנקייה מחכה לכם
                </h2>
                <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-ink/72 sm:mt-5 sm:text-[17px] sm:leading-[1.7]">
                  השאירו מספר ונודיע לכם ראשונים כשהמלאי חוזר. אין ספאם — רק הודעה אחת בוואטסאפ כשאפשר להזמין.
                </p>
              </div>

              <form
                className="mt-7 flex flex-col gap-5 sm:mt-9 sm:gap-6"
                onSubmit={handleSubmit}
              >
                <label className="block">
                  <span className="mb-2 flex items-center gap-1.5 text-sm font-bold text-ink/85 sm:text-base">
                    שם
                    <span className="text-xs font-normal text-stone">(אופציונלי)</span>
                  </span>
                  <input
                    name="name"
                    type="text"
                    autoComplete="given-name"
                    placeholder="השם שלך"
                    dir="rtl"
                    className="w-full rounded-2xl border-2 border-line bg-cream px-5 py-4 text-start text-[17px] text-ink placeholder:text-stone/50 outline-none transition focus:border-clay focus:ring-4 focus:ring-clay/20 sm:py-[1.125rem] sm:text-[18px]"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-ink/85 sm:text-base">
                    טלפון / וואטסאפ
                  </span>
                  <input
                    ref={phoneRef}
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="050-1234567"
                    inputMode="tel"
                    pattern="[0-9\-\s+]{9,}"
                    required
                    dir="ltr"
                    className="w-full rounded-2xl border-2 border-line bg-cream px-5 py-4 text-start text-[17px] text-ink placeholder:text-stone/50 outline-none transition focus:border-clay focus:ring-4 focus:ring-clay/20 sm:py-[1.125rem] sm:text-[18px]"
                  />
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-clay group mt-1 min-h-[3.75rem] w-full text-base font-bold sm:min-h-[4rem] sm:text-lg disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                      </svg>
                      שומרים…
                    </span>
                  ) : (
                    "עדכנו אותי כשחוזר למלאי"
                  )}
                </button>

                {error ? (
                  <p role="alert" className="text-center text-sm font-semibold text-red-600 sm:text-base">
                    {error}
                  </p>
                ) : null}

                <p className="text-center text-xs leading-relaxed text-stone sm:text-sm">
                  הודעה אחת בוואטסאפ בלבד · ללא ספאם · מלאי מוגבל לפי סדר ההרשמה
                </p>
              </form>
            </>
          ) : (
            <div className="py-8 text-center sm:py-12">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-clay/15 text-clay ring-1 ring-clay/30 sm:h-[4.5rem] sm:w-[4.5rem]">
                <svg viewBox="0 0 24 24" className="h-8 w-8 sm:h-9 sm:w-9" fill="none" aria-hidden>
                  <path
                    d="M6 12.5 10 16.5 18 8.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="font-display mt-6 text-[clamp(1.75rem,5vw,2.15rem)] font-bold text-ink sm:text-[2.25rem]">
                רשמנו — נעדכן בוואטסאפ
              </p>
              <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-ink/72 sm:text-[17px]">
                ברגע שהמלאי חוזר תקבלו הודעה עם קישור ישיר. אלפי בעלי כלבים וחתולים כבר הפסיקו לנקות אחרי כל ארוחה — בקרוב גם אתם.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-8 inline-flex min-h-[3.25rem] items-center justify-center rounded-full bg-ink px-9 text-[15px] font-bold text-cream transition hover:bg-ink/90 sm:min-h-[3.5rem] sm:px-10 sm:text-base"
              >
                חזרה למוצר
              </button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
