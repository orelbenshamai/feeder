"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { renderTextWithMesudar } from "@/components/MesudarWordmark";
import type { Product } from "@/types/product";

type ProductFeaturesGridProps = {
  product: Product;
};

function MobileFeaturesCarousel({ features }: { features: Product["features"] }) {
  const scrollRef = useRef<HTMLUListElement>(null);
  const hintDismissedRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showScrollHint, setShowScrollHint] = useState(features.length > 1);
  const [showEdgeFade, setShowEdgeFade] = useState(features.length > 1);

  const syncCarouselState = useCallback(
    (dismissHint: boolean) => {
      const root = scrollRef.current;
      if (!root) return;

      if (dismissHint && !hintDismissedRef.current) {
        hintDismissedRef.current = true;
        setShowScrollHint(false);
      }

      const cards = root.querySelectorAll<HTMLElement>("[data-feature-card]");
      if (!cards.length) return;

      const rootRect = root.getBoundingClientRect();
      const rootCenter = rootRect.left + rootRect.width / 2;

      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      cards.forEach((card, index) => {
        const cardRect = card.getBoundingClientRect();
        const cardCenter = cardRect.left + cardRect.width / 2;
        const distance = Math.abs(cardCenter - rootCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setActiveIndex(closestIndex);
      setShowEdgeFade(closestIndex < features.length - 1);
    },
    [features.length],
  );

  useEffect(() => {
    syncCarouselState(false);
  }, [syncCarouselState]);

  if (features.length === 0) return null;

  return (
    <div className="sm:hidden">
      <div
        className={`flex justify-center px-4 pb-3 transition-opacity duration-500 ${
          showScrollHint ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!showScrollHint}
      >
        <span className="pdp-features-scroll-hint inline-flex items-center gap-2 rounded-sm border border-cream/12 bg-[#0D2438]/75 px-3.5 py-1.5 text-[12.5px] font-medium tracking-wide text-cream/60 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.45)] backdrop-blur-sm">
          <span>החליקו לראות עוד תכונות</span>
          <svg
            viewBox="0 0 20 12"
            className="pdp-features-scroll-hint__chevrons h-3 w-5 shrink-0 text-clay/85"
            fill="none"
            aria-hidden
          >
            <path
              d="M12 2L7 6l5 4M6 2L1 6l5 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>

      <div className="relative">
        <div
          className={`pointer-events-none absolute inset-y-0 end-0 z-10 w-10 bg-gradient-to-l from-ink via-ink/80 to-transparent transition-opacity duration-300 sm:w-12 ${
            showEdgeFade ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden
        />

        <ul
          ref={scrollRef}
          className="flex list-none gap-3 overflow-x-auto overscroll-x-contain scroll-smooth pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          style={{ scrollSnapType: "x mandatory", scrollPaddingInline: "1.25rem" }}
          aria-label="תכונות המוצר — החליקו לתכונה הבאה"
          onScroll={() => syncCarouselState(true)}
        >
          <li className="w-3 shrink-0" aria-hidden />
          {features.map((feature, index) => (
            <li
              key={feature.title}
              data-feature-card
              data-index={index}
              className="w-[84vw] max-w-[22rem] shrink-0"
              style={{ scrollSnapAlign: "center" }}
            >
              <article className="flex h-full flex-col">
                <div className="overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={feature.imageUrl}
                    alt={feature.title}
                    className="aspect-[5/4] w-full object-cover"
                    draggable={false}
                  />
                </div>
                <div className="py-4">
                  <h3 className="font-display text-[15px] font-bold uppercase tracking-[0.1em] text-cream">
                    {feature.title}
                  </h3>
                  <p className="feature-copy mt-2 text-[15px] leading-[1.7] text-cream/75">
                    {renderTextWithMesudar(feature.description)}
                  </p>
                </div>
              </article>
            </li>
          ))}
          <li className="w-3 shrink-0" aria-hidden />
        </ul>
      </div>

      {features.length > 1 ? (
        <div
          className="mt-4 flex items-center justify-center gap-2"
          aria-label={`תכונה ${activeIndex + 1} מתוך ${features.length}`}
        >
          {features.map((feature, index) => (
            <span
              key={feature.title}
              className={`block rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? "h-2 w-6 bg-clay"
                  : "h-2 w-2 bg-cream/25"
              }`}
              aria-hidden
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function ProductFeaturesGrid({ product }: ProductFeaturesGridProps) {
  return (
    <section
      dir="rtl"
      aria-label="תכונות המוצר"
      className="bg-ink pt-6 pb-28 sm:py-16 lg:py-20"
    >
      <MobileFeaturesCarousel features={product.features} />

      {/* Tablet+: 3-column grid, full width */}
      <ul
        dir="rtl"
        className="hidden list-none grid-cols-3 gap-x-4 px-4 sm:grid lg:gap-x-5 lg:px-5"
        aria-label="תכונות המוצר"
      >
        {product.features.map((feature) => (
          <li key={feature.title} className="flex flex-col">
            <article dir="rtl" className="flex flex-1 flex-col">
              <div className="overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={feature.imageUrl}
                  alt={feature.title}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                  draggable={false}
                />
              </div>
              <div className="flex flex-1 flex-col py-5">
                <h3 className="font-display text-[17px] font-bold uppercase tracking-[0.1em] text-cream">
                  {feature.title}
                </h3>
                <p className="feature-copy mt-2.5 text-[16px] leading-[1.75] text-cream/75 lg:text-[17px]">
                  {renderTextWithMesudar(feature.description)}
                </p>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
