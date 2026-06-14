"use client";

import { renderTextWithMesudar } from "@/components/MesudarWordmark";
import type { Product } from "@/types/product";

type ProductFeaturesGridProps = {
  product: Product;
};

export default function ProductFeaturesGrid({ product }: ProductFeaturesGridProps) {
  return (
    <section
      dir="rtl"
      aria-label="תכונות המוצר"
      className="bg-ink pt-6 pb-28 sm:py-16 lg:py-20"
    >
      {/* Mobile: horizontal carousel — RTL-native, no JS hack */}
      <ul
        className="flex list-none gap-4 overflow-x-auto overscroll-x-contain scroll-smooth pb-2 sm:hidden"
        style={{ scrollSnapType: "x mandatory", scrollPaddingInlineStart: "1.25rem" }}
        aria-label="תכונות המוצר — החליקו לתכונה הבאה"
      >
        {/* Leading spacer so first card has breathing room from edge */}
        <li className="w-5 shrink-0" aria-hidden />
        {product.features.map((feature) => (
          <li
            key={feature.title}
            className="w-[92vw] max-w-[24rem] shrink-0"
            style={{ scrollSnapAlign: "start" }}
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
        {/* Trailing spacer */}
        <li className="w-5 shrink-0" aria-hidden />
      </ul>

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
