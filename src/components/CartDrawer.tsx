"use client";
import { media } from "@/lib/media";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { formatILS } from "@/lib/pricing";

const PRODUCT_FALLBACK_IMAGE: Record<string, string> = {
  prod_mesudar_feeder_001: media("medium_gray_1.png"),
  prod_mesudar_mat_001: media("mat_gray_1.png"),
};

const EASE = [0.32, 0, 0.18, 1] as const;

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, totalPrice, totalCount } = useCart();

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") closeCart(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [closeCart]);

  const whatsappMessage = encodeURIComponent(
    "שלום! אני רוצה להזמין:\n" +
    items.map((item) =>
      `• ${item.bundleLabel ?? item.sku} (${item.sizeLabel}, ${item.colorLabel}) x${item.quantity} — ${formatILS(item.price * item.quantity)}`
    ).join("\n") +
    `\n\nסה"כ: ${formatILS(totalPrice)}`
  );
  const whatsappUrl = `https://wa.me/972XXXXXXXXX?text=${whatsappMessage}`;

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
            className="fixed inset-0 z-[60] bg-ink/40 backdrop-blur-sm"
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
            <div className="flex-1 overflow-y-auto px-6 py-4">
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
                      <div className="h-20 w-20 shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.imageUrl ?? PRODUCT_FALLBACK_IMAGE[item.productId] ?? media("product_image.png")}
                          alt=""
                          className="h-full w-full object-contain"
                          draggable={false}
                        />
                      </div>
                      {/* Product info */}
                      <div className="flex flex-1 flex-col gap-1">
                        <p className="font-display text-[15px] font-semibold leading-snug text-ink">
                          {item.bundleLabel ?? item.sku}
                        </p>
                        <p className="text-xs text-stone">
                          {item.sizeLabel} · {item.colorLabel}
                        </p>
                        {item.bundleComponents && (
                          <ul className="mt-1 flex flex-col gap-0.5">
                            {item.bundleComponents.map((c) => (
                              <li key={c.sku} className="text-[11px] text-stone/80">
                                — {c.sku} ({c.sizeLabel})
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
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-clay flex w-full items-center justify-center gap-2 py-3.5 text-base font-bold"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  הזמן בוואטסאפ
                </a>
                <p className="mt-2 text-center text-[11px] text-stone/70">
                  תגיע/י לוואטסאפ ונסיים את ההזמנה יחד
                </p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
