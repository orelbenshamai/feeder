"use client";

import type {
  Product,
  ProductColor,
  ProductColorId,
  ProductSizeId,
  ProductVariant,
} from "@/types/product";
import { formatILS } from "@/lib/pricing";
import VariantSizeSelector from "./VariantSizeSelector";
import VariantColorSelector from "./VariantColorSelector";
import AddToCartButton from "./AddToCartButton";

type ProductPurchaseCardProps = {
  product: Product;
  selectedVariant: ProductVariant;
  selectedSizeId: ProductSizeId;
  selectedColorId: ProductColorId;
  availableColors: ProductColor[];
  onSelectSize: (id: ProductSizeId) => void;
  onSelectColor: (id: ProductColorId) => void;
  className?: string;
};

const DELIVERY_NOTE = "משלוח חינם לכל הארץ · 3–5 ימי עסקים";

export default function ProductPurchaseCard({
  product,
  selectedVariant,
  selectedSizeId,
  selectedColorId,
  availableColors,
  onSelectSize,
  onSelectColor,
  className = "",
}: ProductPurchaseCardProps) {
  const selectedColorLabel =
    product.colors.find((color) => color.id === selectedColorId)?.label ??
    product.colors[0]?.label ??
    "";

  return (
    <div className={`surface-card overflow-hidden ${className}`}>
      {/* On gallery: title, price, size, color */}
      <div className="p-8 sm:p-9">
        <h1 className="product-title">{product.name}</h1>

        <div className="mt-5 flex items-end justify-between gap-4 border-b border-line/70 pb-6">
          <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
            <p className="product-price">{formatILS(selectedVariant.price)}</p>
            {selectedVariant.compareAtPrice ? (
              <p className="pb-1 text-sm text-stone line-through">
                {formatILS(selectedVariant.compareAtPrice)}
              </p>
            ) : null}
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <span className="font-semibold text-ink">4.9</span>
            <div className="flex gap-0.5 text-clay" aria-hidden>
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor">
                  <path d="M10 1.5l2.2 4.6 5 .5-3.8 3.4 1.1 5L10 13.2l-4.5 2.3 1.1-5L2.8 6.6l5-.5L10 1.5Z" />
                </svg>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6 pt-6">
          <VariantSizeSelector
            variants={product.variants}
            selectedId={selectedSizeId}
            onSelect={onSelectSize}
          />
          <VariantColorSelector
            colors={availableColors}
            selectedId={selectedColorId}
            onSelect={onSelectColor}
          />
        </div>
      </div>

      {/* On about section: checkout + delivery */}
      <div className="border-t border-line/70 bg-cream px-8 pb-8 pt-6 sm:px-9 sm:pb-9">
        <AddToCartButton
          product={product}
          variant={selectedVariant}
          colorId={selectedColorId}
          colorLabel={selectedColorLabel}
        />
        <p className="text-caption mt-3 text-center leading-relaxed">{DELIVERY_NOTE}</p>
        <p className="text-caption mt-2 text-center leading-relaxed">
          הנחת הרשמה מוקדמת חלה בקופה.
        </p>
      </div>
    </div>
  );
}
