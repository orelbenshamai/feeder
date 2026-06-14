"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
} from "react";
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
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
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

    const phone = new FormData(e.currentTarget).get("phone") as string;
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

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-6"
      role="presentation"
    >
      <button
        type="button"
        aria-label="סגור חלון"
        className="absolute inset-0 bg-ink/55 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="
          relative z-[101] w-full bg-cream
          rounded-t-3xl shadow-[0_-20px_80px_-24px_rgba(31,58,82,0.35)] ring-1 ring-black/10
          sm:max-w-[26rem] sm:rounded-3xl sm:shadow-[0_40px_80px_-30px_rgba(31,58,82,0.45)]
        "
      >
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <span className="h-1 w-10 rounded-full bg-line" aria-hidden />
        </div>

        <div
          dir="rtl"
          className="px-6 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-3 sm:px-7 sm:pb-7 sm:pt-7"
        >
          {!done ? (
            <>
              <button
                type="button"
                onClick={onClose}
                aria-label="סגור"
                className="absolute left-3 top-3 grid h-9 w-9 place-items-center rounded-full text-ink/60 transition hover:bg-soft hover:text-ink sm:left-4 sm:top-4"
              >
                <span aria-hidden className="relative block h-3 w-3">
                  <span className="absolute inset-x-0 top-1/2 h-px rotate-45 bg-current" />
                  <span className="absolute inset-x-0 top-1/2 h-px -rotate-45 bg-current" />
                </span>
              </button>

              <div className="text-center">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-stone">
                  אזל המלאי
                </p>
                <h2
                  id={titleId}
                  className="font-display mt-3 text-[1.45rem] font-medium leading-[1.15] tracking-tight text-ink sm:text-[1.6rem]"
                >
                  נודיע לכם כשזה חוזר
                </h2>
                <p className="mx-auto mt-3 max-w-xs text-[13.5px] leading-relaxed text-ink/70">
                  {product.category}{" "}
                  <span className="text-clay" style={{ fontFamily: "var(--font-nunito)" }}>
                    MESUDAR
                  </span>
                  {selectionLabel ? ` · ${selectionLabel}` : ""}
                </p>
              </div>

              <form
                className="mt-5 flex flex-col gap-4 sm:mt-6"
                onSubmit={handleSubmit}
              >
                <label className="block">
                  <span className="mb-1.5 block text-[12.5px] font-semibold text-ink/80">
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
                    className="w-full rounded-xl border border-line bg-cream px-4 py-3.5 text-start text-[15px] text-ink placeholder:text-stone/50 outline-none transition focus:border-clay focus:ring-2 focus:ring-clay/25"
                  />
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-clay group mt-1 w-full disabled:cursor-not-allowed disabled:opacity-60"
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
                    "שלחו לי עדכון"
                  )}
                </button>

                {error ? (
                  <p role="alert" className="text-center text-[12px] font-medium text-red-600">
                    {error}
                  </p>
                ) : null}

                <p className="text-center text-[11px] leading-relaxed text-stone">
                  נשלח עדכון בוואטסאפ כשהמלאי חוזר · ללא ספאם
                </p>
              </form>
            </>
          ) : (
            <div className="py-6 text-center sm:py-10">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-clay/15 text-clay ring-1 ring-clay/30">
                <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden>
                  <path
                    d="M6 12.5 10 16.5 18 8.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="font-display mt-5 text-[1.6rem] font-medium text-ink">
                רשמנו אתכם
              </p>
              <p className="mx-auto mt-3 max-w-xs text-[13.5px] leading-relaxed text-ink/70">
                ברגע שהמלאי חוזר — נשלח לכם הודעה עם קישור ישיר להזמנה
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-full bg-ink px-7 text-[14px] font-semibold text-cream transition hover:bg-ink/90"
              >
                חזרה למוצר
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
