"use client";

import { useEffect, useMemo, useState } from "react";
import type { ProductVariant } from "@/types/product";

type ProductGalleryProps = {
  images: string[];
  variant: ProductVariant;
  productName: string;
  variantImageUrl?: string;
  className?: string;
  overlayControls?: boolean;
};

const navButtonClass =
  "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line/80 bg-cream/95 text-ink shadow-[0_4px_16px_-6px_rgba(31,58,82,0.25)] transition hover:border-clay/60 hover:text-ink";

function PrevIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden>
      <path
        d="M12 5 7 10l5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function NextIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden>
      <path
        d="M8 5l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ProductGallery({
  images,
  variant,
  productName,
  variantImageUrl,
  className = "",
  overlayControls = false,
}: ProductGalleryProps) {
  const slides = useMemo(() => {
    const unique = Array.from(new Set(images));
    return unique.length > 0 ? unique : [variant.imageUrl];
  }, [images, variant.imageUrl]);

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const target = variantImageUrl ?? variant.imageUrl;
    const nextIndex = slides.findIndex((src) => src === target);
    setIndex(nextIndex >= 0 ? nextIndex : 0);
  }, [slides, variant.imageUrl, variantImageUrl]);

  const current = slides[index] ?? variant.imageUrl;
  const hasMultiple = slides.length > 1;

  const goPrev = () => {
    setIndex((i) => (i - 1 + slides.length) % slides.length);
  };

  const goNext = () => {
    setIndex((i) => (i + 1) % slides.length);
  };

  const imageShell = overlayControls
    ? "absolute inset-0 bg-cream"
    : "relative w-full overflow-visible";

  const imageFrame = overlayControls
    ? "relative h-full w-full"
    : "relative aspect-[4/5] w-full sm:aspect-[5/6]";

  return (
    <div className={`${imageShell} ${className}`}>
      <div className={imageFrame}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={current}
          src={current}
          alt={`${productName} — ${variant.sizeLabel}`}
          className={
            overlayControls
              ? "absolute inset-0 m-auto h-full w-full max-h-full max-w-full object-contain object-center p-2 lg:p-4 xl:p-5"
              : "absolute inset-0 h-full w-full object-contain object-center"
          }
          draggable={false}
        />
      </div>

      {hasMultiple ? (
        <div
          dir="ltr"
          className={
            overlayControls
              ? "absolute bottom-8 left-8 z-10 flex items-center gap-3"
              : "mt-4 flex items-center justify-center gap-3"
          }
        >
          <button
            type="button"
            onClick={goPrev}
            aria-label="תמונה קודמת"
            className={navButtonClass}
          >
            <PrevIcon />
          </button>

          <div className="flex items-center gap-1.5">
            {slides.map((slide, i) => (
              <button
                key={slide}
                type="button"
                aria-label={`הצג תמונה ${i + 1}`}
                aria-current={i === index}
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all ${
                  i === index ? "w-5 bg-clay" : "w-2 bg-stone/30 hover:bg-stone/50"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={goNext}
            aria-label="תמונה הבאה"
            className={navButtonClass}
          >
            <NextIcon />
          </button>
        </div>
      ) : null}
    </div>
  );
}
