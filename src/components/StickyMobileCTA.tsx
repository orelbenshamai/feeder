"use client";

import { useEffect, useState } from "react";
import { whatsAppHref, WHATSAPP_PREFILL_HE } from "@/lib/whatsapp";
import { useLeadCapture } from "./LeadCapture";

export default function StickyMobileCTA() {
  const { open } = useLeadCapture();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const update = () => {
      const scrollPastHero = window.scrollY > window.innerHeight * 0.4;
      const finalCta = document.getElementById("final-cta");
      const inFinalCta = finalCta
        ? finalCta.getBoundingClientRect().top <= 72
        : false;
      setShow(scrollPastHero && !inFinalCta);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
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
        className="border-b border-cream/10 bg-ink/95 px-4 py-2.5 pt-[calc(8px+env(safe-area-inset-top))] shadow-[0_8px_24px_-8px_rgba(0,0,0,0.4)]"
      >
        <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => open()}
            className="inline-flex min-h-[40px] shrink-0 items-center justify-center rounded-full bg-clay px-5 text-[13px] font-semibold text-ink transition active:scale-[0.98]"
          >
            להזמין עכשיו
          </button>

          <a
            href={whatsAppHref(WHATSAPP_PREFILL_HE)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="שיחה בוואטסאפ עם נציג מסודר"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white transition active:scale-[0.98]"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
              <path d="M19.05 4.92A10.05 10.05 0 0 0 12 2C6.48 2 2 6.48 2 12c0 1.76.46 3.42 1.27 4.86L2 22l5.27-1.38A9.95 9.95 0 0 0 12 22c5.52 0 10-4.48 10-10 0-2.69-1.05-5.21-2.95-7.08zM12 20.27a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.13.82.83-3.05-.2-.31A8.27 8.27 0 1 1 12 20.27zm4.52-6.18c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.55.12-.16.25-.63.8-.77.96-.14.16-.28.18-.53.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.28.37-.42.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.55-1.34-.76-1.83-.2-.48-.4-.41-.55-.42h-.47c-.16 0-.42.06-.64.31-.22.25-.84.83-.84 2.02 0 1.19.86 2.34.98 2.5.12.16 1.69 2.58 4.1 3.62.57.25 1.02.39 1.37.5.58.18 1.1.16 1.51.1.46-.07 1.46-.6 1.66-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
