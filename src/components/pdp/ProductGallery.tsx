"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  motion,
  useMotionValue,
  animate,
  type AnimationPlaybackControls,
} from "framer-motion";
import type { ProductVariant } from "@/types/product";
import { assignGallerySlideBackgrounds } from "@/lib/gallery-slide-backgrounds";
import { getGalleryMainRatio, getGallerySplitPx } from "@/lib/pdp-overlay-layout";
import { isVimeoGalleryItem } from "@/lib/vimeo";
import GallerySlide, { isGalleryVideoSlide } from "./GallerySlide";

type ProductGalleryProps = {
  images: string[];
  variant: ProductVariant;
  productName: string;
  variantImageUrl?: string;
  className?: string;
  overlayControls?: boolean;
  scaleGalleryBySize?: boolean;
};

/** Fallback ratio before viewport is measured (see pdp-overlay-layout). */
export const GALLERY_MAIN_RATIO = getGalleryMainRatio(0);

const SLIDE_TRANSITION = {
  type: "tween" as const,
  duration: 1.2,
  ease: [0.45, 0.05, 0.15, 1] as const,
};

const SWIPE_THRESHOLD_PX = 48;

function toDisplayIndex(extendedIndex: number, slideCount: number): number {
  if (slideCount <= 1) return 0;
  if (extendedIndex === 0) return slideCount - 1;
  if (extendedIndex === slideCount + 1) return 0;
  return extendedIndex - 1;
}

function toExtendedIndex(displayIndex: number): number {
  return displayIndex + 1;
}

