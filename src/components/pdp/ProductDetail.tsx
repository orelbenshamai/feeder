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
import ProductInfoAccordions from "./ProductInfoAccordions";
import ProductFeaturesGrid from "./ProductFeaturesGrid";
import ProductVideoSection from "./ProductVideoSection";
import GallerySlide from "./GallerySlide";
import VariantSizeSelector from "./VariantSizeSelector";
import VariantColorSelector from "./VariantColorSelector";
import BundleUpsell from "./BundleUpsell";
import AddToCartButton from "./AddToCartButton";
import ProductCompanionLink from "./ProductCompanionLink";
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
        </div>
      </div>

      {/* ── DESKTOP ── */}
      <div className="hidden min-h-below-header lg:flex bg-cream" dir="rtl">

        {/* Gallery — 60% */}
        <div className="w-3/5 shrink-0 space-y-2 bg-cream p-2">
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

        {/* Purchase panel — 40% */}
        <div
          ref={desktopPanelRef}
          className="pdp-desktop-panel sticky top-[var(--site-header-h)] flex h-below-header w-2/5 shrink-0 flex-col border-e border-line/50 bg-cream px-8 py-6 xl:px-10 xl:py-8"
        >
          {/* Header — title + price */}
          <div className="shrink-0">
            <h1 className="font-display text-2xl font-bold leading-snug tracking-tight text-ink xl:text-3xl">
              {product.category}{" "}
              <span className="text-clay" style={{ fontFamily: "var(--font-nunito)" }}>MESUDAR</span>
            </h1>

            <div className="mt-2 flex items-baseline gap-3">
              <p className="font-display text-2xl font-bold text-ink xl:text-3xl">{formatILS(totalPrice)}</p>
            </div>
          </div>

          {/* Selectors */}
          <div className="mt-5 shrink-0 border-t border-line/40 pt-5">
            <div className="flex flex-col gap-4">
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
            </div>
          </div>

          {/* Bundle — flexible, grows into remaining space */}
          {bundleUpsell ? (
            <div className="mt-4 min-h-0 flex-1">
              <BundleUpsell
                bundle={bundleUpsell}
                sizeId={selectedSizeId}
                checked={bundleEnabled}
                onChange={setBundleEnabled}
              />
            </div>
          ) : null}

          {companionLink ? (
            <div className="mt-3 shrink-0">
              <ProductCompanionLink
                href={companionLink.href}
                label={companionLink.label}
              />
            </div>
          ) : null}

          {/* CTA — always at the bottom */}
          <div className="mt-auto shrink-0 border-t border-line/40 pt-4">
            <AddToCartButton
              product={product}
              variant={selectedVariant}
              colorId={selectedColorId}
              colorLabel={selectedColorLabel}
              totalPrice={totalPrice}
              bundleEnabled={bundleEnabled}
              bundleUpsell={bundleUpsell}
              className="w-full !py-4 !text-base"
            />
          </div>
        </div>
      </div>

      {/* Gradient bridge: cream → ink */}
      <div className="-mt-px h-16 bg-gradient-to-b from-cream to-ink" />

      {/* Dark sections */}
      <div className="pdp-dark">
        <div className="lg:hidden bg-ink">
          <div className="pdp-mobile-section">
            <ProductInfoAccordions product={product} className="border-t-0 pt-0" />
          </div>
        </div>

        <div className="hidden lg:block w-full bg-ink">
          <div className="mx-auto max-w-6xl px-10 py-20 xl:max-w-7xl xl:px-16 xl:py-28">
            <ProductInfoAccordions
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
