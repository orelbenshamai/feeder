"use client";

import { useMemo, useState } from "react";
import type { Product, ProductColorId, ProductSizeId } from "@/types/product";
import {
  getAvailableColorsForSize,
  getGalleryImagesForSelection,
  getProductDisplayImage,
  getVariantBySize,
  resolveColorForSize,
} from "@/lib/products";
import ProductGallery from "./ProductGallery";
import ProductPurchaseCard from "./ProductPurchaseCard";
import ProductAboutPanel from "./ProductAboutPanel";
import ProductFeaturesGrid from "./ProductFeaturesGrid";
import VariantSizeSelector from "./VariantSizeSelector";
import VariantColorSelector from "./VariantColorSelector";
import AddToCartButton from "./AddToCartButton";
import { formatILS } from "@/lib/pricing";

type ProductDetailProps = {
  product: Product;
};

export default function ProductDetail({ product }: ProductDetailProps) {
  const defaultSize =
    product.variants[1]?.id ?? product.variants[0]?.id ?? "medium";
  const defaultColor =
    getAvailableColorsForSize(product, defaultSize)[0]?.id ??
    product.colors[0]?.id ??
    "gray";

  const [selectedSizeId, setSelectedSizeId] = useState<ProductSizeId>(defaultSize);
  const [selectedColorId, setSelectedColorId] =
    useState<ProductColorId>(defaultColor);

  const handleSelectSize = (sizeId: ProductSizeId) => {
    setSelectedSizeId(sizeId);
    setSelectedColorId((current) => resolveColorForSize(product, sizeId, current));
  };

  const selectedVariant = useMemo(
    () => getVariantBySize(product, selectedSizeId),
    [product, selectedSizeId],
  );

  const galleryImages = useMemo(
    () => getGalleryImagesForSelection(product, selectedSizeId, selectedColorId),
    [product, selectedSizeId, selectedColorId],
  );

  const displayImageUrl = useMemo(
    () => getProductDisplayImage(product, selectedSizeId, selectedColorId),
    [product, selectedSizeId, selectedColorId],
  );

  const availableColors = useMemo(
    () => getAvailableColorsForSize(product, selectedSizeId),
    [product, selectedSizeId],
  );

  const selectedColorLabel =
    product.colors.find((color) => color.id === selectedColorId)?.label ??
    product.colors[0]?.label ??
    "";

  return (
    <>
      {/* ── MOBILE ─────────────────────────────────────────────────────── */}
      <div className="lg:hidden">
        <ProductGallery
          images={galleryImages}
          variant={selectedVariant}
          productName={product.name}
          variantImageUrl={displayImageUrl}
        />

        <div className="px-5 py-8 sm:px-8">
          <p className="category-label">{product.category}</p>
          <h1 className="product-title mt-3">{product.name}</h1>
          <div className="mt-4 flex items-end gap-3">
            <p className="product-price">{formatILS(selectedVariant.price)}</p>
            {selectedVariant.compareAtPrice ? (
              <p className="pb-1 text-sm text-stone line-through">
                {formatILS(selectedVariant.compareAtPrice)}
              </p>
            ) : null}
          </div>
          <p className="section-lead mt-4 max-w-none">{product.description}</p>

          <div className="mt-8 space-y-6">
            <VariantSizeSelector
              variants={product.variants}
              selectedId={selectedSizeId}
              onSelect={handleSelectSize}
            />
            <VariantColorSelector
              colors={availableColors}
              selectedId={selectedColorId}
              onSelect={setSelectedColorId}
            />
          </div>

          <div className="mt-8">
            <AddToCartButton
              product={product}
              variant={selectedVariant}
              colorId={selectedColorId}
              colorLabel={selectedColorLabel}
            />
            <p className="text-caption mt-3 text-center">
              משלוח חינם לכל הארץ · 3–5 ימי עסקים
            </p>
            <p className="text-caption mt-2 text-center">
              הנחת הרשמה מוקדמת חלה בקופה.
            </p>
          </div>
        </div>
      </div>

      {/* ── DESKTOP — hero + straddling purchase card + about ───────────── */}
      <section className="relative hidden lg:block">
        <div className="relative min-h-[calc(100svh-var(--site-header-h))]">
          <ProductGallery
            images={galleryImages}
            variant={selectedVariant}
            productName={product.name}
            variantImageUrl={displayImageUrl}
            overlayControls
            className="min-h-[calc(100svh-var(--site-header-h))]"
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-cream/70 via-ink/20 to-ink/45" />
        </div>

        {/* Anchor at hero bottom — gallery block above, checkout block below */}
        <div className="pointer-events-none absolute start-10 top-[calc(100svh-var(--site-header-h))] z-20 w-[min(420px,34vw)] -translate-y-[calc(100%-11rem)] xl:start-14">
          <div className="pointer-events-auto">
            <ProductPurchaseCard
              product={product}
              selectedVariant={selectedVariant}
              selectedSizeId={selectedSizeId}
              selectedColorId={selectedColorId}
              availableColors={availableColors}
              onSelectSize={handleSelectSize}
              onSelectColor={setSelectedColorId}
            />
          </div>
        </div>

        <div className="bg-cream px-10 pb-20 pt-20 xl:px-14 xl:pb-24 xl:pt-24">
          <div
            dir="ltr"
            className="mx-auto grid max-w-7xl grid-cols-12 items-start gap-x-12 xl:gap-x-16"
          >
            <div className="col-span-6 xl:col-span-7" dir="rtl">
              <ProductAboutPanel
                product={product}
                className="lg:border-t-0 lg:pt-0"
              />
            </div>
            <div className="col-span-6 xl:col-span-5" aria-hidden="true" />
          </div>
        </div>
      </section>

      <div className="lg:hidden px-5 sm:px-8">
        <ProductAboutPanel product={product} />
      </div>

      <ProductFeaturesGrid product={product} />
    </>
  );
}
