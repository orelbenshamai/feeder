"use client";
import { media } from "@/lib/media";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import MediaImage from "@/components/MediaImage";
import { useCart } from "@/context/CartContext";
import { formatILS } from "@/lib/pricing";
import { lockPageScroll, unlockPageScroll } from "@/lib/scroll-lock";

const PRODUCT_FALLBACK_IMAGE: Record<string, string> = {
  prod_mesudar_feeder_001: media("medium_gray_1"),
  prod_mesudar_mat_001: media("mat_gray_1"),
};

const EASE = [0.32, 0, 0.18, 1] as const;

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, totalPrice, totalCount } = useCart();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!isOpen) return;
    lockPageScroll();
    return () => unlockPageScroll();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, closeCart]);

  async function handleCheckout() {
    setCheckoutError(null);
    setCheckoutLoading(true);
    try {
      closeCart();
      router.push("/checkout");
    } catch {
      setCheckoutError("שגיאה בחיבור לשרת");
      setCheckoutLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-[60] touch-none overscroll-none bg-ink/40 backdrop-blur-sm"
            onClick={closeCart}
            aria-hidden
          />

          {/* Drawer — slides from left */}
          <motion.aside
            key="drawer"
            role="dialog"
            aria-modal="true"
            aria-label="עגלת הקניות"
            dir="rtl"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.42, ease: EASE }}
            className="fixed inset-y-0 left-0 z-[70] flex w-full max-w-sm flex-col bg-cream shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-line/60 px-6 py-4">
              <div className="flex items-center gap-3">
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-ink" fill="none" aria-hidden>
                  <path d="M6 7h15l-2 10H8L6 7Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                  <path d="M6 7 5 3H2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <circle cx="9.5" cy="19.5" r="1.2" fill="currentColor"/>
                  <circle cx="16.5" cy="19.5" r="1.2" fill="currentColor"/>
                </svg>
                <h2 className="font-display text-lg font-bold text-ink">
                  העגלה שלי
                </h2>
                {totalCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center bg-clay px-1.5 text-[11px] font-bold text-white">
                    {totalCount}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={closeCart}
                aria-label="סגור עגלה"
                className="grid h-8 w-8 place-items-center text-stone transition-colors hover:text-ink"
              >
                <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none">
                  <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4" data-scroll-lock-scrollable>
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
                  <svg viewBox="0 0 48 48" className="h-14 w-14 text-line" fill="none" aria-hidden>
                    <path d="M12 14h28l-4 20H16L12 14Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
                    <path d="M12 14l-2-8H4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    <circle cx="19" cy="39" r="2.5" fill="currentColor"/>
                    <circle cx="33" cy="39" r="2.5" fill="currentColor"/>
                  </svg>
                  <p className="text-sm font-medium text-stone">העגלה ריקה</p>
                  <button
                    type="button"
                    onClick={closeCart}
                    className="text-sm font-semibold text-clay hover:underline"
                  >
                    המשך בקנייה
                  </button>
                </div>
              ) : (
                <ul className="flex flex-col divide-y divide-line/50">
                  {items.map((item) => (
                    <li key={item.sku} className="flex gap-4 py-5">
                      {/* Thumbnail */}
                      <div className="relative h-20 w-20 shrink-0">
                        <MediaImage
                          src={item.imageUrl ?? PRODUCT_FALLBACK_IMAGE[item.productId] ?? media("product_image")}
                          alt=""
                          fill
                          sizes="80px"
                          className="object-contain"
                          draggable={false}
                        />
                      </div>
                      {/* Product info */}
                      <div className="flex flex-1 flex-col gap-1">
                        <p className="font-display text-[15px] font-semibold leading-snug text-ink">
                          {item.bundleLabel ?? item.productName ?? item.sku}
                        </p>
                        <p className="text-xs text-stone">
                          {item.sizeLabel} · {item.colorLabel}
                        </p>
                        {item.bundleComponents && (
                          <ul className="mt-1 flex flex-col gap-0.5">
                            {item.bundleComponents.map((c) => (
                              <li key={c.sku} className="text-[11px] text-stone/80">
                                — {c.productName} · {c.sizeLabel} · {c.colorLabel}
                              </li>
                            ))}
                          </ul>
                        )}
                        <p className="mt-1.5 text-sm font-bold text-clay">
                          {formatILS(item.price * item.quantity)}
                        </p>
                      </div>

                      {/* Qty + remove */}
                      <div className="flex flex-col items-end justify-between">
                        <button
                          type="button"
                          onClick={() => removeItem(item.sku)}
                          aria-label="הסר פריט"
                          className="grid h-6 w-6 place-items-center text-stone/60 transition-colors hover:text-red-500"
                        >
                          <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none">
                            <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                          </svg>
                        </button>
                        <div className="flex items-center gap-2 border border-line">
                          <button
                            type="button"
                            onClick={() => updateQty(item.sku, item.quantity - 1)}
                            className="px-2 py-1 text-sm text-stone hover:text-ink"
                            aria-label="הפחת כמות"
                          >−</button>
                          <span className="min-w-[1.5rem] text-center text-sm font-medium text-ink">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQty(item.sku, item.quantity + 1)}
                            className="px-2 py-1 text-sm text-stone hover:text-ink"
                            aria-label="הוסף כמות"
                          >+</button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-line/60 px-6 py-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm font-medium text-stone">סה&quot;כ</span>
                  <span className="font-display text-xl font-bold text-ink">{formatILS(totalPrice)}</span>
                </div>
                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={checkoutLoading}
                  className="btn-clay flex w-full items-center justify-center gap-2 py-3.5 text-base font-bold disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {checkoutLoading ? (
                    <>
                      <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                        <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                      טוען…
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
                        <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M2 10h20" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                      לתשלום
                    </>
                  )}
                </button>
                {checkoutError && (
                  <p className="mt-2 text-center text-[12px] font-medium text-red-600">
                    {checkoutError}
                  </p>
                )}
                <p className="mt-2 text-center text-[11px] text-stone/70">
                  תשלום מאובטח דרך Hyp Pay
                </p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
