"use client";

import { useEffect, useState } from "react";
import { formatILS, PRICE_BY_SIZE } from "@/lib/pricing";

const priceRange =
  formatILS(PRICE_BY_SIZE.small) + "–" + formatILS(PRICE_BY_SIZE.large);

export default function StickyMobileCTA() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const shown = window.scrollY > window.innerHeight * 0.6;
      setShow(shown);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden={!show}
      className={`md:hidden fixed inset-x-0 bottom-0 z-40 px-4 pb-[calc(env(safe-area-inset-bottom)+12px)] pt-3 transition-all duration-500 ${
        show ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      }`}
    >
      <div className="rounded-2xl bg-ink/95 backdrop-blur shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)] border border-cream/10 px-4 py-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="font-display text-cream text-base leading-tight">
            מסודר · עמדת האכלה
          </p>
          <p className="text-cream/60 text-xs">
            {priceRange} · משלוח מהיר בישראל
          </p>
        </div>
        <a
          href="#buy"
          className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-cream text-ink px-5 py-3 text-sm font-medium min-h-[44px]"
        >
          להזמין עכשיו
          <span aria-hidden>←</span>
        </a>
      </div>
    </div>
  );
}
