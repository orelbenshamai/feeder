"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type {
  BundleUpsellOffer,
  Product,
  ProductColorId,
  ProductSizeId,
} from "@/types/product";
import {
  getAvailableColorsForSize,
  getGalleryImagesForSelection,
  getProductDisplayImage,
  getVariantBySize,
  resolveColorForSize,
} from "@/lib/products";
import {
  getBundleCompareAtPrice,
  getBundleTotalPrice,
} from "@/lib/bundles/pricing";
import { PDP_OVERLAY_CARD } from "@/lib/pdp-overlay-layout";
import ProductGallery from "./ProductGallery";
import ProductAboutPanel from "./ProductAboutPanel";
import ProductFeaturesGrid from "./ProductFeaturesGrid";
import ProductVideoSection from "./ProductVideoSection";
import GallerySlide from "./GallerySlide";
import VariantSizeSelector from "./VariantSizeSelector";
import VariantColorSelector from "./VariantColorSelector";
import BundleUpsell from "./BundleUpsell";
import AddToCartButton from "./AddToCartButton";
import ProductCompanionLink from "./ProductCompanionLink";
import ProductAccordion from "./ProductAccordion";
import { formatILS } from "@/lib/pricing";

type ProductCompanionLinkConfig = {
  href: string;
  label: string;
};

type ProductDetailProps = {
  product: Product;
  bundleUpsell?: BundleUpsellOffer;
  companionLink?: ProductCompanionLinkConfig;
  /** Scale gallery images by selected size (mat only). */
  scaleGalleryBySize?: boolean;
};

