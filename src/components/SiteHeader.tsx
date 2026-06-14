"use client";
import { media } from "@/lib/media";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { AnimatePresence, motion } from "framer-motion";

const NAV_LINKS = [
  { href: "/feeder", label: "עמדת ההאכלה" },
  { href: "/mat", label: "משטח ההאכלה" },
  { href: "/faq", label: "שאלות נפוצות" },
  { href: "/about", label: "אודות" },
];

export default function SiteHeader() {
  const { totalCount: cartCount, openCart } = useCart();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogoClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isHome) return;
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full shrink-0 overflow-visible border-b border-line/60 bg-cream/95 backdrop-blur-md">
        {/* Cart: pinned to viewport inline-end */}
        <div className="absolute inset-y-0 end-3 z-10 flex items-center sm:end-4 md:end-5 lg:end-6">
          <button
            type="button"
            onClick={openCart}
            className="inline-flex items-center gap-1.5 text-[14px] font-[650] text-ink transition-colors hover:text-clay"
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
          className="absolute inset-y-0 start-3 z-10 hidden items-center gap-5 sm:flex sm:start-4 md:start-5 lg:start-6"
        >
          {NAV_LINKS.map(({ href, label }) => (
            <Link key={href} href={href} className="header-nav-link">{label}</Link>
          ))}
        </nav>

        {/* Mobile hamburger: pinned to inline-start */}
        <div className="absolute inset-y-0 start-3 z-10 flex items-center sm:hidden">
          <button
            type="button"
            aria-label={menuOpen ? "סגור תפריט" : "פתח תפריט"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] text-ink transition-colors hover:text-clay"
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={media("logo.png")}
            alt="מסודר"
            className="h-[4.5rem] w-auto sm:h-20 md:h-[8.75rem]"
            draggable={false}
          />
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
              className="fixed inset-0 z-40 bg-ink/40 sm:hidden"
              onClick={() => setMenuOpen(false)}
            />

            {/* Drawer — slides in from the right (RTL start side) */}
            <motion.nav
              key="drawer"
              dir="rtl"
              aria-label="תפריט נייד"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
              className="fixed inset-y-0 start-0 z-50 flex w-72 flex-col bg-cream shadow-2xl sm:hidden"
            >
              {/* Drawer header — matches site header height exactly */}
              <div className="relative flex h-11 shrink-0 items-center border-b border-line/60 bg-cream/95 px-3 sm:h-12 md:h-14">
                {/* Hamburger close button — same position as open button */}
                <button
                  type="button"
                  aria-label="סגור תפריט"
                  onClick={() => setMenuOpen(false)}
                  className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] text-ink transition-colors hover:text-clay"
                >
                  <span className="block h-[2px] w-5 bg-current origin-center translate-y-[7px] rotate-45 transition-all duration-300" />
                  <span className="block h-[2px] w-5 bg-current opacity-0 transition-all duration-300" />
                  <span className="block h-[2px] w-5 bg-current origin-center -translate-y-[7px] -rotate-45 transition-all duration-300" />
                </button>
                {/* Logo centered in the drawer header */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={media("logo.png")}
                  alt="מסודר"
                  className="absolute left-1/2 top-1/2 h-[4.5rem] w-auto -translate-x-1/2 -translate-y-1/2"
                  draggable={false}
                />
              </div>

              {/* Links */}
              <ul className="flex flex-col divide-y divide-line/40 px-6 py-4 text-right">
                {NAV_LINKS.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={() => setMenuOpen(false)}
                      className="block py-4 font-display text-lg font-semibold text-ink transition-colors hover:text-clay"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
