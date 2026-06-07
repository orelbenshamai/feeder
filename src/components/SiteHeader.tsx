"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCartCount } from "@/hooks/useCartCount";

export default function SiteHeader() {
  const cartCount = useCartCount();
  const pathname = usePathname();
  const isHome = pathname === "/";

  const handleLogoClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isHome) return;
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-50 w-full shrink-0 overflow-visible border-b border-line/60 bg-cream/95 backdrop-blur-md">
      {/* Cart: pinned to viewport inline-end (physical left in RTL), not the max-width column */}
      <div className="absolute inset-y-0 end-3 z-10 flex items-center sm:end-4 md:end-5 lg:end-6">
        <span
          className="inline-flex items-center gap-1.5 text-[15px] font-medium text-label transition-colors hover:text-ink"
          aria-label={`${cartCount} פריטים בעגלה`}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            aria-hidden
          >
            <path
              d="M6 7h15l-2 10H8L6 7Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M6 7 5 3H2"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <circle cx="9.5" cy="19.5" r="1.2" fill="currentColor" />
            <circle cx="16.5" cy="19.5" r="1.2" fill="currentColor" />
          </svg>
          ({cartCount})
        </span>
      </div>

      <Link
        href="/"
        aria-label={isHome ? "מסודר — גלילה לראש הדף" : "מסודר — חזרה לדף הבית"}
        onClick={handleLogoClick}
        className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/media/logo.png"
          alt="מסודר"
          className="h-14 w-auto sm:h-16 md:h-[4.75rem]"
          draggable={false}
        />
      </Link>

      <div className="relative mx-auto h-11 max-w-[1440px]" aria-hidden />
    </header>
  );
}
