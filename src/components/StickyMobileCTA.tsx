"use client";

import { useEffect, useState } from "react";
import { useLeadCapture } from "./LeadCapture";

export default function StickyMobileCTA() {
  const { open } = useLeadCapture();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShow(window.scrollY > window.innerHeight * 0.4);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden={!show}
      className={`fixed inset-x-0 top-0 z-40 md:hidden transition-all duration-300 ease-out ${
        show
          ? "translate-y-0 opacity-100"
          : "-translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      <div
        dir="rtl"
        className="border-b border-cream/15 bg-ink/96 px-4 pb-3 pt-[calc(10px+env(safe-area-inset-top))] shadow-[0_16px_48px_-16px_rgba(0,0,0,0.55)] backdrop-blur-md"
      >
        <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="inline-flex items-center gap-1.5 text-[10.5px] font-medium text-clay">
              <span className="relative flex h-1.5 w-1.5" aria-hidden>
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-clay opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-clay" />
              </span>
              מהדורת השקה · מקומות מוגבלים
            </p>
            <p className="font-display mt-0.5 text-[15px] leading-tight text-cream">
              שרינו לי 10% הנחה להשקה
            </p>
          </div>
          <button
            type="button"
            onClick={() => open()}
            className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-1.5 rounded-full bg-cream px-5 text-[13.5px] font-semibold text-ink shadow-sm transition hover:bg-white active:scale-[0.98]"
          >
            <span>אני בפנים</span>
            <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" aria-hidden>
              <path
                d="M11.5 5 5.5 10l6 5M5.5 10h9"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