/** Map clone/wrap positions back to real slide positions (1..slideCount). */
function repairExtendedIndex(index: number, slideCount: number): number {
  if (slideCount <= 1) return 0;
  if (index === slideCount + 1) return 1;
  if (index === 0) return slideCount;
  if (index < 1 || index > slideCount + 1) return 1;
  return index;
}

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
  scaleGalleryBySize = false,
}: ProductGalleryProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [viewportWidth, setViewportWidth] = useState(0);
  const trackX = useMotionValue(0);
  const animationRef = useRef<AnimationPlaybackControls | null>(null);
  const didInitialLayout = useRef(false);
  const skipVariantSync = useRef(true);
  const extendedIndexRef = useRef(0);
  const slideWidthRef = useRef(0);
  const prevSlideWidthRef = useRef(0);
  const animGenerationRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const slides = useMemo(() => {
    const unique = Array.from(new Set(images));
    return unique.length > 0 ? unique : [variant.imageUrl];
  }, [images, variant.imageUrl]);

  const slideCount = slides.length;
  const hasMultiple = slideCount > 1;

  const extendedSlides = useMemo(() => {
    if (!hasMultiple) return slides;
    return [slides[slideCount - 1], ...slides, slides[0]];
  }, [hasMultiple, slideCount, slides]);

  const slideBackgrounds = useMemo(
    () => assignGallerySlideBackgrounds(slideCount),
    [slideCount],
  );

  const extendedBackgrounds = useMemo(() => {
    if (!hasMultiple) return slideBackgrounds;
    return [
      slideBackgrounds[slideCount - 1],
      ...slideBackgrounds,
      slideBackgrounds[0],
    ];
  }, [hasMultiple, slideBackgrounds, slideCount]);

  const resolveDisplayIndex = (targetUrl?: string) => {
    const target = targetUrl ?? variant.imageUrl;
    const found = slides.findIndex((src) => src === target);
    return found >= 0 ? found : 0;
  };

  const [extendedIndex, setExtendedIndex] = useState(() => {
    const display = resolveDisplayIndex(variantImageUrl);
    return hasMultiple ? toExtendedIndex(display) : 0;
  });
  const [showTrack, setShowTrack] = useState(false);

  extendedIndexRef.current = extendedIndex;
  const displayIndex = hasMultiple
    ? toDisplayIndex(extendedIndex, slideCount)
    : 0;

  const mainWidth =
    viewportWidth > 0
      ? overlayControls && hasMultiple
        ? Math.round(getGallerySplitPx(viewportWidth))
        : viewportWidth
      : 0;

  const slideWidth =
    overlayControls && hasMultiple && mainWidth > 0
      ? mainWidth
      : viewportWidth;

  slideWidthRef.current = slideWidth;

  const restTrackX = useCallback(
    (targetExtendedIndex: number) => {
      const width = slideWidthRef.current;
      return width > 0 && hasMultiple ? -targetExtendedIndex * width : 0;
    },
    [hasMultiple],
  );

  const commitExtendedIndex = useCallback(
    (targetExtendedIndex: number) => {
      const repaired = hasMultiple
        ? repairExtendedIndex(targetExtendedIndex, slideCount)
        : 0;

      extendedIndexRef.current = repaired;
      setExtendedIndex(repaired);
      trackX.set(restTrackX(repaired));
    },
    [hasMultiple, restTrackX, slideCount, trackX],
  );

  const finishAnimatedMove = useCallback(
    (landedExtendedIndex: number, generation: number) => {
      isAnimatingRef.current = false;
      setIsAnimating(false);

      if (!hasMultiple || slideCount <= 1) return;

      if (landedExtendedIndex === slideCount + 1 || landedExtendedIndex === 0) {
        if (generation !== animGenerationRef.current) return;
        commitExtendedIndex(landedExtendedIndex === slideCount + 1 ? 1 : slideCount);
        return;
      }

      if (generation !== animGenerationRef.current) return;
      commitExtendedIndex(landedExtendedIndex);
    },
    [commitExtendedIndex, hasMultiple, slideCount],
  );

  const moveToExtendedIndex = useCallback(
    (targetExtendedIndex: number, animateSlide = false) => {
      if (slideWidthRef.current <= 0 || !hasMultiple) return;

      animationRef.current?.stop();
      animGenerationRef.current += 1;
      const generation = animGenerationRef.current;

      const fromExtendedIndex = repairExtendedIndex(
        extendedIndexRef.current,
        slideCount,
      );
      if (fromExtendedIndex !== extendedIndexRef.current) {
        commitExtendedIndex(fromExtendedIndex);
      }

      const destination = restTrackX(targetExtendedIndex);

      if (!animateSlide) {
        commitExtendedIndex(targetExtendedIndex);
        return;
      }

      isAnimatingRef.current = true;
      setIsAnimating(true);

      extendedIndexRef.current = targetExtendedIndex;
      setExtendedIndex(targetExtendedIndex);

      const expectedOrigin = restTrackX(fromExtendedIndex);
      if (Math.abs(trackX.get() - expectedOrigin) > 2) {
        trackX.set(expectedOrigin);
      }

      animationRef.current = animate(trackX, destination, {
        ...SLIDE_TRANSITION,
        onComplete: () => finishAnimatedMove(targetExtendedIndex, generation),
      });
    },
    [
      commitExtendedIndex,
      finishAnimatedMove,
      hasMultiple,
      restTrackX,
      slideCount,
      trackX,
    ],
  );

  const jumpToIndex = useCallback(
    (targetDisplayIndex: number, animateSlide = false) => {
      moveToExtendedIndex(
        hasMultiple ? toExtendedIndex(targetDisplayIndex) : 0,
        animateSlide,
      );
    },
    [hasMultiple, moveToExtendedIndex],
  );

  const jumpToIndexRef = useRef(jumpToIndex);
  jumpToIndexRef.current = jumpToIndex;

  useEffect(() => {
    if (!showTrack || slideWidthRef.current <= 0) return;
    if (skipVariantSync.current) {
      skipVariantSync.current = false;
      return;
    }

    jumpToIndexRef.current(resolveDisplayIndex(variantImageUrl), false);
  }, [variantImageUrl, variant.imageUrl, slides, showTrack]);

  useEffect(() => {
    if (!hasMultiple) {
      setExtendedIndex(0);
      extendedIndexRef.current = 0;
    }
  }, [hasMultiple]);

  useEffect(() => {
    if (!showTrack || slideWidth <= 0) return;

    if (!hasMultiple) {
      trackX.set(0);
      prevSlideWidthRef.current = slideWidth;
      return;
    }

    if (prevSlideWidthRef.current === slideWidth) return;
    prevSlideWidthRef.current = slideWidth;

    animationRef.current?.stop();
    isAnimatingRef.current = false;
    setIsAnimating(false);

    const repaired = repairExtendedIndex(extendedIndexRef.current, slideCount);
    commitExtendedIndex(repaired);
  }, [commitExtendedIndex, hasMultiple, showTrack, slideCount, slideWidth]);

  useEffect(() => {
    slides.forEach((src) => {
      if (isVimeoGalleryItem(src)) return;
      const img = new Image();
      img.src = src;
    });
  }, [slides]);

  useLayoutEffect(() => {
    if (didInitialLayout.current) return;

    const node = viewportRef.current;
    if (!node) return;

    const width = node.offsetWidth;
    if (width <= 0) return;

    didInitialLayout.current = true;
    setViewportWidth(width);

    const displayIdx = resolveDisplayIndex(variantImageUrl);
    const extIdx = hasMultiple ? toExtendedIndex(displayIdx) : 0;
    setExtendedIndex(extIdx);
    extendedIndexRef.current = extIdx;

    const cellWidth =
      overlayControls && hasMultiple
        ? Math.round(getGallerySplitPx(width))
        : width;
    trackX.set(cellWidth > 0 && hasMultiple ? -extIdx * cellWidth : 0);
    setShowTrack(true);
  }, [hasMultiple, overlayControls, trackX, variantImageUrl, variant.imageUrl, slides]);

  useEffect(() => {
    const node = viewportRef.current;
    if (!node) return;

    const observer = new ResizeObserver(() => {
      const width = node.offsetWidth;
      if (width <= 0) return;
      setViewportWidth(width);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [overlayControls, showTrack]);

  const goPrev = useCallback(() => {
    if (!hasMultiple) return;
    const current = repairExtendedIndex(extendedIndexRef.current, slideCount);
    const target = current === 1 ? 0 : current - 1;
    moveToExtendedIndex(target, true);
  }, [hasMultiple, moveToExtendedIndex, slideCount]);

  const goNext = useCallback(() => {
    if (!hasMultiple) return;
    const current = repairExtendedIndex(extendedIndexRef.current, slideCount);
    const target = current === slideCount ? slideCount + 1 : current + 1;
    moveToExtendedIndex(target, true);
  }, [hasMultiple, moveToExtendedIndex, slideCount]);

  useEffect(() => {
    if (overlayControls || !hasMultiple || !showTrack) return;

    const node = viewportRef.current;
    if (!node) return;

    let startX = 0;
    let startY = 0;

    const onTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      startX = touch.clientX;
      startY = touch.clientY;
    };

    const onTouchEnd = (event: TouchEvent) => {
      const touch = event.changedTouches[0];
      if (!touch) return;

      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;

      if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX) return;
      if (Math.abs(deltaX) <= Math.abs(deltaY)) return;

      if (deltaX < 0) goNext();
      else goPrev();
    };

    node.addEventListener("touchstart", onTouchStart, { passive: true });
    node.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      node.removeEventListener("touchstart", onTouchStart);
      node.removeEventListener("touchend", onTouchEnd);
    };
  }, [overlayControls, hasMultiple, showTrack, goNext, goPrev]);

  const goTo = (target: number) => {
    if (!hasMultiple) return;
    moveToExtendedIndex(toExtendedIndex(target), true);
  };

  const imageShell = overlayControls
    ? "absolute inset-0 bg-cream"
    : "relative w-full";

  const imageFrame = overlayControls
    ? "absolute inset-0 overflow-hidden"
    : "relative w-full touch-pan-y overflow-hidden aspect-[1376/768]";

  const mainImageClass =
    overlayControls && hasMultiple
      ? "h-full w-[88%] max-w-[88%] -ml-[4%] object-contain object-left py-4 lg:py-6"
      : overlayControls
        ? "h-full w-full object-contain object-center py-4 lg:py-6"
        : "block w-full h-auto";

  const trackClass = "flex h-full will-change-transform";

  const renderTrack = () => (
    <motion.div className={trackClass} style={{ x: trackX }}>
      {extendedSlides.map((src, i) => {
        const slideDisplayIndex = hasMultiple
          ? toDisplayIndex(i, slideCount)
          : 0;

        return (
        <div
          key={`slide-${i}-${src}`}
          className="relative h-full shrink-0 overflow-hidden"
          style={{
            width: slideWidth > 0 ? slideWidth : "100%",
            backgroundColor: overlayControls
              ? (extendedBackgrounds[i] ?? extendedBackgrounds[0])
              : "#F7F5F0",
          }}
          aria-hidden={i !== extendedIndex}
        >
          <GallerySlide
            src={src}
            alt={`${productName} — ${variant.sizeLabel}${
              hasMultiple ? ` (${slideDisplayIndex + 1}/${slideCount})` : ""
            }`}
            imageClassName={mainImageClass}
            active={
              isGalleryVideoSlide(src)
                ? i === extendedIndex && !isAnimating
                : true
            }
            fillFrame
            videoTitle={`${productName} — סרטון`}
            sizeId={scaleGalleryBySize ? variant.id : undefined}
            imageBoost={1.1}
            priority={i === extendedIndex && !isGalleryVideoSlide(src)}
          />
        </div>
        );
      })}
    </motion.div>
  );

  return (
    <div className={`${imageShell} ${className}`}>
      <div ref={viewportRef} className={imageFrame} dir="ltr">
        {showTrack && slideWidth > 0 ? renderTrack() : null}

        {!overlayControls && hasMultiple ? (
          <div className="pointer-events-none absolute inset-x-0 inset-y-0 z-20 flex items-center justify-between px-3 sm:px-4">
            <button
              type="button"
              onClick={goPrev}
              aria-label="תמונה קודמת"
              className={`${navButtonClass} pointer-events-auto h-10 w-10`}
            >
              <PrevIcon />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="תמונה הבאה"
              className={`${navButtonClass} pointer-events-auto h-10 w-10`}
            >
              <NextIcon />
            </button>
          </div>
        ) : null}

        {hasMultiple ? (
          <div
            dir="ltr"
            className={
              overlayControls
                ? "absolute bottom-8 left-8 z-20 flex items-center gap-3"
                : "absolute bottom-4 inset-x-0 z-20 flex items-center justify-center"
            }
            {...(!overlayControls
              ? { "aria-label": "החלק לגלילה בין תמונות וסרטון" }
              : {})}
          >
            {overlayControls ? (
              <button
                type="button"
                onClick={goPrev}
                aria-label="תמונה קודמת"
                className={navButtonClass}
              >
                <PrevIcon />
              </button>
            ) : null}

            <div className="flex items-center gap-1.5">
              {slides.map((slide, i) => {
                const isVideo = isGalleryVideoSlide(slide);
                const isCurrent = i === displayIndex;

                return (
                  <button
                    key={`${slide}-${i}`}
                    type="button"
                    aria-label={
                      isVideo
                        ? `הצג סרטון ${i + 1}`
                        : `הצג תמונה ${i + 1}`
                    }
                    aria-current={isCurrent}
                    onClick={() => goTo(i)}
                    className={
                      isVideo
                        ? `inline-flex items-center justify-center rounded-full transition-all ${
                            isCurrent
                              ? "h-5 w-5 bg-clay text-cream"
                              : "h-4 w-4 bg-stone/30 text-stone/70 hover:bg-stone/50"
                          }`
                        : `rounded-full transition-all ${
                            isCurrent
                              ? "h-2 w-5 bg-clay"
                              : "h-2 w-2 bg-stone/30 hover:bg-stone/50"
                          }`
                    }
                  >
                    {isVideo ? (
                      <svg
                        viewBox="0 0 24 24"
                        className={`fill-current ${isCurrent ? "h-2.5 w-2.5" : "h-2 w-2"}`}
                        aria-hidden
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    ) : null}
                  </button>
                );
              })}
            </div>

            {overlayControls ? (
              <button
                type="button"
                onClick={goNext}
                aria-label="תמונה הבאה"
                className={navButtonClass}
              >
                <NextIcon />
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
