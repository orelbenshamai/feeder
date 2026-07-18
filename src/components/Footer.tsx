"use client";

import Link from "next/link";
import { whatsAppHref } from "@/lib/whatsapp";
import { media } from "@/lib/media";
import { trackNavClick, trackWhatsAppClick } from "@/utils/tracking";

export default function Footer() {
  return (
    <footer
      id="footer-section"
      className="border-t border-line/60 bg-cream text-stone"
    >      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] lg:gap-10">

          {/* Brand */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-start">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={media("full_logo.png")}
              alt="מסודר"
              className="mx-auto h-50 w-auto sm:h-20 lg:mx-0 lg:h-50"
              draggable={false}
            />
            <p className="-mt-6 max-w-xs text-lg leading-relaxed sm:max-w-sm sm:text-xl">
              <span style={{ fontFamily: "var(--font-nunito)" }}>MESUDAR</span> מפתחת פתרונות האכלה שמתוכננות לשמור על פינת האכילה נקייה ומסודרת.
              עמדת ההאכלה המוגבהת מפרידה בין מזון ומים שנשפכים, כך שהם מתנקזים לתוך מיכל מים —
              ולא על הרצפה שלכם.
              בשילוב משטח ההאכלה שלוכד פירורים והתזות, הארוחה של חיית המחמד נשארת מרוכזת במקום אחד,
              הניקיון היומי מצטמצם, והבית נשאר מסודר כמעט ללא מאמץ.
            </p>
          </div>

          {/* Store */}
          <div>
            <p className="text-base font-semibold uppercase tracking-wider text-stone/60">החנות</p>
            <ul className="mt-4 space-y-3 text-lg">
              <li>
                <Link
                  href="/feeder"
                  onClick={() =>
                    trackNavClick({ linkText: "עמדת ההאכלה", linkUrl: "/feeder", source: "footer" })
                  }
                  className="text-ink transition-colors hover:text-clay"
                >
                  עמדת ההאכלה
                </Link>
              </li>
              <li>
                <Link
                  href="/mat"
                  onClick={() =>
                    trackNavClick({ linkText: "משטח ההאכלה", linkUrl: "/mat", source: "footer" })
                  }
                  className="text-ink transition-colors hover:text-clay"
                >
                  משטח ההאכלה
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <p className="text-base font-semibold uppercase tracking-wider text-stone/60">עזרה</p>
            <ul className="mt-4 space-y-3 text-lg">
              <li>
                <Link
                  href="/faq"
                  onClick={() =>
                    trackNavClick({ linkText: "שאלות נפוצות", linkUrl: "/faq", source: "footer" })
                  }
                  className="text-ink transition-colors hover:text-clay"
                >
                  שאלות נפוצות
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  onClick={() =>
                    trackNavClick({ linkText: "אודות", linkUrl: "/about", source: "footer" })
                  }
                  className="text-ink transition-colors hover:text-clay"
                >
                  אודות
                </Link>
              </li>
              <li>
                <Link
                  href="/faq#shipping"
                  onClick={() =>
                    trackNavClick({
                      linkText: "משלוחים והחזרות",
                      linkUrl: "/faq#shipping",
                      source: "footer",
                    })
                  }
                  className="text-ink transition-colors hover:text-clay"
                >
                  משלוחים והחזרות
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-base font-semibold uppercase tracking-wider text-stone/60">צרו קשר</p>
            <ul className="mt-4 space-y-4 text-lg">
              <li>
                <a
                  href={whatsAppHref()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackWhatsAppClick("footer")}
                  className="inline-flex items-center gap-2 text-ink transition-colors hover:text-clay"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="currentColor" aria-hidden>
                    <path d="M19.05 4.92A10.05 10.05 0 0 0 12 2C6.48 2 2 6.48 2 12c0 1.76.46 3.42 1.27 4.86L2 22l5.27-1.38A9.95 9.95 0 0 0 12 22c5.52 0 10-4.48 10-10 0-2.69-1.05-5.21-2.95-7.08zM12 20.27a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.13.82.83-3.05-.2-.31A8.27 8.27 0 1 1 12 20.27z" />
                  </svg>
                  <span>תמיכה בוואטסאפ</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:mesudar.pets@gmail.com"
                  className="text-ink transition-colors hover:text-clay"
                >
                  mesudar.pets@gmail.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-12 border-t border-line/60 pt-6 text-sm text-stone/60">
          <p>© {new Date().getFullYear()} <span style={{ fontFamily: "var(--font-nunito)" }}>MESUDAR</span>. כל הזכויות שמורות.</p>
        </div>
      </div>
    </footer>
  );
}
