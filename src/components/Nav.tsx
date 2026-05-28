"use client";

import { useEffect, useState } from "react";
import { whatsAppHref, WHATSAPP_PREFILL_HE } from "@/lib/whatsapp";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#features", label: "תכונות" },
    { href: "#reviews", label: "ביקורות" },
    { href: "#faq", label: "שאלות נפוצות" },
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 hidden md:block transition-all duration-500 ${
        scrolled
          ? "bg-cream/80 backdrop-blur-md border-b border-line/60"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 h-14 sm:h-16 flex items-center justify-between">
        <a href="#" aria-label="מסודר — חזרה לראש הדף">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/media/logo.png"
            alt="מסודר"
            className="h-12 w-auto md:h-14"
            draggable={false}
          />
        </a>

        <nav className="hidden md:flex items-center gap-10 text-sm text-stone">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="hover:text-ink transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={whatsAppHref(WHATSAPP_PREFILL_HE)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="שיחה בוואטסאפ עם נציג מסודר"
            className="grid h-10 w-10 place-items-center rounded-full bg-[#25D366] text-white shadow-sm transition hover:bg-[#20bd5a]"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
              <path d="M19.05 4.92A10.05 10.05 0 0 0 12 2C6.48 2 2 6.48 2 12c0 1.76.46 3.42 1.27 4.86L2 22l5.27-1.38A9.95 9.95 0 0 0 12 22c5.52 0 10-4.48 10-10 0-2.69-1.05-5.21-2.95-7.08zM12 20.27a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.13.82.83-3.05-.2-.31A8.27 8.27 0 1 1 12 20.27zm4.52-6.18c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.55.12-.16.25-.63.8-.77.96-.14.16-.28.18-.53.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.28.37-.42.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.55-1.34-.76-1.83-.2-.48-.4-.41-.55-.42h-.47c-.16 0-.42.06-.64.31-.22.25-.84.83-.84 2.02 0 1.19.86 2.34.98 2.5.12.16 1.69 2.58 4.1 3.62.57.25 1.02.39 1.37.5.58.18 1.1.16 1.51.1.46-.07 1.46-.6 1.66-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29z" />
            </svg>
          </a>

          <a
            href="#buy"
            className="hidden sm:inline-flex items-center gap-2 rounded-full bg-ink text-cream px-5 py-2.5 text-sm font-medium hover:bg-ink/90 transition-colors"
          >
            להזמין עכשיו
            <span aria-hidden>←</span>
          </a>
          <button
            type="button"
            aria-label="פתיחת תפריט"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="md:hidden h-10 w-10 -ms-2 grid place-items-center"
          >
            <span className="relative block h-3 w-5">
              <span
                className={`absolute inset-x-0 h-px bg-ink transition-transform duration-300 ${
                  open ? "top-1/2 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute inset-x-0 h-px bg-ink transition-transform duration-300 ${
                  open ? "top-1/2 -rotate-45" : "bottom-0"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-[max-height] duration-500 ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <nav className="px-5 pb-6 pt-2 flex flex-col gap-4 text-base border-t border-line/50 bg-cream/95 backdrop-blur">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="py-2 text-ink/80"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#buy"
            onClick={() => setOpen(false)}
            className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-ink text-cream px-5 py-3 text-sm font-medium"
          >
            להזמין עכשיו
            <span aria-hidden>←</span>
          </a>
          <a
            href={whatsAppHref(WHATSAPP_PREFILL_HE)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/15 px-5 py-3 text-sm text-ink"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
              <path d="M19.05 4.92A10.05 10.05 0 0 0 12 2C6.48 2 2 6.48 2 12c0 1.76.46 3.42 1.27 4.86L2 22l5.27-1.38A9.95 9.95 0 0 0 12 22c5.52 0 10-4.48 10-10 0-2.69-1.05-5.21-2.95-7.08zM12 20.27a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.13.82.83-3.05-.2-.31A8.27 8.27 0 1 1 12 20.27zm4.52-6.18c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.55.12-.16.25-.63.8-.77.96-.14.16-.28.18-.53.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.28.37-.42.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.55-1.34-.76-1.83-.2-.48-.4-.41-.55-.42h-.47c-.16 0-.42.06-.64.31-.22.25-.84.83-.84 2.02 0 1.19.86 2.34.98 2.5.12.16 1.69 2.58 4.1 3.62.57.25 1.02.39 1.37.5.58.18 1.1.16 1.51.1.46-.07 1.46-.6 1.66-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29z" />
            </svg>
            תמיכה בוואטסאפ
          </a>
        </nav>
      </div>
    </header>
  );
}
