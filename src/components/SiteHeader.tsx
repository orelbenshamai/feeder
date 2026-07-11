"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { lockPageScroll, unlockPageScroll } from "@/lib/scroll-lock";
import { AnimatePresence, motion } from "framer-motion";

const SHOP_LINKS = [
  {
    href: "/feeder",
    label: "עמדת ההאכלה",
    action: "קנו עכשיו",
    price: "החל מ־₪179",
  },
  {
    href: "/mat",
    label: "משטח ההאכלה",
    action: "קנו עכשיו",
    price: "החל מ־₪99",
  },
];

const INFO_LINKS = [
  {
    href: "/faq",
    label: "שאלות נפוצות",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0" aria-hidden>
        <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10Z" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M9.5 9.5a2.5 2.5 0 0 1 5 .833c0 1.667-2.5 2.083-2.5 3.334" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="12" cy="16.5" r="0.75" fill="currentColor"/>
      </svg>
    ),
  },
  {
    href: "/about",
    label: "אודות",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0" aria-hidden>
        <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
];

export default function SiteHeader() {
  const { totalCount: cartCount, openCart } = useCart();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    lockPageScroll();
    return () => unlockPageScroll();
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const handleLogoClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isHome) return;
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[70] w-full shrink-0 overflow-visible bg-ink ${
          isHome ? "border-b border-transparent" : "border-b border-ink/20"
        }`}
      >
        {/* Cart: pinned to viewport inline-end */}
        <div className="absolute inset-y-0 end-3 z-10 flex items-center sm:end-4 md:end-5 lg:end-6">
          <button
            type="button"
            onClick={openCart}
            className="inline-flex items-center gap-1.5 text-[14px] font-[650] text-cream transition-colors hover:text-clay"
            aria-label={`פתח עגלה — ${cartCount} פריטים`}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
              <path d="M6 7h15l-2 10H8L6 7Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M6 7 5 3H2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="9.5" cy="19.5" r="1.2" fill="currentColor"/>
              <circle cx="16.5" cy="19.5" r="1.2" fill="currentColor"/>
            </svg>
            ({cartCount})
          </button>
        </div>

        {/* Desktop nav: pinned to inline-start */}
        <nav
          dir="rtl"
          aria-label="ניווט ראשי"
          className="absolute inset-y-0 start-3 z-10 hidden items-center gap-3 sm:flex sm:start-4 md:start-5 lg:start-6"
        >
          {/* Product links — pill with cart dot, clear buying paths */}
          {SHOP_LINKS.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`group flex items-center gap-2 rounded-sm border px-4 py-1.5 text-[16px] font-semibold transition-all ${
                  isActive
                    ? "border-clay/60 bg-clay/15 text-clay"
                    : "border-cream/20 bg-cream/5 text-cream hover:border-clay/50 hover:bg-clay/12 hover:text-clay"
                }`}
              >
                <svg viewBox="0 0 16 16" fill="none" className={`h-3.5 w-3.5 shrink-0 transition-colors ${isActive ? "text-clay" : "text-cream/40 group-hover:text-clay/70"}`} aria-hidden>
                  <path d="M4 5h9l-1.3 6.5H5.3L4 5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                  <path d="M4 5 3.3 2H1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                  <circle cx="6.2" cy="13.2" r="0.9" fill="currentColor"/>
                  <circle cx="11" cy="13.2" r="0.9" fill="currentColor"/>
                </svg>
                {label}
              </Link>
            );
          })}

          {/* Divider */}
          <span className="mx-0.5 h-4 w-px bg-cream/15" aria-hidden />

          {/* Info links — quiet, secondary */}
          {INFO_LINKS.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`text-[16px] font-medium transition-colors ${
                  isActive ? "text-cream/80" : "text-cream/50 hover:text-cream/80"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile hamburger: pinned to inline-start */}
        <div className="absolute inset-y-0 start-3 z-10 flex items-center sm:hidden">
          <button
            type="button"
            aria-label={menuOpen ? "סגור תפריט" : "פתח תפריט"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] text-cream transition-colors hover:text-clay"
          >
            <span className={`block h-[2px] w-5 bg-current transition-all duration-300 origin-center ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`} />
            <span className={`block h-[2px] w-5 bg-current transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-[2px] w-5 bg-current transition-all duration-300 origin-center ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
          </button>
        </div>

        {/* Logo: centered */}
        <Link
          href="/"
          aria-label={isHome ? "מסודר — גלילה לראש הדף" : "מסודר — חזרה לדף הבית"}
          onClick={handleLogoClick}
          className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
        >
          <span
            className="text-2xl font-bold tracking-widest text-cream sm:text-3xl"
            style={{ fontFamily: "var(--font-nunito)", fontWeight: 800, letterSpacing: "0.06em", lineHeight: 1.2, color: 'var(--color-cream)' }}
          >
            MESUDAR
          </span>
        </Link>

        <div className="relative mx-auto h-11 max-w-[1440px] sm:h-12 md:h-[3.5rem]" aria-hidden/>
      </header>

      {/* Mobile slide-in sidebar */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-x-0 bottom-0 top-[var(--site-header-h)] z-[60] touch-none overscroll-none bg-ink/40 sm:hidden"
              onClick={() => setMenuOpen(false)}
            />

            {/* Drawer — full-width storefront, slides in from the side */}
            <motion.nav
              key="drawer"
              dir="rtl"
              aria-label="תפריט נייד"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="fixed inset-x-0 bottom-0 top-[var(--site-header-h)] z-[65] flex flex-col overflow-y-auto bg-ink sm:hidden"
              data-scroll-lock-scrollable
            >
              {/* ── Shop section ── */}
              <div className="px-5 pt-5">
                <p className="mb-3 px-1 text-[11px] font-bold uppercase tracking-[0.14em] text-cream/35">
                  חנות
                </p>
                <ul className="flex flex-col gap-2">
                  {SHOP_LINKS.map(({ href, label, action, price }) => {
                    const isActive = pathname === href;
                    return (
                      <li key={href}>
                        <Link
                          href={href}
                          onClick={() => setMenuOpen(false)}
                          className={`group flex items-center gap-4 rounded-sm px-5 py-4 transition-all ${
                            isActive
                              ? "bg-clay/12 ring-1 ring-clay/30"
                              : "bg-cream/5 hover:bg-cream/8"
                          }`}
                        >
                          <span className="flex min-w-0 flex-1 flex-col gap-1.5">
                            <span className={`font-display text-[18px] font-bold leading-none ${isActive ? "text-clay" : "text-cream"}`}>
                              {label}
                            </span>
                            <span className={`text-[12px] font-bold tabular-nums ${isActive ? "text-clay/70" : "text-cream/40"}`}>
                              {price}
                            </span>
                          </span>
                          <span className={`shrink-0 rounded-sm px-3 py-1.5 text-[12px] font-bold ${isActive ? "bg-clay text-ink" : "bg-clay/20 text-clay"}`}>
                            {action}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* ── Info section ── */}
              <div className="mt-6 px-5">
                <p className="mb-1 px-1 text-[11px] font-bold uppercase tracking-[0.14em] text-cream/35">
                  מידע
                </p>
                <ul>
                  {INFO_LINKS.map(({ href, label, icon }) => {
                    const isActive = pathname === href;
                    return (
                      <li key={href}>
                        <Link
                          href={href}
                          onClick={() => setMenuOpen(false)}
                          className={`group flex items-center gap-3 rounded-sm px-3 py-3.5 transition-colors ${isActive ? "text-clay" : "text-cream/60 hover:text-cream"}`}
                        >
                          {icon}
                          <span className="font-semibold">{label}</span>
                          <svg viewBox="0 0 20 20" fill="none" className="ms-auto h-3.5 w-3.5 text-cream/20" aria-hidden>
                            <path d="M8 5l-5 5 5 5M3 10h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* ── Cart CTA ── */}
              <div className="mt-auto px-5 pb-[calc(1.75rem+env(safe-area-inset-bottom))] pt-4">
                <button
                  type="button"
                  onClick={() => { openCart(); setMenuOpen(false); }}
                  className="flex w-full items-center justify-center gap-2.5 rounded-sm bg-clay px-6 py-4 text-base font-bold text-ink transition-opacity active:opacity-80"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
                    <path d="M6 7h15l-2 10H8L6 7Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
                    <path d="M6 7 5 3H2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                    <circle cx="9.5" cy="19.5" r="1.2" fill="currentColor"/>
                    <circle cx="16.5" cy="19.5" r="1.2" fill="currentColor"/>
                  </svg>
                  עגלת הקניות
                  {cartCount > 0 ? (
                    <span className="rounded-sm bg-ink/20 px-2 py-0.5 text-sm">{cartCount}</span>
                  ) : null}
                </button>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
