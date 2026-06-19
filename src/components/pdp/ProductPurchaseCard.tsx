"use client";

import type {
  BundleUpsellOffer,
  Product,
  ProductColor,
  ProductColorId,
  ProductSizeId,
  ProductVariant,
} from "@/types/product";
import { formatILS } from "@/lib/pricing";
import {
  getBundleCompareAtPrice,
  getBundleTotalPrice,
} from "@/lib/bundles/pricing";
import VariantSizeSelector from "./VariantSizeSelector";
import VariantColorSelector from "./VariantColorSelector";
import BundleUpsell from "./BundleUpsell";
import ProductCompanionLink from "./ProductCompanionLink";

type ProductPurchaseCardProps = {
  product: Product;
  selectedVariant: ProductVariant;
  selectedSizeId: ProductSizeId;
  selectedColorId: ProductColorId;
  availableColors: ProductColor[];
  onSelectSize: (id: ProductSizeId) => void;
  onSelectColor: (id: ProductColorId) => void;
  bundleUpsell?: BundleUpsellOffer;
  bundleEnabled: boolean;
  onBundleChange: (enabled: boolean) => void;
  className?: string;
  companionLink?: {
    href: string;
    label: string;
  };
};

function Stars({ rating = 4.9, count = 127 }: { rating?: number; count?: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5 text-clay" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => (
          <svg key={i} viewBox="0 0 20 20" className="h-5 w-5" fill="currentColor">
            <path d="M10 1.5l2.2 4.6 5 .5-3.8 3.4 1.1 5L10 13.2l-4.5 2.3 1.1-5L2.8 6.6l5-.5L10 1.5Z" />
          </svg>
        ))}
      </div>
      <span className="text-base font-bold text-ink">{rating}</span>
      <span className="text-sm text-stone">({count} ביקורות)</span>
    </div>
  );
}

export default function ProductPurchaseCard({
  product,
  selectedVariant,
  selectedSizeId,
  selectedColorId,
  availableColors,
  onSelectSize,
  onSelectColor,
  bundleUpsell,
  bundleEnabled,
  onBundleChange,
  className = "",
  companionLink,
}: ProductPurchaseCardProps) {
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
    <div className={`purchase-card overflow-hidden ${className}`}>
      {/* Header */}
      <div className="px-7 pb-5 pt-7">
        <Stars />

        <h1 className="product-title mt-2">
          {product.category}{" "}
          <span className="text-clay" style={{ fontFamily: "var(--font-nunito)" }}>MESUDAR</span>
        </h1>

        <div className="mt-3 flex items-end gap-3">
          <p className="product-price leading-none">{formatILS(totalPrice)}</p>
          {compareAtPrice && compareAtPrice > totalPrice ? (
            <p className="pb-0.5 text-[15px] text-stone line-through">
              {formatILS(compareAtPrice)}
            </p>
          ) : null}
        </div>
      </div>

      {/* Divider */}
      <div className="mx-7 border-t border-line/50" />

      {/* Options */}
      <div className="space-y-5 px-7 py-5">
        <VariantSizeSelector
          variants={product.variants}
          selectedId={selectedSizeId}
          onSelect={onSelectSize}
          labelClassName="purchase-label"
          compact
        />
        <VariantColorSelector
          colors={availableColors}
          selectedId={selectedColorId}
          onSelect={onSelectColor}
          labelClassName="purchase-label"
        />
        {bundleUpsell ? (
          <BundleUpsell
            bundle={bundleUpsell}
            sizeId={selectedSizeId}
            checked={bundleEnabled}
            onChange={onBundleChange}
          />
        ) : null}
      </div>

      {companionLink ? (
        <div className="px-7 pb-7 pt-2">
          <ProductCompanionLink
            href={companionLink.href}
            label={companionLink.label}
          />
        </div>
      ) : <div className="pb-4" />}
    </div>
  );
}
