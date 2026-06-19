"use client";

import type { Product } from "@/types/product";
import { renderTextWithMesudar } from "@/components/MesudarWordmark";

type ProductDescriptionAccordionProps = {
  product: Product;
  defaultOpen?: boolean;
  variant?: "light" | "dark";
  centeredOnDesktop?: boolean;
};

/** Pick a small SVG icon based on keywords in the highlight text. */
function HighlightIcon({ text }: { text: string }) {
  const t = text;

  // Water / floor dry
  if (/רצפה|מים|יבש|נשפכ|אגן|ניקוז/.test(t))
    return (
      <svg viewBox="0 0 20 20" fill="none" aria-hidden className="h-5 w-5 shrink-0 text-clay">
        <path d="M10 3C10 3 4.5 9.5 4.5 13a5.5 5.5 0 0011 0C15.5 9.5 10 3 10 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M7.5 14.5c.6 1 1.5 1.5 2.5 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    );

  // Food / mess / scatter
  if (/מזון|שאריות|פירור|מתפזר|מתגלגל|מבולגן/.test(t))
    return (
      <svg viewBox="0 0 20 20" fill="none" aria-hidden className="h-5 w-5 shrink-0 text-clay">
        <circle cx="10" cy="10" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M7 10h6M10 7v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    );

  // Dogs / cats / animals
  if (/כלב|חתול|חיית|בעל חיים/.test(t))
    return (
      <svg viewBox="0 0 20 20" fill="none" aria-hidden className="h-5 w-5 shrink-0 text-clay">
        <ellipse cx="10" cy="11.5" rx="5.5" ry="4" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="7" cy="6" r="1.3" stroke="currentColor" strokeWidth="1.3"/>
        <circle cx="13" cy="6" r="1.3" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M6.5 8c.5-.8 1.5-1.3 3.5-1.3s3 .5 3.5 1.3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    );

  // Walls / splash guard / raised rim
  if (/קיר|מוגבה|גובה|שוליים|מגן|התזה/.test(t))
    return (
      <svg viewBox="0 0 20 20" fill="none" aria-hidden className="h-5 w-5 shrink-0 text-clay">
        <rect x="3" y="5" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M3 9h14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    );

  // Bowls / dishwasher / stainless
  if (/קערה|נירוסטה|מדיח|ניקוי/.test(t))
    return (
      <svg viewBox="0 0 20 20" fill="none" aria-hidden className="h-5 w-5 shrink-0 text-clay">
        <path d="M4 8c0 3.3 2.7 6 6 6s6-2.7 6-6H4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M3 8h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M10 14v2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M7.5 16.5h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    );

  // Non-slip / stable / silicone legs
  if (/סיליקון|יציב|נגד החלקה|לא זז|לא מחליק/.test(t))
    return (
      <svg viewBox="0 0 20 20" fill="none" aria-hidden className="h-5 w-5 shrink-0 text-clay">
        <path d="M4 15h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M6 15V9l4-4 4 4v6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    );

  // Default checkmark
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className="h-5 w-5 shrink-0 text-clay">
      <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M6.5 10.5 9 13l5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function ProductDescriptionAccordion({
  product,
  defaultOpen = true,
  variant = "light",
  centeredOnDesktop = false,
}: ProductDescriptionAccordionProps) {
  const aboutParagraphs = product.about.split("\n\n").filter(Boolean);
  const calloutAfter = product.aboutCalloutAfter ?? -1;
  const isDark = variant === "dark";

  const textBase = isDark ? "text-cream/90" : "text-ink";
  const textMuted = isDark ? "text-cream/60" : "text-ink/65";
  const borderColor = isDark ? "border-cream/10" : "border-line/60";

  return (
    <details
      className={`group border-b ${borderColor} py-6 open:pb-8`}
      open={defaultOpen}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
        <span className={`font-display font-bold leading-snug tracking-tight ${isDark ? "text-cream" : "text-ink"}`}>
          תיאור
        </span>
        <svg
          viewBox="0 0 20 20"
          className={`shrink-0 transition-transform duration-300 group-open:rotate-180 ${isDark ? "text-cream/40 group-open:text-clay" : "text-stone group-open:text-clay"}`}
          fill="none"
          aria-hidden
        >
          <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </summary>

      {/* Animated reveal wrapper */}
      <div className="accordion-body mt-6 space-y-8">

        {/* ── Highlights — icon grid ── */}
        {product.highlights?.length ? (
          <ul
            className={`grid gap-x-6 gap-y-4 ${
              centeredOnDesktop
                ? "sm:grid-cols-2 lg:gap-y-5"
                : "sm:grid-cols-1"
            }`}
            aria-label="יתרונות עיקריים"
          >
            {product.highlights.map((item) => {
              const [lead, rest] = item.split(" — ");
              return (
                <li key={item} className="flex items-start gap-3">
                  <HighlightIcon text={item} />
                  <span className={`text-[17px] leading-snug sm:text-[18px] ${isDark ? "text-cream/90" : "text-ink"}`}>
                    <strong className="font-bold">{lead}</strong>
                    {rest ? <span className={` font-normal ${textMuted}`}> — {rest}</span> : null}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : null}

        {/* ── Callout (if before about) ── */}
        {product.aboutCallout && calloutAfter === -1 ? (
          <p className={`border-s-2 border-clay ps-4 font-display text-base font-bold leading-snug tracking-tight sm:text-lg ${isDark ? "text-cream" : "text-ink"}`}>
            {renderTextWithMesudar(product.aboutCallout)}
          </p>
        ) : null}

        {/* ── About paragraphs — condensed ── */}
        <div className={`space-y-5 border-t pt-6 ${borderColor}`}>
          {aboutParagraphs.map((block, index) => (
            <div key={index}>
              <p className={`text-[16px] leading-[1.75] sm:text-[17px] sm:leading-[1.8] ${textMuted} ${centeredOnDesktop ? "lg:text-[18px]" : ""}`}>
                {renderTextWithMesudar(block)}
              </p>
              {product.aboutCallout && calloutAfter === index ? (
                <p className={`mt-5 border-s-2 border-clay ps-4 font-display text-base font-bold leading-snug tracking-tight sm:text-lg ${isDark ? "text-cream" : "text-ink"}`}>
                  {renderTextWithMesudar(product.aboutCallout)}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </details>
  );
}
