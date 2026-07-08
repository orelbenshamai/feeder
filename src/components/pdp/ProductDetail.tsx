"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
} from "@/lib/products/helpers";
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
import { usePinToVisualViewportBottom } from "@/lib/use-pin-to-visual-viewport-bottom";
import { STOCK_MODE } from "@/lib/flags";

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
  const [bundleOutOfStock, setBundleOutOfStock] = useState(false);
  const [qty, setQty] = useState(1);

  const handleBundleToggle = (next: boolean) => {
    if (next && bundleUpsell) {
      const mainInStock = selectedVariant.inStock;
      const addonInStock = bundleUpsell.addonInStockBySize?.[selectedSizeId] ?? false;
      if (!mainInStock || !addonInStock) {
        setBundleOutOfStock(true);
        setTimeout(() => setBundleOutOfStock(false), 3500);
        return;
      }
    }
    setBundleEnabled(next);
  };

  const desktopPanelRef = useRef<HTMLDivElement>(null);

  const handleSelectSize = (sizeId: ProductSizeId) => {
    setSelectedSizeId(sizeId);
    setSelectedColorId((current) => resolveColorForSize(product, sizeId, current));
    setQty(1);
    setBundleOutOfStock(false);
    if (bundleEnabled && bundleUpsell) {
      const inStock = bundleUpsell.addonInStockBySize?.[sizeId] ?? true;
      if (!inStock) setBundleEnabled(false);
    }
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

  const floatingBarRef = useRef<HTMLDivElement>(null);
  usePinToVisualViewportBottom(floatingBarRef);

  const ctaOutOfStock =
    STOCK_MODE === "notify" ? true : !selectedVariant.inStock;

  const totalPrice = bundleUpsell
    ? getBundleTotalPrice(selectedVariant, bundleUpsell, bundleEnabled)
    : selectedVariant.price;

  const compareAtPrice = bundleUpsell
    ? getBundleCompareAtPrice(selectedVariant, bundleUpsell, bundleEnabled)
    : selectedVariant.compareAtPrice;

  return (
    <div>
      {/* ── BUNDLE OUT-OF-STOCK TOAST ────────────────────────────────────── */}
      <AnimatePresence>
        {bundleOutOfStock && bundleUpsell && (
          <motion.div
            key="bundle-oos-toast"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            style={{ left: "50%", transform: "translateX(-50%)" }}
            className="fixed top-5 z-[9999] w-fit flex items-center gap-3 rounded-sm bg-ink px-5 py-3.5 shadow-2xl"
          >
            <span className="text-xl">⚠️</span>
            <p className="text-sm font-semibold text-cream whitespace-nowrap">
              {bundleUpsell.addonName} אזל במלאי לגודל זה
            </p>
          </motion.div>
        )}
      </AnimatePresence>

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
              {bundleEnabled && bundleUpsell?.bundleProductCategory
                ? bundleUpsell.bundleProductCategory
                : product.category}{" "}
              <span className="text-clay" style={{ fontFamily: "var(--font-nunito)" }}>MESUDAR</span>
            </h1>

            {/* Price */}
            <div className="mt-3 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
              <p className="font-display text-3xl font-bold text-ink">{formatILS(totalPrice)}</p>
              {compareAtPrice && compareAtPrice > totalPrice && (
                <p className="text-base text-stone/50 line-through">{formatILS(compareAtPrice)}</p>
              )}
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
                onChange={handleBundleToggle}
                mainInStock={selectedVariant.inStock}
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

          {/* Space so cream-section content clears the floating bar */}
          <div
            className="lg:hidden"
            style={{
              height:
                "calc(var(--pdp-floating-bar-h, 5.5rem) + env(safe-area-inset-bottom, 0px))",
            }}
            aria-hidden
          />
        </div>
      </div>

      {/* ── FLOATING BUY BAR ── */}
      <div
        ref={floatingBarRef}
        className="fixed inset-x-0 bottom-0 z-40 bg-ink shadow-[0_-8px_40px_-8px_rgba(0,0,0,0.4)] lg:bottom-0"
      >
        <div className="mx-auto flex max-w-2xl items-center gap-2.5 px-4 py-3">

          {/* Quantity stepper — hidden when out of stock to keep the bar compact */}
          {!ctaOutOfStock ? (
            <div className="flex shrink-0 items-center overflow-hidden rounded-sm border-2 border-cream/20">
              <button
                type="button"
                onClick={() => setQty(q => Math.max(1, q - 1))}
                className="px-3.5 py-3.5 text-lg font-bold leading-none text-cream/40 transition-colors hover:bg-cream/10 hover:text-cream"
                aria-label="הפחת כמות"
              >
                −
              </button>
              <span className="w-8 select-none text-center text-base font-bold tabular-nums text-cream">
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty(q => q + 1)}
                className="px-3.5 py-3.5 text-lg font-bold leading-none text-cream/40 transition-colors hover:bg-cream/10 hover:text-cream"
                aria-label="הוסף כמות"
              >
                +
              </button>
            </div>
          ) : null}

          {/* CTA */}
          <AddToCartButton
            product={product}
            variant={selectedVariant}
            colorId={selectedColorId}
            colorLabel={selectedColorLabel}
            totalPrice={totalPrice * qty}
            quantity={qty}
            bundleEnabled={bundleEnabled}
            bundleUpsell={bundleUpsell}
            compact
            className="min-w-0 flex-1 py-3.5"
          />

          {/* Edit — icon only when out of stock to give the notify CTA full width */}
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className={`shrink-0 inline-flex items-center justify-center rounded-sm border-2 border-cream/20 bg-transparent text-cream/70 transition-all hover:border-cream/40 hover:text-cream ${
              ctaOutOfStock
                ? "p-3.5"
                : "gap-1.5 px-3.5 py-3.5 text-[13px] font-bold"
            }`}
            aria-label="ערוך אפשרויות"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden>
              <path d="M13.586 3.586a2 2 0 1 1 2.828 2.828l-8.5 8.5-3.5.672.672-3.5 8.5-8.5z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {!ctaOutOfStock ? "ערוך" : null}
          </button>
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
          className="pdp-desktop-panel sticky top-[var(--site-header-h)] flex h-below-header w-2/5 shrink-0 flex-col border-e border-line/50 bg-cream"
        >
          {/* Header — title + price */}
          <div className="pdp-d-header shrink-0">
            <h1 className="pdp-d-title font-display font-bold leading-snug tracking-tight text-ink">
              {bundleEnabled && bundleUpsell?.bundleProductCategory
                ? bundleUpsell.bundleProductCategory
                : product.category}{" "}
              <span className="text-clay" style={{ fontFamily: "var(--font-nunito)" }}>MESUDAR</span>
            </h1>

            <div className="pdp-d-price-row flex items-baseline gap-3">
              <p className="pdp-d-price font-display font-bold text-ink">{formatILS(totalPrice)}</p>
              {compareAtPrice && compareAtPrice > totalPrice && (
                <p className="text-base text-stone/50 line-through">{formatILS(compareAtPrice)}</p>
              )}
            </div>
          </div>

          {/* Selectors */}
          <div className="pdp-d-selectors shrink-0 border-t border-line/40">
            <div className="flex flex-col">
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
            <div className="pdp-d-bundle min-h-0 flex-1">
              <BundleUpsell
                bundle={bundleUpsell}
                sizeId={selectedSizeId}
                checked={bundleEnabled}
                onChange={handleBundleToggle}
                mainInStock={selectedVariant.inStock}
              />
            </div>
          ) : null}

          {companionLink ? (
            <div className="pdp-d-companion shrink-0">
              <ProductCompanionLink
                href={companionLink.href}
                label={companionLink.label}
              />
            </div>
          ) : null}

          {/* bottom padding so content doesn't hide behind the floating bar */}
          <div className="pdp-d-cta mt-auto shrink-0 pb-24" />
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

      {/* Clearance for fixed floating buy bar (mobile) */}
      <div
        className="shrink-0 lg:hidden"
        style={{
          height:
            "calc(var(--pdp-floating-bar-h, 5.5rem) + env(safe-area-inset-bottom, 0px))",
        }}
        aria-hidden
      />
    </div>
  );
}