export default function ProductDetail({
  product,
  bundleUpsell,
  companionLink,
  scaleGalleryBySize = false,
}: ProductDetailProps) {
  const defaultSize =
    product.variants[1]?.id ?? product.variants[0]?.id ?? "medium";
  const defaultColor =
    getAvailableColorsForSize(product, defaultSize)[0]?.id ??
    product.colors[0]?.id ??
    "gray";

  const [selectedSizeId, setSelectedSizeId] = useState<ProductSizeId>(defaultSize);
  const [selectedColorId, setSelectedColorId] =
    useState<ProductColorId>(defaultColor);
  const [bundleEnabled, setBundleEnabled] = useState(false);

  // Desktop: track whether the sticky details panel is in the viewport.
  // When visible → show inline CTA; when out of view → show the fixed sticky bar.
  const desktopPanelRef = useRef<HTMLDivElement>(null);
  // Start true so the sticky is hidden on desktop until the panel actually leaves view.
  const [desktopPanelVisible, setDesktopPanelVisible] = useState(true);

  useEffect(() => {
    const el = desktopPanelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setDesktopPanelVisible(entry.isIntersecting),
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleSelectSize = (sizeId: ProductSizeId) => {
    setSelectedSizeId(sizeId);
    setSelectedColorId((current) => resolveColorForSize(product, sizeId, current));
  };

  const selectedVariant = useMemo(
    () => getVariantBySize(product, selectedSizeId),
    [product, selectedSizeId],
  );

  const baseGalleryImages = useMemo(
    () => getGalleryImagesForSelection(product, selectedSizeId, selectedColorId),
    [product, selectedSizeId, selectedColorId],
  );

  const galleryImages = useMemo(() => {
    if (!bundleEnabled || !bundleUpsell) return baseGalleryImages;

    const bundleImage = bundleUpsell.bundleImageBySize[selectedSizeId];
    const rest = baseGalleryImages.filter((src) => src !== bundleImage);
    return [bundleImage, ...rest];
  }, [baseGalleryImages, bundleEnabled, bundleUpsell, selectedSizeId]);

  const displayImageUrl = useMemo(() => {
    if (bundleEnabled && bundleUpsell) {
      return bundleUpsell.bundleImageBySize[selectedSizeId];
    }
    return getProductDisplayImage(product, selectedSizeId, selectedColorId);
  }, [bundleEnabled, bundleUpsell, product, selectedColorId, selectedSizeId]);

  const availableColors = useMemo(
    () => getAvailableColorsForSize(product, selectedSizeId),
    [product, selectedSizeId],
  );

  const selectedColorLabel =
    product.colors.find((color) => color.id === selectedColorId)?.label ??
    product.colors[0]?.label ??
    "";

  const totalPrice = bundleUpsell
    ? getBundleTotalPrice(selectedVariant, bundleUpsell, bundleEnabled)
    : selectedVariant.price;

  const compareAtPrice = bundleUpsell
    ? getBundleCompareAtPrice(selectedVariant, bundleUpsell, bundleEnabled)
    : selectedVariant.compareAtPrice;

  const productAccordions = (
    <div className="mt-2 border-t border-line/40 pt-2">
      {product.accordions.map((item, index) => (
        <ProductAccordion
          key={item.id}
          title={item.title}
          content={item.content}
          defaultOpen={item.id !== "size-chart" && index === 0}
          variant="light"
        />
      ))}
    </div>
  );

  return (
    <div>
      {/* ── MOBILE ─────────────────────────────────────────────────────── */}
      <div className="lg:hidden">
        <ProductGallery
          images={galleryImages}
          variant={selectedVariant}
          productName={product.name}
          variantImageUrl={displayImageUrl}
          scaleGalleryBySize={scaleGalleryBySize}
        />

        <div className="bg-cream -mt-px">
          {/* Above-the-fold hook */}
          <div className="pdp-mobile-section">
            {/* H1 */}
            <h1 className="font-display text-2xl font-bold leading-snug tracking-tight text-ink sm:text-3xl">
              {product.category}{" "}
              <span className="text-clay" style={{ fontFamily: "var(--font-nunito)" }}>MESUDAR</span>
            </h1>

            {/* Price */}
            <div className="mt-3 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
              <p className="font-display text-3xl font-bold text-ink">{formatILS(totalPrice)}</p>
              {compareAtPrice && compareAtPrice > totalPrice ? (
                <p className="text-base text-stone line-through">{formatILS(compareAtPrice)}</p>
              ) : null}
            </div>
          </div>

          {/* Selectors */}
          <div className="pdp-mobile-section">
            <VariantSizeSelector
              variants={product.variants}
              selectedId={selectedSizeId}
              onSelect={handleSelectSize}
              labelClassName="pdp-option-label"
              compact
            />
            <div className="mt-3.5">
              <VariantColorSelector
                colors={availableColors}
                selectedId={selectedColorId}
                onSelect={setSelectedColorId}
                labelClassName="pdp-option-label"
              />
            </div>
          </div>

          {bundleUpsell ? (
            <div className="pdp-mobile-section">
              <BundleUpsell
                bundle={bundleUpsell}
                sizeId={selectedSizeId}
                checked={bundleEnabled}
                disabled={!selectedVariant.inStock}
                onChange={setBundleEnabled}
              />
            </div>
          ) : null}

          {companionLink ? (
            <div className="pdp-mobile-section">
              <ProductCompanionLink
                href={companionLink.href}
                label={companionLink.label}
              />
            </div>
          ) : null}

          <div className="pdp-mobile-section">{productAccordions}</div>
        </div>
      </div>

      {/* ── STICKY CTA — always on mobile, only when panel is off-screen on desktop ── */}
      <div className={`fixed bottom-0 inset-x-0 z-40 border-t border-line/60 bg-cream/95 backdrop-blur-md transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${desktopPanelVisible ? "lg:translate-y-full lg:opacity-0 lg:pointer-events-none" : "translate-y-0 opacity-100"}`}>
        <div className="mx-auto max-w-7xl px-4 pt-2.5 pb-[calc(0.6rem+env(safe-area-inset-bottom))] lg:px-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-stone">
              {selectedVariant.sizeLabel}
              {selectedColorLabel ? ` / ${selectedColorLabel}` : ""}
              {bundleEnabled && bundleUpsell ? " / חבילה" : ""}
            </span>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-sm font-semibold text-clay hover:text-clay/80 transition-colors underline underline-offset-2"
            >
              שנה אפשרויות
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex flex-col shrink-0">
              <span className="font-display text-xl font-bold text-ink leading-none">{formatILS(totalPrice)}</span>
              {compareAtPrice && compareAtPrice > totalPrice ? (
                <span className="text-xs text-stone line-through">{formatILS(compareAtPrice)}</span>
              ) : null}
            </div>
            <AddToCartButton
              product={product}
              variant={selectedVariant}
              colorId={selectedColorId}
              colorLabel={selectedColorLabel}
              totalPrice={totalPrice}
              bundleEnabled={bundleEnabled}
              bundleUpsell={bundleUpsell}
              className="flex-1"
            />
          </div>
          <p className="mt-1.5 text-center text-xs text-stone/70">
            משלוח חינם לכל הארץ · 3–5 ימי עסקים · אחריות שנתיים
          </p>
        </div>
      </div>

      {/* ── DESKTOP ── */}
      <div className="hidden lg:flex bg-cream" dir="rtl">

        {/* RIGHT: images — cream background */}
        <div className="flex-1 space-y-2 bg-cream p-2">
          {galleryImages.map((src, i) => (
            <GallerySlide
              key={`${src}-${i}`}
              src={src}
              alt={`${product.name} ${i + 1}`}
              imageClassName="w-full object-cover"
              active
              videoTitle={product.video?.title ?? `${product.name} — סרטון`}
              sizeId={scaleGalleryBySize && i === 0 ? selectedSizeId : undefined}
            />
          ))}
        </div>

        {/* LEFT: sticky product details */}
        <div ref={desktopPanelRef} className="w-[420px] xl:w-[460px] shrink-0 sticky top-[var(--site-header-h)] h-[calc(100svh-var(--site-header-h))] overflow-y-auto border-e border-line/50 bg-cream px-8 py-8 xl:px-10">
          {/* Title */}
          <h1 className="font-display text-3xl font-bold leading-snug tracking-tight text-ink xl:text-4xl">
            {product.category}{" "}
            <span className="text-clay" style={{ fontFamily: "var(--font-nunito)" }}>MESUDAR</span>
          </h1>

          {/* Price */}
          <div className="mt-3 flex items-baseline gap-3">
            <p className="font-display text-3xl font-bold text-ink">{formatILS(totalPrice)}</p>
            {compareAtPrice && compareAtPrice > totalPrice ? (
              <p className="text-base text-stone line-through">{formatILS(compareAtPrice)}</p>
            ) : null}
          </div>

          <div className="mt-6 border-t border-line/40 pt-6 space-y-5">
            <VariantSizeSelector
              variants={product.variants}
              selectedId={selectedSizeId}
              onSelect={handleSelectSize}
              labelClassName="purchase-label"
              compact
            />
            <VariantColorSelector
              colors={availableColors}
              selectedId={selectedColorId}
              onSelect={setSelectedColorId}
              labelClassName="purchase-label"
            />
            {bundleUpsell ? (
              <BundleUpsell
                bundle={bundleUpsell}
                sizeId={selectedSizeId}
                checked={bundleEnabled}
                disabled={!selectedVariant.inStock}
                onChange={setBundleEnabled}
              />
            ) : null}
          </div>

          {companionLink ? (
            <div className="mt-6">
              <ProductCompanionLink href={companionLink.href} label={companionLink.label} />
            </div>
          ) : null}

          {/* Inline CTA — desktop only, visible while panel is in viewport */}
          <div className="mt-6 border-t border-line/40 pt-5 space-y-3">
            <AddToCartButton
              product={product}
              variant={selectedVariant}
              colorId={selectedColorId}
              colorLabel={selectedColorLabel}
              totalPrice={totalPrice}
              bundleEnabled={bundleEnabled}
              bundleUpsell={bundleUpsell}
              className="w-full !py-5 !text-base"
            />
            <div className="flex items-center justify-center gap-1.5 text-xs text-stone">
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0" fill="none" aria-hidden>
                <path d="M3 7V5a5 5 0 0110 0v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                <rect x="1.5" y="7" width="13" height="8" rx="2" stroke="currentColor" strokeWidth="1.4"/>
              </svg>
              <span>רכישה מאובטחת · משלוח חינם · אחריות שנתיים</span>
            </div>
          </div>

          {productAccordions}
        </div>
      </div>

      {/* Gradient bridge: cream → ink */}
      <div className="-mt-px h-16 bg-gradient-to-b from-cream to-ink" />

      {/* Dark sections */}
      <div className="pdp-dark">
        {/* Mobile about panel */}
        <div className="lg:hidden bg-ink">
          <div className="pdp-mobile-section">
            <ProductAboutPanel product={product} className="border-t-0 pt-0" />
          </div>
        </div>

        {/* Desktop about panel — full viewport width, centered */}
        <div className="hidden lg:block w-full bg-ink">
          <div className="mx-auto max-w-6xl px-10 py-20 xl:max-w-7xl xl:px-16 xl:py-28">
            <ProductAboutPanel
              product={product}
              className="border-t-0 pt-0"
              centeredOnDesktop
            />
          </div>
        </div>

        <ProductFeaturesGrid product={product} />

        {product.video ? (
          <ProductVideoSection video={product.video} category={product.category} />
        ) : null}
      </div>
    </div>
  );
}
