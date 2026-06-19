"use client";

import type { Product } from "@/types/product";
import { renderTextWithMesudar } from "@/components/MesudarWordmark";

type ProductDescriptionAccordionProps = {
  product: Product;
  defaultOpen?: boolean;
  variant?: "light" | "dark";
  centeredOnDesktop?: boolean;
};

export default function ProductDescriptionAccordion({
  product,
  defaultOpen = true,
  variant = "light",
  centeredOnDesktop = false,
}: ProductDescriptionAccordionProps) {
  const aboutParagraphs = product.about.split("\n\n").filter(Boolean);
  const calloutAfter = product.aboutCalloutAfter ?? -1;
  const isDark = variant === "dark";

  return (
    <details
      className={
        isDark
          ? "group border-b border-cream/12 py-4 open:border-clay/35"
          : "group border-b border-line/70 py-4 open:border-clay/40"
      }
      open={defaultOpen}
    >
      <summary
        className={
          isDark
            ? "flex cursor-pointer list-none items-center justify-between gap-4 font-display font-bold leading-snug tracking-tight text-cream transition-colors group-hover:text-cream/80 [&::-webkit-details-marker]:hidden"
            : "flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-semibold text-ink transition-colors group-hover:text-ink/80 [&::-webkit-details-marker]:hidden"
        }
      >
        תיאור
        <svg
          viewBox="0 0 20 20"
          className={
            isDark
              ? "shrink-0 text-cream/45 transition-transform duration-300 group-open:rotate-180 group-open:text-clay"
              : "h-4 w-4 shrink-0 text-stone transition-transform duration-300 group-open:rotate-180 group-open:text-clay"
          }
          fill="none"
          aria-hidden
        >
          <path
            d="M5 8l5 5 5-5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </summary>

      <div
        className={`mt-3 space-y-4 ${centeredOnDesktop ? "lg:mx-auto lg:max-w-5xl lg:space-y-8 xl:max-w-6xl" : "max-w-prose"}`}
      >
        {product.highlights?.length ? (
          <ul
            className={`pdp-description-highlights space-y-2.5 ${
              centeredOnDesktop ? "lg:space-y-4" : ""
            }`}
            aria-label="יתרונות עיקריים"
          >
            {product.highlights.map((item) => (
              <li
                key={item}
                className={`flex items-start gap-2.5 text-[14px] font-semibold leading-snug sm:text-[15px] ${
                  isDark ? "text-cream/90" : "text-ink"
                } ${centeredOnDesktop ? "lg:text-lg lg:font-bold lg:leading-snug xl:text-xl" : ""}`}
              >
                <span
                  className={`mt-[0.45rem] shrink-0 rounded-full bg-clay ${
                    centeredOnDesktop ? "mt-0 h-2 w-2 xl:h-2.5 xl:w-2.5" : "h-1.5 w-1.5"
                  }`}
                  aria-hidden
                />
                <span>{renderTextWithMesudar(item)}</span>
              </li>
            ))}
          </ul>
        ) : null}

        <div className={product.highlights?.length ? "space-y-4 pt-1 lg:pt-2" : "space-y-4"}>
          {aboutParagraphs.flatMap((block, index) => {
            const nodes = [
              <p
                key={`about-${index}`}
                className={
                  isDark
                    ? `section-lead ${centeredOnDesktop ? "lg:text-center lg:text-xl lg:leading-[1.85] xl:text-2xl xl:leading-[1.8]" : ""}`
                    : "body-on-light text-[15px] leading-[1.7] sm:text-[16px] sm:leading-[1.75]"
                }
              >
                {renderTextWithMesudar(block)}
              </p>,
            ];

            if (product.aboutCallout && calloutAfter === index) {
              nodes.push(
                <p
                  key="about-callout"
                  className={`font-display font-bold leading-snug tracking-tight text-cream ${
                    centeredOnDesktop
                      ? "text-[1.35rem] sm:text-xl lg:text-center lg:text-3xl xl:text-4xl lg:leading-[1.25] lg:my-8 xl:my-10"
                      : "text-[15px] sm:text-[16px] my-2 sm:my-3"
                  }`}
                >
                  {renderTextWithMesudar(product.aboutCallout)}
                </p>,
              );
            }

            return nodes;
          })}
        </div>
      </div>
    </details>
  );
}
